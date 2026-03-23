const mongoose = require('mongoose');

const defaultAddressSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  text: { type: String, required: true }
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String },
  company: { type: String },
  variant: {
    weight: { type: String, required: true },
    price: { type: Number, required: true }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: defaultAddressSchema,
    required: true
  },
  contactInfo: {
    phone: { type: String, required: true },
    altPhone: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
