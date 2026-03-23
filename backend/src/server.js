require('dotenv').config();
const app = require('./app');
const connectDB = require('./database/connection');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is successfully running and listening on port ${PORT}`);
});
