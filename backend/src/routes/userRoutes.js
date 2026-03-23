const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');

// @route   POST /api/users
// @desc    Register a new user in MongoDB upon successful Firebase Auth
router.post('/', registerUser);

// @route   GET /api/users/:uid
// @desc    Get user profile data using Firebase UID
router.get('/:uid', getUserProfile);

// @route   PUT /api/users/:uid
// @desc    Update Name and Address arrays
router.put('/:uid', updateUserProfile);

module.exports = router;
