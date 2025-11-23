import axios from 'axios';
import jwtDecode from 'jwt-decode';

/**
 * Minimal axios wrapper prepared for SimpleJWT access/refresh
 * - baseURL: change to your backend API root like "http://localhost:8000/api/"
 */

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach access token (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
