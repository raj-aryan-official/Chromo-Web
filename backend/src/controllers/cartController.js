const Cart = require('../models/Cart');

// @desc    Fetch active user cart, fully Populating child Products
// @route   GET /api/cart/:uid
const getCart = async (req, res) => {
  try {
    const { uid } = req.params;
    let cart = await Cart.findOne({ firebaseUid: uid }).populate('items.productId');
    
    // Auto-create a cart if the user navigates without one
    if (!cart) {
      cart = new Cart({ firebaseUid: uid, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching Cart', error: error.message });
  }
};

// @desc    Upsert newly added items to cart correctly accounting for variations
// @route   POST /api/cart/:uid
const addToCart = async (req, res) => {
  try {
    const { uid } = req.params;
    const { productId, variant, quantity } = req.body;

    let cart = await Cart.findOne({ firebaseUid: uid });
    if (!cart) {
      cart = new Cart({ firebaseUid: uid, items: [] });
    }

    // Match exact product AND specific physical weight variants avoiding overlaps
    const itemIndex = cart.items.findIndex(p => 
      p.productId.toString() === productId && p.variant.weight === variant.weight
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, variant, quantity });
    }

    await cart.save();
    
    // Repopulate Product data to refresh the client seamlessly.
    cart = await Cart.findOne({ firebaseUid: uid }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding to Cart', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { uid, itemId } = req.params;
    let cart = await Cart.findOne({ firebaseUid: uid });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    // Accurately filter out the specific subdocument ID
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    cart = await Cart.findOne({ firebaseUid: uid }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error removing from Cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { uid } = req.params;
    let cart = await Cart.findOne({ firebaseUid: uid });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = []; // Completely eradicate the cart
    await cart.save();
    
    cart = await Cart.findOne({ firebaseUid: uid }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error clearing Cart' });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { uid, itemId } = req.params;
    const { type } = req.body;
    
    let cart = await Cart.findOne({ firebaseUid: uid });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex > -1) {
       if (type === 'increment') {
         cart.items[itemIndex].quantity += 1;
       } else if (type === 'decrement') {
         cart.items[itemIndex].quantity -= 1;
       }
       
       // Clean up zero-quantity bounds effortlessly
       if (cart.items[itemIndex].quantity <= 0) {
         cart.items = cart.items.filter((_, idx) => idx !== itemIndex);
       }
       
       await cart.save();
    }
    
    cart = await Cart.findOne({ firebaseUid: uid }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating quantity' });
  }
};

module.exports = { getCart, addToCart, updateItemQuantity, removeFromCart, clearCart };
