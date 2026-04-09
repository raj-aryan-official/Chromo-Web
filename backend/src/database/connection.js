const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
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
