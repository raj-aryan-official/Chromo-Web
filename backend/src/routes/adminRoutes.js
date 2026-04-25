const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/adminController');

/**
 * Admin Routes - All protected by authMiddleware and isAdminMiddleware
 * Base path: /api/admin
 */

// Product Management Routes
/**
 * @route   POST /api/admin/products
 * @desc    Add a new product
 * @access  Admin only
 */
router.post('/products', authMiddleware, isAdminMiddleware, addProduct);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update an existing product
 * @access  Admin only
 */
router.put('/products/:id', authMiddleware, isAdminMiddleware, updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Admin only
 */
router.delete('/products/:id', authMiddleware, isAdminMiddleware, deleteProduct);

// Order Management Routes
/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with customer details
 * @access  Admin only
 */
router.get('/orders', authMiddleware, isAdminMiddleware, getAllOrders);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status (Processing → Shipped → Delivered)
 * @access  Admin only
 */
router.put('/orders/:id/status', authMiddleware, isAdminMiddleware, updateOrderStatus);

// Statistics Routes
/**
 * @route   GET /api/admin/stats
 * @desc    Get order statistics and metrics
 * @access  Admin only
 */
router.get('/stats', authMiddleware, isAdminMiddleware, getOrderStats);

module.exports = router;
