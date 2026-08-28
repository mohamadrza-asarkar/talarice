import client from './client';
import productsApi from './productsApi';
import ordersApi from './ordersApi';
import blogApi from './blogApi';
import slidersApi from './slidersApi';
import couponsApi from './couponsApi';
import authApi from './authApi';
import reviewsApi from './reviewsApi';
import categoriesApi from './categoriesApi';

export {
  client,
  productsApi,
  ordersApi,
  blogApi,
  slidersApi,
  couponsApi,
  authApi,
  reviewsApi,
  categoriesApi
};

export default {
  client,
  products: productsApi,
  orders: ordersApi,
  blog: blogApi,
  sliders: slidersApi,
  coupons: couponsApi,
  auth: authApi,
  reviews: reviewsApi,
  categories: categoriesApi
};
