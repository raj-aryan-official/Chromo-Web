const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, getUserProfile, updateUserProfile, toggleLikePaint, savePalette } = require('../controllers/userController');

// @route   POST /api/users
// @desc    Register a new user in MongoDB upon successful Firebase Auth
router.post('/', registerUser);

// @route   GET /api/users/profile
// @desc    Get authenticated user profile (requires authMiddleware)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

// @route   GET /api/users/:uid
// @desc    Get user profile data using Firebase UID
router.get('/:uid', getUserProfile);

// @route   PUT /api/users/:uid
// @desc    Update Name and Address arrays
router.put('/:uid', updateUserProfile);

// @route   POST /api/users/:uid/like
// @desc    Toggle a liked paint
router.post('/:uid/like', toggleLikePaint);

// @route   POST /api/users/:uid/palette
// @desc    Save a generated palette
router.post('/:uid/palette', savePalette);

module.exports = router;
