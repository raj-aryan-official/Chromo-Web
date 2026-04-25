# Chromo — Backend

Node.js + Express REST API for the Chromo paint discovery platform.

## Stack

- **Node.js** + **Express 5**
- **MongoDB Atlas** + **Mongoose 9**
- **Firebase Admin SDK** for token verification
- **dotenv** for environment config

## Development

```bash
npm install
npm start        # Production (node)
npm run dev      # Development (nodemon)
```

## Environment Variables

Create a `.env` file in this directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chromo
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_SECRET=your_secure_secret
```

## API Endpoints

### Users — `/api/users`
- `POST /` — Register / sync user
- `GET /:uid` — Get user by Firebase UID
- `PUT /:uid` — Update profile
- `POST /:uid/like` — Toggle liked paint
- `POST /:uid/palette` — Save palette

### Products — `/api/products`
- `GET /` — All products
- `GET /:id` — Single product

### Cart — `/api/cart`
- `GET /:uid` — User cart
- `POST /:uid` — Add item
- `DELETE /:uid/:itemId` — Remove item

### Orders — `/api/orders`
- `POST /` — Place order
- `GET /all` — All orders (admin)
- `GET /:uid` — User orders

### Admin — `/api/admin`
- `POST /products` — Add product
- `PUT /products/:id` — Update product
- `DELETE /products/:id` — Delete product
- `PUT /orders/:id` — Update order status

## Admin Setup

To promote a user to admin role:

```bash
node updateUserRole.js user@email.com
```

See the [root README](../README.md) for full documentation.
