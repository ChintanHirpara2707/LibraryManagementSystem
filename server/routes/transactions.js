const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const { auth, adminAuth, userAuth, resourceOwnerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions with filtering and pagination (Admin only)
// @access  Private (Admin)
router.get('/', [
  adminAuth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['borrow', 'purchase', 'return']).withMessage('Invalid transaction type'),
  query('status').optional().isIn(['pending', 'active', 'completed', 'overdue', 'cancelled']).withMessage('Invalid status'),
  query('userId').optional().isMongoId().withMessage('Invalid user ID'),
  query('bookId').optional().isMongoId().withMessage('Invalid book ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('sortBy').optional().isIn(['createdAt', 'dueDate', 'amount', 'status']).withMessage('Invalid sort field'),
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
      limit = 20,
      type,
      status,
      userId,
      bookId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (bookId) filter.book = bookId;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email membershipId')
        .populate('book', 'title author coverImage')
        .populate('processedBy', 'firstName lastName')
        .lean(),
      Transaction.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Transactions retrieved successfully',
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTransactions: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving transactions' 
    });
  }
});

// @route   GET /api/transactions/my
// @desc    Get current user's transactions
// @access  Private (User)
router.get('/my', [
  userAuth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['borrow', 'purchase', 'return']).withMessage('Invalid transaction type'),
  query('status').optional().isIn(['pending', 'active', 'completed', 'overdue', 'cancelled']).withMessage('Invalid status')
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
      limit = 20,
      type,
      status
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('book', 'title author coverImage')
        .lean(),
      Transaction.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Your transactions retrieved successfully',
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTransactions: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get my transactions error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving your transactions' 
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get a single transaction by ID
// @access  Private (Admin or transaction owner)
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'firstName lastName email membershipId')
      .populate('book', 'title author coverImage')
      .populate('processedBy', 'firstName lastName');

    if (!transaction) {
      return res.status(404).json({ 
        message: 'Transaction not found' 
      });
    }

    // Check if user can access this transaction
    if (req.user && req.user.role === 'admin') {
      // Admin can access any transaction
    } else if (req.user && req.user._id.toString() === transaction.user._id.toString()) {
      // User can access their own transaction
    } else {
      return res.status(403).json({ 
        message: 'Access denied' 
      });
    }

    res.json({
      message: 'Transaction retrieved successfully',
      transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid transaction ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while retrieving transaction' 
    });
  }
});

// @route   PUT /api/transactions/:id/status
// @desc    Update transaction status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  adminAuth,
  body('status')
    .isIn(['pending', 'active', 'completed', 'overdue', 'cancelled'])
    .withMessage('Invalid status specified'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
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

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ 
        message: 'Transaction not found' 
      });
    }

    const { status, notes } = req.body;
    const oldStatus = transaction.status;

    // Update status
    transaction.status = status;
    if (notes) transaction.notes = notes;

    // Handle status-specific logic
    if (status === 'completed' && oldStatus === 'active' && transaction.type === 'borrow') {
      transaction.returnDate = new Date();
      transaction.processedBy = req.user._id;
      
      // Update book availability
      const book = await Book.findById(transaction.book);
      if (book) {
        await book.returnBook();
      }
    }

    await transaction.save();

    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'firstName lastName email membershipId')
      .populate('book', 'title author coverImage')
      .populate('processedBy', 'firstName lastName');

    res.json({
      message: 'Transaction status updated successfully',
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid transaction ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating transaction status' 
    });
  }
});

