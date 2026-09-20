const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route: Get all products
// Private/Admin route: Create new product
router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

// Public route: Get product by ID
// Private/Admin route: Update / Delete product
router
  .route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
