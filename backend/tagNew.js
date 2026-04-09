const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./src/models/Product');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("Connected to DB, assigning 'new' tags to 15 random paints...");
  const paints = await Product.find({});
  
  // Pick random 15 paints to make "new"
  const shuffled = paints.sort(() => 0.5 - Math.random());
  const selectedPaints = shuffled.slice(0, 15);
  
  for (let paint of selectedPaints) {
    if (!paint.tags.includes('new')) {
      paint.tags.push('new');
      await paint.save();
    }
  }
  
  console.log("Successfully tagged 15 paints as 'new'.");
  process.exit();
}).catch(console.error);
