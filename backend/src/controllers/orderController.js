const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
  try {
    const { firebaseUid, items, shippingAddress, contactInfo, paymentMethod, totalAmount } = req.body;
    
    if (!firebaseUid || !items || !shippingAddress || !contactInfo || !contactInfo.phone || !paymentMethod || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order fields including contact routing.' });
    }

    const order = new Order({
      firebaseUid,
      items,
      shippingAddress,
      contactInfo,
      paymentMethod,
      totalAmount
    });

    await order.save();

    // Dynamically clear user's cart efficiently
    await Cart.findOneAndUpdate({ firebaseUid }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error processing Order', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { uid } = req.params;
    const orders = await Order.find({ firebaseUid: uid }).populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching Orders', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all Orders', error: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders };
