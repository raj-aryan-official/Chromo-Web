const Product = require('../models/Product');

// @desc    Get all active paint products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const updatedProducts = products.map(product => {
      const p = product.toObject();
      const isNew = new Date(p.createdAt) >= fifteenDaysAgo;
      
      if (!p.tags) p.tags = [];
      if (isNew && !p.tags.includes('new')) {
        p.tags.push('new');
      }
      return p;
    });

    res.json(updatedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching products.' });
  }
};

// @desc    Get single paint product perfectly formatted for ProductPage constraints
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching product by ID.' });
  }
};

module.exports = { getProducts, getProductById };
