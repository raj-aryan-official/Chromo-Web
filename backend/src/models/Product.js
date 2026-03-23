const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g., '1 Litre', '4 Litre', '10 Litre', '20 Litre'
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, required: true }, // 'Interior', 'Exterior', 'Primer'
  colorHex: { type: String }, // Used as a thumbnail color representation
  description: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  variants: [variantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
