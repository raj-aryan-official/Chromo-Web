const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  tag: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  text: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  altPhone: {
    type: String
  },
  // Role-based access control
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Allows the user to store multiple tagged delivery points
  addresses: [addressSchema],
  likedPaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  savedPalettes: [{ 
    name: { type: String, default: 'My Palette' }, 
    colors: [{ type: String }] 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
