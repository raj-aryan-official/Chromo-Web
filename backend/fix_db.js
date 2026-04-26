require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chromo';

mongoose.connect(mongoUri).then(async () => {
  // Delete all products that are NOT Paint but ALSO DO NOT have an image field.
  // This will clear out the procedural #FFFFFF swatches that look like paints.
  const res = await Product.deleteMany({
    type: { $ne: 'Paint' },
    $or: [{ image: { $exists: false } }, { image: '' }, { tags: 'paint' }] 
  });
  
  // Also delete tools falsely tagged as 'paint'
  const res2 = await Product.deleteMany({
    $and: [
      { type: { $ne: 'Paint' } },
      { tags: 'paint' }
    ]
  });

  console.log(`Deleted ${res.deletedCount} bad procedural accessories without images.`);
  console.log(`Deleted ${res2.deletedCount} tools accidentally tagged as paint.`);
  process.exit(0);
});
