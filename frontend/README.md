# Chromo — Frontend

React + Vite frontend for the Chromo paint discovery platform.

## Stack

- **React 18** with JSX
- **Vite 6** for dev server & bundling
- **CSS Modules** for scoped styling
- **Firebase Auth** for authentication
- **Lucide React** for icons

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Key Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/paints` | Paint Browser |
| `/product/:id` | Product Detail |
| `/palette-studio` | Palette Generator |
| `/calculator` | Paint Calculator |
| `/cart` | Shopping Cart |
| `/checkout/review` | Checkout |
| `/orders` | Order History |
| `/profile` | User Profile |
| `/liked-paints` | Liked Paints |
| `/saved-palettes` | Saved Palettes |
| `/admin` | Admin Dashboard |

See the [root README](../README.md) for full documentation.
