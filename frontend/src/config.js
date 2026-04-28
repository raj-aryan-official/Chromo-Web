const DEFAULT_API_URL = 'http://localhost:5000';

const normalizeApiUrl = (rawUrl) => {
  if (!rawUrl || String(rawUrl).trim() === '') {
    return DEFAULT_API_URL;
  }

  const url = String(rawUrl).trim();

  if (/^:\d+/.test(url)) {
    return `http://localhost${url}`;
  }

  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }

  return url;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export default API_URL;
