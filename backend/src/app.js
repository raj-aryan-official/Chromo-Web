const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

/* =========================
   ✅ Allowed Origins (NO SLASH)
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://newchromo.netlify.app',
  'https://www.newchromo.netlify.app',
  'https://chromo-web.vercel.app',
  'https://www.chromo-web.vercel.app'
];

/* =========================
   ✅ Extra Origins (ENV)
========================= */
const extraOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',')
      .map(url => url.trim())
      .filter(Boolean)
  : [];

/* =========================
   ✅ Final CORS Options
========================= */
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests like Postman / mobile apps
    if (!origin) return callback(null, true);

    const normalize = (url) => url.replace(/\/$/, '').toLowerCase();

    const validOrigins = [...allowedOrigins, ...extraOrigins].map(normalize);
    const requestOrigin = normalize(origin);

    if (validOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error('Not allowed by CORS: ' + origin));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/* =========================
   ✅ Middlewares
========================= */

// 🔥 IMPORTANT: CORS FIRST
app.use(cors(corsOptions));

// 🔥 Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

/* =========================
   ✅ Routes
========================= */
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

/* =========================
   ✅ Health Check
========================= */
app.get('/', (req, res) => {
  res.send('Chromo API is running 🚀');
});

/* =========================
   ✅ Export
========================= */
module.exports = app;