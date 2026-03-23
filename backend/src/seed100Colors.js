require('dotenv').config(); // Load from CWD (.env in backend root)
const mongoose = require('mongoose');
const Product = require('./models/Product');

const adjectives = ['Neon', 'Midnight', 'Arctic', 'Desert', 'Ocean', 'Crimson', 'Forest', 'Royal', 'Eclipse', 'Sunset', 'Cosmic', 'Velvet', 'Electric', 'Rustic', 'Cyber', 'Luminous'];
const nouns = ['Blue', 'Red', 'Green', 'Yellow', 'Violet', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Obsidian', 'Snow', 'Rose', 'Mint', 'Amber', 'Grape', 'Sky'];
const companies = ['Asian Paints', 'Nerolac', 'Berger Paints', 'Dulux', 'Sherwin-Williams', 'Chromo Custom'];
const types = ['Enamel', 'Matte', 'Satin', 'Primer'];

function generateRandomHex() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chromo';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for 100-Color Seeding...');

    // Wipe Legacy / Old Mock Data (e.g., Washing Machines etc)
    await Product.deleteMany({});
    console.log('Cleared all prior products.');

    const newPaints = [];

    while (newPaints.length < 100) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const name = `${adjective} ${noun} ${type}`;
      
      // Ensure specific colors stay unique
      if (newPaints.some(p => p.name === name)) continue;

      const basePrice = Math.floor(Math.random() * 2000) + 500;
      
      newPaints.push({
        name,
        company: companies[Math.floor(Math.random() * companies.length)],
        type,
        colorHex: generateRandomHex(),
        description: `Experience the ultra-premium finishing of ${name}. Highly durable, washable, and specifically engineered to bring your architectural vision exactly to life without compromise.`,
        rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1), // Random highly rated 3.8 - 5.0
        reviews: Math.floor(Math.random() * 1500) + 12,
        variants: [
          { weight: '1 Litre', price: basePrice, inventory: Math.floor(Math.random() * 100) + 10 },
          { weight: '4 Litre', price: basePrice * 3.8, inventory: Math.floor(Math.random() * 50) + 5 },
          { weight: '10 Litre', price: basePrice * 8.5, inventory: Math.floor(Math.random() * 30) + 2 },
          { weight: '20 Litre', price: basePrice * 16, inventory: Math.floor(Math.random() * 15) }
        ],
        image: ''
      });
    }

    await Product.insertMany(newPaints);
    console.log(`Successfully seeded exactly ${newPaints.length} premium paints into MongoDB!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedProducts();
