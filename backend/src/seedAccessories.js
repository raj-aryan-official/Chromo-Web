require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const companies = [
  'Asian Paints', 'Nerolac', 'Berger Paints', 'Dulux', 'Sherwin-Williams', 
  '3M', 'Stanley', 'Bosch', 'Chromo Custom Home', 'Home Depot Pro'
];

const accessoriesData = [
  // Painting Tools & Accessories
  { name: 'Pro Trigger Paint Sprayer', type: 'Painting Tools & Accessories', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Microfiber Roller Kit (6 Pieces)', type: 'Painting Tools & Accessories', img: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400' },
  { name: 'Heavy Duty Drop Cloth', type: 'Painting Tools & Accessories', img: 'https://images.unsplash.com/photo-1504311867140-5242d59acb51?w=400' },
  { name: 'Angled Trim Brush Pro 2"', type: 'Painting Tools & Accessories', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' },
  { name: 'Painter’s Tape Multi-Pack', type: 'Painting Tools & Accessories', img: 'https://images.unsplash.com/photo-1527014603681-3511ebfa4d23?w=400' },

  // Primers & Wall Putty
  { name: 'Ultra-Bond Interior Primer', type: 'Primers & Wall Putty', img: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400' },
  { name: 'Acrylic Wall Putty Cement', type: 'Primers & Wall Putty', img: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=400' },
  { name: 'Anti-fungal Base Coat', type: 'Primers & Wall Putty', img: 'https://images.unsplash.com/photo-1558618666-fdd25c84df18?w=400' },

  // Wall Coverings
  { name: 'Vintage Floral Wallpaper', type: 'Wall Coverings', img: 'https://images.unsplash.com/photo-1564507592209-4cefa3712d93?w=400' },
  { name: 'Geometric Abstract Mural', type: 'Wall Coverings', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400' },
  { name: '3D Textured Vinyl Decal', type: 'Wall Coverings', img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400' },

  // Décor & Lighting
  { name: 'Minimalist Linear Chandelier', type: 'Décor & Lighting', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400' },
  { name: 'Boho Rattan Mirror', type: 'Décor & Lighting', img: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400' },
  { name: 'Floating Oak Shelves (Set of 3)', type: 'Décor & Lighting', img: 'https://images.unsplash.com/photo-1595514535313-17b5e39bbd41?w=400' },
  { name: 'Abstract Canvas Wall Art', type: 'Décor & Lighting', img: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=400' },

  // DIY Kits & Bundles
  { name: 'Accent Wall Starter Kit', type: 'DIY Kits & Bundles', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400' },
  { name: 'Kids Room Makeover Bundle', type: 'DIY Kits & Bundles', img: 'https://images.unsplash.com/photo-1502672260266-1c1c24240f38?w=400' },

  // Specialty Paints
  { name: 'Matte Chalkboard Paint', type: 'Specialty Paints', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' },
  { name: 'Metallic Gold Texture Spray', type: 'Specialty Paints', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400' },
  { name: 'Heat-Resistant Engine Coat', type: 'Specialty Paints', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400' },

  // Adhesives & Sealants
  { name: 'Industrial Silicone Sealant', type: 'Adhesives & Sealants', img: 'https://images.unsplash.com/photo-1587840134442-9f3c3900df4a?w=400' }, // generic placeholder
  { name: 'Heavy-duty Wallpaper Glue', type: 'Adhesives & Sealants', img: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400' },
  { name: 'Crack Repair Joint Compound', type: 'Adhesives & Sealants', img: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=400' },

  // Storage & Organization
  { name: 'Pro Mechanic Toolbox XL', type: 'Storage & Organization', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
  { name: 'Wall Mount Tool Organizer', type: 'Storage & Organization', img: 'https://images.unsplash.com/photo-1501127122874-53c7c25143a5?w=400' },
  { name: 'Airtight Paint Canisters (4 Pcs)', type: 'Storage & Organization', img: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=400' },
];

const seedAccessories = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chromo';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for Accessory Seeding...');

    // Optionally delete existing non-paint products to avoid thousands of dupes
    await Product.deleteMany({ type: { $ne: 'Paint' }, tags: { $nin: ['paint'] } });
    console.log('Cleared out old accessories.');

    const newItems = [];
    const specialBadges = ['🌟 Best Seller', '❤️ Most Liked', '💎 Premium', '🔥 Trending'];

    accessoriesData.forEach(item => {
      const basePrice = Math.floor(Math.random() * 3000) + 150;
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      const tags = ['accessory', item.type.toLowerCase(), company.toLowerCase()];
      if (Math.random() > 0.6) {
        tags.push(specialBadges[Math.floor(Math.random() * specialBadges.length)]);
      }

      const randomDaysAgo = Math.floor(Math.random() * 150);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - randomDaysAgo);

      newItems.push({
        name: item.name,
        company: company,
        type: item.type,
        colorHex: '#3d3d4e', // Neutral background for images
        image: item.img,
        description: `Professional-grade ${item.name} manufactured by ${company} for premium results and extreme durability. Perfect for both DIY and Pro environments.`,
        rating: (Math.random() * (5 - 4.0) + 4.0).toFixed(1),
        reviewCount: Math.floor(Math.random() * 800) + 5,
        tags,
        variants: [
          { weight: '1 Unit', price: basePrice, stock: Math.floor(Math.random() * 100) + 10 },
          { weight: '2 Pack', price: basePrice * 1.8, stock: Math.floor(Math.random() * 50) + 5 },
          { weight: '5 Pack', price: basePrice * 4.2, stock: Math.floor(Math.random() * 30) + 2 },
        ],
        createdAt,
        updatedAt: createdAt
      });
    });

    await Product.insertMany(newItems);
    console.log(`Successfully seeded ${newItems.length} accessories and tools into MongoDB!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedAccessories();
