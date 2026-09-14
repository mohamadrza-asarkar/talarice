// -------------------------------------------------------------
// Central API Exports
// Pure Native Fetch Implementation (No Axios / No XHR)
// -------------------------------------------------------------
export { client, request, API_BASE_URL, getStoredToken, setStoredToken } from './client';
export { authApi, normalizeUser } from './auth.api';
export { productsApi, normalizeProduct } from './products.api';
export { ordersApi, normalizeOrder } from './orders.api';
export { adminApi } from './admin.api';
export { slidesApi, normalizeSlide } from './slides.api';

// Default aggregated export
import { client } from './client';
import { authApi } from './auth.api';
import { productsApi } from './products.api';
import { ordersApi } from './orders.api';
import { adminApi } from './admin.api';
import { slidesApi } from './slides.api';

export default {
  client,
  auth: authApi,
  products: productsApi,
  orders: ordersApi,
  admin: adminApi,
  slides: slidesApi
};

