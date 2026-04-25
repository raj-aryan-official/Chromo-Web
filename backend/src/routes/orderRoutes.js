const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');

router.post('/', createOrder);
// Admin: get ALL orders — must be before /:uid
router.get('/all', getAllOrders);
router.get('/:uid', getUserOrders);

module.exports = router;
