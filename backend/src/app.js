const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS Configuration for both localhost and production
const corsOptions = {
  origin: function (origin, callback) {
    // During active testing, let's log the origin to see what the phone is sending
    console.log("Incoming request origin:", origin);
    
    // For local development on phones, it's safer to just allow all origins
    // or you can revert to the regex if you prefer strict security
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Main Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Basic route to check if server is awake
app.get('/', (req, res) => {
  res.send('Chromo API is running');
});

module.exports = app;
