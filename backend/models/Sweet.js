const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Add index for better search performance
sweetSchema.index({ name: 'text' });

module.exports = mongoose.model('Sweet', sweetSchema);