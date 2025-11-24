const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const { auth, adminAuth, userAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with search, filtering, and pagination
// @access  Public (with optional auth for personalized features)
router.get('/', [
  optionalAuth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('category').optional().trim().isLength({ max: 50 }).withMessage('Category too long'),
  query('genre').optional().trim().isLength({ max: 50 }).withMessage('Genre too long'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
  query('available').optional().isBoolean().withMessage('Available must be boolean'),
  query('sortBy').optional().isIn(['title', 'author', 'price', 'rating', 'publishYear', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      category,
      genre,
      minPrice,
      maxPrice,
      available,
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) filter.category = category;
    if (genre) filter.genre = genre;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('addedBy', 'firstName lastName')
        .lean(),
      Book.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Add availability status for each book
    const booksWithStatus = books.map(book => ({
      ...book,
      availabilityStatus: book.isAvailable 
        ? (book.availableQuantity <= book.quantity * 0.2 ? 'low' : 'available')
        : 'unavailable'
    }));

    res.json({
      message: 'Books retrieved successfully',
      books: booksWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBooks: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving books' 
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName');

    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    // Add availability status
    const bookWithStatus = {
      ...book.toObject(),
      availabilityStatus: book.isAvailable 
        ? (book.availableQuantity <= book.quantity * 0.2 ? 'low' : 'available')
        : 'unavailable'
    };

    res.json({
      message: 'Book retrieved successfully',
      book: bookWithStatus
    });

  } catch (error) {
    console.error('Get book error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    res.status(500).json({ 
      message: 'Server error while retrieving book' 
    });
  }
});

// @route   POST /api/books
// @desc    Create a new book (Admin only)
// @access  Private (Admin)
router.post('/', [
  adminAuth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must not exceed 200 characters'),
  
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author is required and must not exceed 100 characters'),
  
  body('isbn')
    .optional()
    .trim()
    .matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
    .withMessage('Please enter a valid ISBN'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description is required and must not exceed 2000 characters'),
  
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must not exceed 50 characters'),
  
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Genre must not exceed 50 characters'),
  
  body('publisher')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Publisher must not exceed 100 characters'),
  
  body('publishYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage('Publish year must be between 1000 and next year'),
  
  body('pages')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Pages must be between 1 and 10000'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Language must not exceed 30 characters'),
  
  body('format')
    .optional()
    .isIn(['Hardcover', 'Paperback', 'E-Book', 'Audiobook', 'Digital'])
    .withMessage('Invalid format'),
  
  body('price')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Price must be between 0 and 1000'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be non-negative'),
  
  body('availableQuantity')
    .isInt({ min: 0 })
    .withMessage('Available quantity must be non-negative'),
  
  body('isForSale')
    .optional()
    .isBoolean()
    .withMessage('isForSale must be boolean'),
  
  body('isForBorrow')
    .optional()
    .isBoolean()
    .withMessage('isForBorrow must be boolean'),
  
  body('borrowDuration')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Borrow duration must be between 1 and 90 days'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must not exceed 30 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const bookData = {
      ...req.body,
      addedBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    // Ensure available quantity doesn't exceed total quantity
    if (bookData.availableQuantity > bookData.quantity) {
      bookData.availableQuantity = bookData.quantity;
    }

    // Set availability based on quantity
    bookData.isAvailable = bookData.availableQuantity > 0;

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'firstName lastName');

    res.status(201).json({
      message: 'Book created successfully',
      book: populatedBook
    });

  } catch (error) {
    console.error('Create book error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating book' 
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book (Admin only)
// @access  Private (Admin)
router.put('/:id', [
  adminAuth,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must not exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must not exceed 50 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Price must be between 0 and 1000'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be non-negative'),
  
  body('availableQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available quantity must be non-negative')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'addedBy' && key !== '_id') {
        book[key] = updates[key];
      }
    });

    // Update lastUpdatedBy
    book.lastUpdatedBy = req.user._id;

    // Ensure available quantity doesn't exceed total quantity
    if (book.availableQuantity > book.quantity) {
      book.availableQuantity = book.quantity;
    }

    // Set availability based on quantity
    book.isAvailable = book.availableQuantity > 0;

    await book.save();

    const updatedBook = await Book.findById(book._id)
      .populate('addedBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName');

    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });

  } catch (error) {
    console.error('Update book error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating book' 
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    // Check if book has active transactions
    const activeTransactions = await Transaction.find({
      book: book._id,
      status: { $in: ['active', 'overdue'] }
    });

    if (activeTransactions.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete book with active transactions' 
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Delete book error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while deleting book' 
    });
  }
});

// @route   POST /api/books/:id/borrow
// @desc    Borrow a book (User only)
// @access  Private (User)
router.post('/:id/borrow', [
  userAuth,
  body('borrowDuration')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Borrow duration must be between 1 and 90 days')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    if (!book.canBorrow()) {
      return res.status(400).json({ 
        message: 'Book is not available for borrowing' 
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({ 
        message: 'You already have this book borrowed' 
      });
    }

    // Calculate due date
    const borrowDuration = req.body.borrowDuration || book.borrowDuration;
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + borrowDuration * 24 * 60 * 60 * 1000);

    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      book: book._id,
      type: 'borrow',
      status: 'active',
      borrowDate,
      dueDate,
      amount: 0
    });

    await transaction.save();

    // Update book availability
    await book.borrowBook();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'firstName lastName membershipId')
      .populate('book', 'title author');

    res.status(201).json({
      message: 'Book borrowed successfully',
      transaction: populatedTransaction
    });

  } catch (error) {
    console.error('Borrow book error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while borrowing book' 
    });
  }
});

// @route   POST /api/books/:id/return
// @desc    Return a borrowed book (User only)
// @access  Private (User)
router.post('/:id/return', userAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    // Find active borrow transaction
    const transaction = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    });

    if (!transaction) {
      return res.status(400).json({ 
        message: 'You do not have this book borrowed' 
      });
    }

    // Process return
    await transaction.processReturn(req.user._id);

    // Update book availability
    await book.returnBook();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'firstName lastName membershipId')
      .populate('book', 'title author');

    res.json({
      message: 'Book returned successfully',
      transaction: populatedTransaction
    });

  } catch (error) {
    console.error('Return book error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while returning book' 
    });
  }
});

// @route   POST /api/books/:id/purchase
// @desc    Purchase a book (User only)
// @access  Private (User)
router.post('/:id/purchase', [
  userAuth,
  body('paymentMethod')
    .isIn(['cash', 'card', 'online', 'other'])
    .withMessage('Invalid payment method')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      });
    }

    if (!book.canPurchase()) {
      return res.status(400).json({ 
        message: 'Book is not available for purchase' 
      });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      book: book._id,
      type: 'purchase',
      status: 'completed',
      amount: book.price,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: 'completed'
    });

    await transaction.save();

    // Update book availability
    await book.purchaseBook();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'firstName lastName membershipId')
      .populate('book', 'title author');

    res.status(201).json({
      message: 'Book purchased successfully',
      transaction: populatedTransaction
    });

  } catch (error) {
    console.error('Purchase book error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while purchasing book' 
    });
  }
});

// @route   GET /api/books/categories
// @desc    Get all book categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json({
      message: 'Categories retrieved successfully',
      categories: categories.sort()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving categories' 
    });
  }
});

// @route   GET /api/books/genres
// @desc    Get all book genres
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json({
      message: 'Genres retrieved successfully',
      genres: genres.filter(genre => genre).sort()
    });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving genres' 
    });
  }
});

module.exports = router;
