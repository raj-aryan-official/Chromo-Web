const mongoose = require('mongoose');
const Product = require('./src/models/Product');
mongoose.connect('mongodb://127.0.0.1:27017/chromo').then(async () => {
  const count = await Product.countDocuments();
  const acc = await Product.countDocuments({type: {$ne: 'Paint'}, tags: {$nin: ['paint']}});
  console.log('Total:', count, 'Accessories:', acc);
  process.exit(0);
});
