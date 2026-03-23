require('dotenv').config();
const connectDB = require('./database/connection');

// Connect to database
connectDB();

// A simple server setup to keep the process running briefly if needed
// or just exit if we only want to test connection
