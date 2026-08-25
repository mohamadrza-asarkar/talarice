import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tala_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tala_token');
      localStorage.removeItem('token');
      localStorage.removeItem('tala_auth');
      window.location.href = '/profile'; // Redirecting to profile instead of /login since /login might not be a separate route
    }
    return Promise.reject(error.response?.data || { message: 'خطای ارتباط با سرور' });
  }
);

export default API;
