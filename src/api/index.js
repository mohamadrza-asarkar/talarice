import apiClient, { api } from './client';
import authAPI from './auth';
import productsAPI from './products';
import ordersAPI from './orders';
import slidersAPI from './sliders';
import blogAPI from './blog';
import usersAPI from './users';
import uploadAPI from './upload';

// Aggregate unified API instance
const API = {
  ...api,
  client: apiClient,
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  sliders: slidersAPI,
  blog: blogAPI,
  users: usersAPI,
  upload: uploadAPI,
};

export {
  apiClient,
  api,
  authAPI,
  productsAPI,
  ordersAPI,
  slidersAPI,
  blogAPI,
  usersAPI,
  uploadAPI,
};

export default API;