// @route   GET /api/transactions/stats/overview
// @desc    Get transaction statistics overview (Admin only)
// @access  Private (Admin)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalTransactions,
      totalBorrows,
      totalPurchases,
      activeBorrows,
      overdueBorrows,
      completedTransactions,
      thisMonthTransactions,
      lastMonthTransactions,
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue
    ] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ type: 'borrow' }),
      Transaction.countDocuments({ type: 'purchase' }),
      Transaction.countDocuments({ type: 'borrow', status: 'active' }),
      Transaction.countDocuments({ type: 'borrow', status: 'overdue' }),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Transaction.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
      }),
      Transaction.aggregate([
        { $match: { type: 'purchase', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { 
          type: 'purchase', 
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { 
          type: 'purchase', 
          status: 'completed',
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      total: totalTransactions,
      byType: {
        borrows: totalBorrows,
        purchases: totalPurchases
      },
      byStatus: {
        active: activeBorrows,
        overdue: overdueBorrows,
        completed: completedTransactions
      },
      monthly: {
        thisMonth: thisMonthTransactions,
        lastMonth: lastMonthTransactions,
        percentageChange: lastMonthTransactions > 0 
          ? ((thisMonthTransactions - lastMonthTransactions) / lastMonthTransactions * 100).toFixed(1)
          : 0
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        thisMonth: thisMonthRevenue[0]?.total || 0,
        lastMonth: lastMonthRevenue[0]?.total || 0,
        percentageChange: lastMonthRevenue[0]?.total > 0 
          ? ((thisMonthRevenue[0]?.total - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total * 100).toFixed(1)
          : 0
      }
    };

    res.json({
      message: 'Transaction statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving transaction statistics' 
    });
  }
});

// @route   GET /api/transactions/stats/overdue
// @desc    Get overdue transactions (Admin only)
// @access  Private (Admin)
router.get('/stats/overdue', adminAuth, async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      type: 'borrow',
      status: 'overdue'
    })
    .populate('user', 'firstName lastName email membershipId')
    .populate('book', 'title author')
    .sort({ dueDate: 1 })
    .lean();

    // Calculate additional overdue info
    const overdueWithDetails = overdueTransactions.map(transaction => {
      const dueDate = new Date(transaction.dueDate);
      const today = new Date();
      const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      
      return {
        ...transaction,
        daysLate,
        estimatedFine: Math.min(daysLate * 0.50, 50) // $0.50 per day, max $50
      };
    });

    res.json({
      message: 'Overdue transactions retrieved successfully',
      overdueTransactions: overdueWithDetails,
      total: overdueWithDetails.length
    });

  } catch (error) {
    console.error('Get overdue transactions error:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving overdue transactions' 
    });
  }
});

// @route   POST /api/transactions/:id/process-return
// @desc    Process book return (Admin only)
// @access  Private (Admin)
router.post('/:id/process-return', [
  adminAuth,
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
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

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ 
        message: 'Transaction not found' 
      });
    }

    if (transaction.type !== 'borrow') {
      return res.status(400).json({ 
        message: 'Only borrow transactions can be processed for return' 
      });
    }

    if (transaction.status !== 'active' && transaction.status !== 'overdue') {
      return res.status(400).json({ 
        message: 'Transaction is not in active or overdue status' 
      });
    }

    // Process return
    await transaction.processReturn(req.user._id);

    // Update notes if provided
    if (req.body.notes) {
      transaction.notes = req.body.notes;
      await transaction.save();
    }

    // Update book availability
    const book = await Book.findById(transaction.book);
    if (book) {
      await book.returnBook();
    }

    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'firstName lastName email membershipId')
      .populate('book', 'title author coverImage')
      .populate('processedBy', 'firstName lastName');

    res.json({
      message: 'Book return processed successfully',
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error('Process return error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid transaction ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while processing return' 
    });
  }
});

// @route   GET /api/transactions/stats/user/:userId
// @desc    Get user's transaction statistics (Admin only)
// @access  Private (Admin)
router.get('/stats/user/:userId', adminAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    const [
      totalTransactions,
      totalBorrows,
      totalPurchases,
      activeBorrows,
      overdueBorrows,
      completedTransactions,
      totalSpent,
      totalFines
    ] = await Promise.all([
      Transaction.countDocuments({ user: userId }),
      Transaction.countDocuments({ user: userId, type: 'borrow' }),
      Transaction.countDocuments({ user: userId, type: 'purchase' }),
      Transaction.countDocuments({ user: userId, type: 'borrow', status: 'active' }),
      Transaction.countDocuments({ user: userId, type: 'borrow', status: 'overdue' }),
      Transaction.countDocuments({ user: userId, status: 'completed' }),
      Transaction.aggregate([
        { $match: { user: userId, type: 'purchase', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'borrow', status: 'overdue' } },
        { $group: { _id: null, total: { $sum: '$fine' } } }
      ])
    ]);

    const stats = {
      total: totalTransactions,
      byType: {
        borrows: totalBorrows,
        purchases: totalPurchases
      },
      byStatus: {
        active: activeBorrows,
        overdue: overdueBorrows,
        completed: completedTransactions
      },
      financial: {
        totalSpent: totalSpent[0]?.total || 0,
        totalFines: totalFines[0]?.total || 0
      }
    };

    res.json({
      message: 'User transaction statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get user transaction stats error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid user ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while retrieving user transaction statistics' 
    });
  }
});

module.exports = router;
