const User = require('../models/User');
const Product = require('../models/Product');

const getAdminEmails = () => {
  const envEmails = process.env.ADMIN_EMAILS || 'rajaryan620666@gmail.com';
  return envEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const registerUser = async (req, res) => {
  try {
    console.log("=== Incoming register payload ===", req.body);
    const { firebaseUid, name, email, phone, altPhone, address } = req.body;
    const adminEmails = getAdminEmails();
    const shouldBeAdmin = email && adminEmails.includes(email.toLowerCase());

    let user = await User.findOne({ firebaseUid });
    if (user) {
      console.log("Found user by firebaseUid", user.email);
      if (shouldBeAdmin && user.role !== 'admin') {
        await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
        user.role = 'admin';
      }
      return res.status(200).json(user);
    }

    if (email) {
      let existingEmail = await User.findOne({ email });
      if (existingEmail) {
        console.log("Found existing user by email, syncing firebaseUid", email);
        const updatedRole = shouldBeAdmin ? 'admin' : existingEmail.role;
        await User.updateOne(
          { _id: existingEmail._id },
          { $set: { firebaseUid, role: updatedRole } }
        );
        existingEmail.firebaseUid = firebaseUid;
        existingEmail.role = updatedRole;
        return res.status(200).json(existingEmail);
      }
    }

    const initialAddresses = [];
    if (address) {
      initialAddresses.push({ tag: 'Home', text: address, isDefault: true });
    }

    const safePhone = String(phone || '0000000000');
    console.log("Creating new user. safePhone:", safePhone);

    user = new User({ 
      firebaseUid, 
      name: name || 'User', 
      email: email || 'no-email@fallback.com', 
      phone: safePhone,
      altPhone: altPhone || '',
      role: shouldBeAdmin ? 'admin' : 'user',
      addresses: initialAddresses 
    });
    
    await user.save();
    console.log("Successfully created new user", user.email);
    
    res.status(201).json(user);
  } catch (error) {
    console.error("Register user error details:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    let user = await User.findOne({ firebaseUid: uid }).populate('likedPaints');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    const adminEmails = getAdminEmails();
    const shouldBeAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
    if (shouldBeAdmin && user.role !== 'admin') {
      await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
      user.role = 'admin';
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

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone || "0000000000";
    if (altPhone !== undefined) updateFields.altPhone = altPhone;
    if (addresses) updateFields.addresses = addresses;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const toggleLikePaint = async (req, res) => {
  try {
    const { uid } = req.params;
    const { productId } = req.body;
    
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ message: 'User not found in MongoDB' });
    
    const index = user.likedPaints.findIndex(id => id.toString() === productId);
    if (index === -1) {
      user.likedPaints.push(productId);
    } else {
      user.likedPaints.splice(index, 1);
    }
    
    await user.save();
    res.status(200).json(user.likedPaints);
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const savePalette = async (req, res) => {
  try {
    const { uid } = req.params;
    const { colors, name } = req.body;
    
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ message: 'User not found in MongoDB' });
    
    user.savedPalettes.push({ name: name || 'My Palette', colors });
    await user.save();
    
    res.status(200).json(user.savedPalettes);
  } catch (error) {
    console.error("Save palette error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, getUserProfile, updateUserProfile, toggleLikePaint, savePalette };
