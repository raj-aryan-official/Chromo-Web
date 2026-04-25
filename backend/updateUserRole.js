/**
 * Script to Set User as Admin
 * Usage: node updateUserRole.js <email>
 * Example: node updateUserRole.js rajaryan620666@gmail.com
 */

const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const updateUserToAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get email from command line argument or use default
    let adminEmail = process.argv[2];

    // If no email provided, show menu
    if (!adminEmail) {
      console.log('📋 Available users in database:');
      const users = await User.find({}, { name: 1, email: 1, role: 1 });
      
      if (users.length === 0) {
        console.log('❌ No users found in database');
        await mongoose.connection.close();
        return;
      }

      users.forEach((u, index) => {
        console.log(`  ${index + 1}. ${u.name || 'N/A'} (${u.email}) - Role: ${u.role}`);
      });

      console.log('\n📌 Usage: node updateUserRole.js <email>');
      console.log('   Example: node updateUserRole.js rajaryan620666@gmail.com\n');
      
      await mongoose.connection.close();
      return;
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`❌ User with email "${adminEmail}" not found`);
      console.log('\n📋 Available users:');
      const users = await User.find({}, { name: 1, email: 1, role: 1 });
      users.forEach(u => {
        console.log(`  - ${u.name || 'N/A'} (${u.email}) - Role: ${u.role}`);
      });
    } else {
      console.log(`✅ SUCCESS! User is now ADMIN\n`);
      console.log(`📊 Updated User Details:`);
      console.log(`   Name: ${updatedUser.name || 'N/A'}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Role: ${updatedUser.role} ✨`);
      console.log(`   Updated At: ${updatedUser.updatedAt}`);
      
      console.log(`\n🔓 Admin Access Available`);
      console.log(`   You can now login with: ${updatedUser.email}`);
      console.log(`   Navigate to: http://localhost:5173/admin`);
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
    allUsers.forEach(u => {
      const roleIcon = u.role === 'admin' ? '👑' : '👤';
      console.log(`  ${roleIcon} ${u.name || 'N/A'} (${u.email}) - Role: ${u.role}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Script completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateUserToAdmin();
