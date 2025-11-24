const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
  },
  description: {
    type: String,
    required: [true, 'Book description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Book category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [50, 'Genre cannot exceed 50 characters']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  publishYear: {
    type: Number,
    min: [1000, 'Publish year must be at least 1000'],
    max: [new Date().getFullYear() + 1, 'Publish year cannot be in the future']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1'],
    max: [10000, 'Pages cannot exceed 10000']
  },
  language: {
    type: String,
    default: 'English',
    trim: true,
    maxlength: [30, 'Language cannot exceed 30 characters']
  },
  format: {
    type: String,
    enum: ['Hardcover', 'Paperback', 'E-Book', 'Audiobook', 'Digital'],
    default: 'Paperback'
  },
  price: {
    type: Number,
    required: [true, 'Book price is required'],
    min: [0, 'Price cannot be negative'],
    max: [1000, 'Price cannot exceed $1000']
  },
  quantity: {
    type: Number,
    required: [true, 'Book quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative'],
    default: 0
  },
  coverImage: {
    type: String,
    default: ''
  },
  bookFile: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isForSale: {
    type: Boolean,
    default: true
  },
  isForBorrow: {
    type: Boolean,
    default: true
  },
  borrowDuration: {
    type: Number,
    default: 14,
    min: [1, 'Borrow duration must be at least 1 day'],
    max: [90, 'Borrow duration cannot exceed 90 days']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Text index for search functionality
bookSchema.index({
  title: 'text',
  author: 'text',
  description: 'text',
  category: 'text',
  genre: 'text',
  tags: 'text'
});

// Method to check if book can be borrowed
bookSchema.methods.canBorrow = function() {
  return this.isAvailable && this.isForBorrow && this.availableQuantity > 0;
};

// Method to check if book can be purchased
bookSchema.methods.canPurchase = function() {
  return this.isAvailable && this.isForSale && this.availableQuantity > 0;
};

// Method to update quantity
bookSchema.methods.updateQuantity = function(change) {
  this.quantity += change;
  this.availableQuantity += change;
  
  if (this.availableQuantity <= 0) {
    this.isAvailable = false;
  } else {
    this.isAvailable = true;
  }
  
  return this.save();
};

// Method to borrow book
bookSchema.methods.borrowBook = function() {
  if (this.canBorrow()) {
    this.availableQuantity -= 1;
    if (this.availableQuantity <= 0) {
      this.isAvailable = false;
    }
    return this.save();
  }
  throw new Error('Book cannot be borrowed');
};

// Method to return book
bookSchema.methods.returnBook = function() {
  this.availableQuantity += 1;
  this.isAvailable = true;
  return this.save();
};

// Method to purchase book
bookSchema.methods.purchaseBook = function() {
  if (this.canPurchase()) {
    this.availableQuantity -= 1;
    this.quantity -= 1;
    if (this.availableQuantity <= 0) {
      this.isAvailable = false;
    }
    return this.save();
  }
  throw new Error('Book cannot be purchased');
};

// Virtual for availability status
bookSchema.virtual('availabilityStatus').get(function() {
  if (!this.isAvailable) return 'unavailable';
  if (this.availableQuantity <= this.quantity * 0.2) return 'low';
  return 'available';
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
