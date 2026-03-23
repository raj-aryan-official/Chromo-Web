require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./database/connection');
const Product = require('./models/Product');

const seedProducts = async () => {
  await connectDB();
  
  // Wipe to avoid duplicates during tests
  await Product.deleteMany();

  const products = [
    {
      name: 'Bespoke AI EcoBubble Platinum',
      company: 'Samsung',
      type: 'Industrial Machining',
      colorHex: '#121212',
      description: 'Smart Choice completely automated structural machine mimicking user required styling.',
      rating: 4.2,
      reviewCount: 1246,
      variants: [
        { weight: '8kg', price: 35000 },
        { weight: '12kg', price: 44990 }
      ]
    },
    {
      name: 'Midnight Blue Enamel',
      company: 'Asian Paints',
      type: 'Interior Emulsion',
      colorHex: '#191970',
      description: 'Premium emulsion with an elegant finish engineered for high durability interior walls.',
      rating: 4.8,
      reviewCount: 382,
      variants: [
        { weight: '1 Litre', price: 499 },
        { weight: '4 Litre', price: 1899 },
        { weight: '10 Litre', price: 4200 },
        { weight: '20 Litre', price: 8100 }
      ]
    },
    {
      name: 'Forest Mint Green',
      company: 'Berger Paints',
      type: 'Exterior Weatherproof',
      colorHex: '#98FF98',
      description: 'Weather-proof exterior coating providing protection against heavy rain and UV.',
      rating: 4.5,
      reviewCount: 890,
      variants: [
        { weight: '4 Litre', price: 2100 },
        { weight: '10 Litre', price: 5050 },
        { weight: '20 Litre', price: 9500 }
      ]
    },
    {
      name: 'Crimson Red Matte',
      company: 'Nerolac',
      type: 'Interior Matte',
      colorHex: '#DC143C',
      description: 'Deep, rich crimson designed for striking feature walls.',
      rating: 4.9,
      reviewCount: 512,
      variants: [
        { weight: '1 Litre', price: 550 },
        { weight: '4 Litre', price: 2100 }
      ]
    }
  ];

  await Product.insertMany(products);
  console.log('Database successfully seeded with Products.');
  process.exit();
};

seedProducts();
