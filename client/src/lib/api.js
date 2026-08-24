import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxied to http://localhost:5173/api via vite.config.js
  withCredentials: true,
});

export default api;