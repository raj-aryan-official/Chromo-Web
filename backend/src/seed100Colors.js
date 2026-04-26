require('dotenv').config(); // Load from CWD (.env in backend root)
const mongoose = require('mongoose');
const Product = require('./models/Product');

const adjectives = ['Neon', 'Midnight', 'Arctic', 'Desert', 'Ocean', 'Crimson', 'Forest', 'Royal', 'Eclipse', 'Sunset', 'Cosmic', 'Velvet', 'Electric', 'Rustic', 'Cyber', 'Luminous'];
const nouns = ['Blue', 'Red', 'Green', 'Yellow', 'Violet', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Obsidian', 'Snow', 'Rose', 'Mint', 'Amber', 'Grape', 'Sky'];
const companies = [
  'Asian Paints', 'Nerolac', 'Berger Paints', 'Dulux', 'Sherwin-Williams', 'Chromo Custom', 
  'Behr', 'Jotun', 'Nippon Paint', 'Indigo Paints', 'Shalimar Paints', 'JSW Paints', 'Kamdhenu Paints'
];

const categoryList = [
  'Paint', 
  'Painting Tools & Accessories', 
  'Primers & Wall Putty', 
  'Wall Coverings', 
  'Décor & Lighting', 
  'DIY Kits & Bundles', 
  'Specialty Paints', 
  'Adhesives & Sealants', 
  'Storage & Organization'
];

// Sub-items for categories (to construct real-sounding product names)
const subItemMap = {
  'Paint': ['Enamel', 'Matte', 'Satin Paint', 'Gloss Finish', 'Acrylic'],
  'Painting Tools & Accessories': ['Roller Kit', 'Pro Brush Set', 'Masking Tape', 'Drop Cloth', 'Paint Sprayer'],
  'Primers & Wall Putty': ['Acoustic Primer', 'Wall Putty Cement', 'Base Coat Primer', 'Anti-fungal Putty'],
  'Wall Coverings': ['Floral Wallpaper', 'Textured Mural', 'Vinyl Decal', 'Geometric Wallpaper'],
  'Décor & Lighting': ['LED Wall Fixture', 'Minimalist Mirror', 'Floating Shelf', 'Abstract Canvas Art'],
  'DIY Kits & Bundles': ['Room Makeover Kit', 'Starter Paint Kit', 'Accent Wall Bundle'],
  'Specialty Paints': ['Chalkboard Paint', 'Heat-Resistant Coat', 'Metallic Texture Finish'],
  'Adhesives & Sealants': ['Heavy-duty Wallpaper Glue', 'Silicone Sealant', 'Joint Compound'],
  'Storage & Organization': ['Pro Toolbox', 'Paint Canister Organizer', 'Heavy Duty Shelving']
};

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
    await Product.deleteMany({});
    console.log('Cleared all prior products.');

    const newPaints = [];

    while (newPaints.length < 100) {
      const category = 'Paint';
      
      let name, type, colorHex;
      
      if (category === 'Paint') {
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        type = subItemMap['Paint'][Math.floor(Math.random() * subItemMap['Paint'].length)];
        name = `${adjective} ${noun} ${type}`;
        colorHex = generateRandomHex();
      }
      
      // Ensure specific colors stay unique
      if (newPaints.some(p => p.name === name)) continue;

      const basePrice = Math.floor(Math.random() * 2000) + 500;
      
      const categoryTags = [type.toLowerCase(), companies[Math.floor(Math.random() * companies.length)].toLowerCase()];
      if (category === 'Paint') {
        categoryTags.push('paint', 'premium color');
      } else {
        categoryTags.push('accessory', category.toLowerCase());
      }
      
      const specialBadges = ['🌟 Best Seller', '❤️ Most Liked', '✨ Aesthetic', '💎 Premium', '🔥 Trending'];
      // 30% chance to get a special badge initially from seed
      if (Math.random() > 0.7) {
        categoryTags.push(specialBadges[Math.floor(Math.random() * specialBadges.length)]);
      }

      // Much older generation: between 0 and 150 days old, so "new" (<= 15) is only ~10%
      const randomDaysAgo = Math.floor(Math.random() * 150);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - randomDaysAgo);

      newPaints.push({
        name,
        company: companies[Math.floor(Math.random() * companies.length)],
        type,
        colorHex: generateRandomHex(),
        description: `Experience the ultra-premium finishing of ${name}. Highly durable, washable, and specifically engineered to bring your architectural vision exactly to life without compromise.`,
        rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1), // Random highly rated 3.8 - 5.0
        reviews: Math.floor(Math.random() * 1500) + 12,
        tags: categoryTags,
        variants: category === 'Paint' ? [
          { weight: '1 Litre', price: basePrice, inventory: Math.floor(Math.random() * 100) + 10 },
          { weight: '4 Litre', price: basePrice * 3.8, inventory: Math.floor(Math.random() * 50) + 5 },
          { weight: '10 Litre', price: basePrice * 8.5, inventory: Math.floor(Math.random() * 30) + 2 },
          { weight: '20 Litre', price: basePrice * 16, inventory: Math.floor(Math.random() * 15) }
        ] : [
          { weight: '1 Unit', price: basePrice, inventory: Math.floor(Math.random() * 100) + 10 },
          { weight: '2 Pack', price: basePrice * 1.8, inventory: Math.floor(Math.random() * 50) + 5 },
          { weight: '5 Pack', price: basePrice * 4.5, inventory: Math.floor(Math.random() * 30) + 2 },
        ],
        image: '',
        createdAt,
        updatedAt: createdAt
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
