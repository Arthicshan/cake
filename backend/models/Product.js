const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter cake/product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      default: 'Cakes',
    },
    stock: {
      type: Number,
      required: [true, 'Please enter stock quantity'],
      default: 10,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
