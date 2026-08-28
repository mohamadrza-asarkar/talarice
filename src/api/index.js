import client from './client';
import productsApi from './productsApi';
import amazingProductsApi from './amazingProductsApi';
import ordersApi from './ordersApi';
import blogApi from './blogApi';
import slidersApi from './slidersApi';
import couponsApi from './couponsApi';
import authApi from './authApi';
import reviewsApi from './reviewsApi';
import categoriesApi from './categoriesApi';
import cartApi from './cartApi';
import adminApi from './adminApi';
import healthApi from './healthApi';

export {
  client,
  productsApi,
  amazingProductsApi,
  ordersApi,
  blogApi,
  slidersApi,
  couponsApi,
  authApi,
  reviewsApi,
  categoriesApi,
  cartApi,
  adminApi,
  healthApi
};

export default {
  client,
  products: productsApi,
  amazingProducts: amazingProductsApi,
  orders: ordersApi,
  blog: blogApi,
  sliders: slidersApi,
  coupons: couponsApi,
  auth: authApi,
  reviews: reviewsApi,
  categories: categoriesApi,
  cart: cartApi,
  admin: adminApi,
  health: healthApi
};
