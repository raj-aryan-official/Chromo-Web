const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    'VITE_API_URL is not defined. Please add VITE_API_URL to frontend/.env or frontend/.env.production.'
  );
}

export default API_URL;
