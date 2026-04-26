require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateTags = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chromo';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for Tag Updating...');

    const products = await Product.find({});
    
    let updatedCount = 0;
    
    for (const prod of products) {
      if (!prod.tags) prod.tags = [];
      const hasInterior = prod.tags.includes('interior');
      const hasExterior = prod.tags.includes('exterior');
      
      // If neither tag is present, pick one or both based on product type or randomly if uncertain
      if (!hasInterior && !hasExterior) {
        if (prod.type && prod.type.toLowerCase().includes('enamel')) {
          prod.tags.push('interior', 'exterior'); // Enamels usually good for both
        } else if (prod.type && prod.type.toLowerCase().includes('satin')) {
          prod.tags.push('interior');
        } else if (prod.type && prod.type.toLowerCase().includes('matte')) {
          prod.tags.push('interior');
        } else if (prod.name.toLowerCase().includes('kit')) {
          prod.tags.push('interior');
        } else {
          // Fallback random assignment to ensure all products get tagged appropriately
          const rand = Math.random();
          if (rand < 0.4) {
            prod.tags.push('interior');
          } else if (rand < 0.7) {
            prod.tags.push('exterior');
          } else {
            prod.tags.push('interior', 'exterior');
          }
        }
        await prod.save();
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products with interior/exterior tags!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating tags:', error);
    process.exit(1);
  }
};

updateTags();
