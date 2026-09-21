// -------------------------------------------------------------
// Central API Exports
// Pure Native Fetch Implementation matching API_DOCUMENTATION.md
// -------------------------------------------------------------
export { client, request, API_BASE_URL, getImageUrl, getStoredToken, setStoredToken } from './client';
export { authApi, normalizeUser, unwrapDoc, normalizePhone } from './auth.api';
export { productsApi, normalizeProduct } from './products.api';
export { amazingProductsApi, normalizeAmazingProduct } from './amazing.api';
export { ordersApi, normalizeOrder } from './orders.api';
export { adminApi } from './admin.api';
export { slidesApi, normalizeSlide } from './slides.api';
export { cartApi } from './cart.api';
export { reviewsApi, normalizeReview } from './reviews.api';
export { storeApi } from './store.api';

// Default aggregated export
import { client } from './client';
import { authApi } from './auth.api';
import { productsApi } from './products.api';
import { amazingProductsApi } from './amazing.api';
import { ordersApi } from './orders.api';
import { adminApi } from './admin.api';
import { slidesApi } from './slides.api';
import { cartApi } from './cart.api';
import { reviewsApi } from './reviews.api';
import { storeApi } from './store.api';

export default {
  client,
  auth: authApi,
  products: productsApi,
  amazing: amazingProductsApi,
  orders: ordersApi,
  admin: adminApi,
  slides: slidesApi,
  cart: cartApi,
  reviews: reviewsApi,
  store: storeApi
};


