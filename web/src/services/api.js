import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login    = (email, password) => API.post('/api/auth/login', { email, password });
export const register = (username, email, password, role) =>
  API.post('/api/auth/register', { username, email, password, role });

// Profile
export const getMe          = ()       => API.get('/api/user/me');
export const updateProfile  = (data)   => API.put('/api/profile', data);
export const uploadAvatar   = (file)   => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/api/profile/avatar', fd);
};

// Reports
export const getReports     = ()       => API.get('/api/reports');
export const createReport   = (data)   => API.post('/api/reports', data);
export const updateStatus   = (id, data) => API.put(`/api/reports/${id}/status`, data);
export const assignReport   = (id, data) => API.post(`/api/reports/${id}/assign`, data);
export const getCategories  = ()       => API.get('/api/reports/categories');
export const getHistory     = ()       => API.get('/api/reports/history');
export const getReportHistory = (id)   => API.get(`/api/reports/${id}/history`);

// Users (for employee assignment dropdown)
export const getUsers = () => API.get('/api/users');

export default API;