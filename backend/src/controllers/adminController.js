const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * @desc    Add a new product to the database
 * @route   POST /api/admin/products
 * @access  Admin only
 */
const addProduct = async (req, res) => {
  try {
    const { name, company, type, colorHex, description, tags, variants } = req.body;

    // Validate required fields
    if (!name || !company || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, company, type' 
      });
    }

    // Validate variants
    if (!variants || variants.length === 0) {
      return res.status(400).json({ 
        message: 'At least one variant (weight & price) is required' 
      });
    }

    // Check for duplicate product (same name, company, and type)
    const existingProduct = await Product.findOne({
      name: { $regex: `^${name}$`, $options: 'i' }, // Case-insensitive
      company: { $regex: `^${company}$`, $options: 'i' },
      type
    });

    if (existingProduct) {
      return res.status(409).json({ 
        message: `Product "${name}" by "${company}" (${type}) already exists`,
        existingProduct: {
          id: existingProduct._id,
          name: existingProduct.name,
          company: existingProduct.company,
          type: existingProduct.type
        }
      });
    }

    // Create new product
    const product = new Product({
      name,
      company,
      type,
      colorHex: colorHex || '#FFFFFF',
      description: description || '',
      tags: tags || [],
      variants
    });

    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ 
      message: 'Error adding product', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/admin/products/:id
 * @access  Admin only
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, type, colorHex, description, tags, variants } = req.body;

    // Validate product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (company) product.company = company;
    if (type) product.type = type;
    if (colorHex) product.colorHex = colorHex;
    if (description) product.description = description;
    if (tags) product.tags = tags;
    if (variants && variants.length > 0) product.variants = variants;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a product from the database
 * @route   DELETE /api/admin/products/:id
 * @access  Admin only
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      deletedProduct: product
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all orders with customer and product details
 * @route   GET /api/admin/orders
 * @access  Admin only
 */
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate product details
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });

    // Enrich with user data (name, email, phone)
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ firebaseUid: order.firebaseUid });
        return {
          ...order.toObject(),
          customerName: user?.name || 'Unknown',
          customerEmail: user?.email || 'Unknown',
          customerPhone: order.contactInfo.phone
        };
      })
    );

    res.json({
      message: 'Orders fetched successfully',
      totalOrders: enrichedOrders.length,
      orders: enrichedOrders
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update the status of an order
 * @route   PUT /api/admin/orders/:id/status
 * @access  Admin only
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get order statistics (optional - useful for admin dashboard)
 * @route   GET /api/admin/stats
 * @access  Admin only
 */
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      message: 'Order statistics fetched successfully',
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};
