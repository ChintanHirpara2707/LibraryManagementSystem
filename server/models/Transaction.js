const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  type: {
    type: String,
    enum: ['borrow', 'return', 'purchase'],
    required: [true, 'Transaction type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'overdue', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: function() {
      return this.type === 'purchase';
    },
    min: [0, 'Amount cannot be negative'],
    default: 0
  },
  fine: {
    type: Number,
    default: 0,
    min: [0, 'Fine cannot be negative']
  },
  borrowDate: {
    type: Date,
    required: function() {
      return this.type === 'borrow';
    }
  },
  dueDate: {
    type: Date,
    required: function() {
      return this.type === 'borrow';
    }
  },
  returnDate: {
    type: Date,
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'other'],
    required: function() {
      return this.type === 'purchase';
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    required: function() {
      return this.type === 'purchase';
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ user: 1, book: 1, type: 1, status: 1 });
transactionSchema.index({ dueDate: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

// Method to calculate fine
transactionSchema.methods.calculateFine = function() {
  if (this.type !== 'borrow' || this.status !== 'overdue') {
    return 0;
  }
  
  const today = new Date();
  const due = new Date(this.dueDate);
  const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
  
  if (daysLate <= 0) return 0;
  
  // 50 per day late
  const fine = daysLate * 0.50;
  this.fine = Math.min(fine, 50); // Cap fine at $0
  
  return this.fine;
};

// Method to check if transaction is overdue
transactionSchema.methods.isOverdue = function() {
  if (this.type !== 'borrow' || this.status !== 'active') {
    return false;
  }
  
  const today = new Date();
  const due = new Date(this.dueDate);
  
  if (today > due) {
    this.status = 'overdue';
    this.calculateFine();
    return true;
  }
  
  return false;
};

// Method to get transaction summary
transactionSchema.methods.getSummary = function() {
  const summary = {
    id: this._id,
    type: this.type,
    status: this.status,
    amount: this.amount,
    fine: this.fine,
    dates: {
      created: this.createdAt,
      due: this.dueDate,
      returned: this.returnDate
    }
  };
  
  if (this.type === 'borrow') {
    summary.isOverdue = this.isOverdue();
    if (summary.isOverdue) {
      summary.daysLate = Math.ceil((new Date() - new Date(this.dueDate)) / (1000 * 60 * 60 * 24));
    }
  }
  
  return summary;
};

// Method to process return
transactionSchema.methods.processReturn = function(processedBy) {
  if (this.type !== 'borrow' || this.status !== 'active') {
    throw new Error('Transaction cannot be returned');
  }
  
  this.status = 'completed';
  this.returnDate = new Date();
  this.processedBy = processedBy;
  
  // Calculate final fine if overdue
  if (this.isOverdue()) {
    this.calculateFine();
  }
  
  return this.save();
};

// Method to cancel transaction
transactionSchema.methods.cancelTransaction = function() {
  if (this.status === 'completed') {
    throw new Error('Completed transaction cannot be cancelled');
  }
  
  this.status = 'cancelled';
  return this.save();
};

// Static method to get overdue transactions
transactionSchema.statics.getOverdueTransactions = function() {
  return this.find({
    type: 'borrow',
    status: 'active',
    dueDate: { $lt: new Date() }
  }).populate('user', 'firstName lastName email membershipId')
    .populate('book', 'title author');
};

// Static method to get user's active borrows
transactionSchema.statics.getUserActiveBorrows = function(userId) {
  return this.find({
    user: userId,
    type: 'borrow',
    status: { $in: ['active', 'overdue'] }
  }).populate('book', 'title author coverImage');
};

// Virtual for total amount (including fine)
transactionSchema.virtual('totalAmount').get(function() {
  return this.amount + this.fine;
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);
