import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080' });

// Attach JWT to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  API.post('/api/auth/login', { email, password });

export const register = (username, email, password) =>
  API.post('/api/auth/register', { username, email, password });

export const getMe = () =>
  API.get('/api/user/me');

export default API;