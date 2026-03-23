const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, altPhone, address } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    if (user) {
      return res.status(400).json({ message: 'User already exists in MongoDB' });
    }

    const initialAddresses = [];
    if (address) {
      initialAddresses.push({ tag: 'Home', text: address, isDefault: true });
    }

    user = new User({ 
      firebaseUid, 
      name, 
      email, 
      phone: phone || '0000000000',
      altPhone: altPhone || '',
      addresses: initialAddresses 
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, phone, altPhone, addresses } = req.body;

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (altPhone !== undefined) user.altPhone = altPhone;
    if (addresses) {
      // Logic to ensure only 1 address is default if passed
      // Usually handled gracefully by frontend array replacement
      user.addresses = addresses;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, getUserProfile, updateUserProfile };
