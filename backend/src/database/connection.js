const mongoose = require('mongoose');

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.error('Error: MONGO_URI or MONGODB_URI environment variable is required to connect to MongoDB.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code}`);
    if (error.message.includes('SSL alert number 80')) {
      console.warn('--- TROUBLESHOOTING TIP ---');
      console.warn('SSL alert 80 (internal error) often means your IP address is not whitelisted in MongoDB Atlas.');
      console.warn('Please check "Network Access" in your MongoDB Atlas dashboard.');
      console.warn('---------------------------');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
