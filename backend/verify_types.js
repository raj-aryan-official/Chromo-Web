const mongoose = require('mongoose');
const Product = require('./src/models/Product');
mongoose.connect('mongodb://127.0.0.1:27017/chromo').then(async () => {
  const products = await Product.find({});
  const types = {};
  products.forEach(p => {
    types[p.type] = (types[p.type] || 0) + 1;
  });
  console.log('Types in DB:', types);
  process.exit(0);
});
