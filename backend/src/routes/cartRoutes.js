const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateItemQuantity, removeFromCart, clearCart } = require('../controllers/cartController');

router.get('/:uid', getCart);
router.post('/:uid', addToCart);
router.put('/:uid/item/:itemId', updateItemQuantity);
router.delete('/:uid/item/:itemId', removeFromCart);
router.delete('/:uid/clear', clearCart);

module.exports = router;
