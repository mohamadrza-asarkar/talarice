// -------------------------------------------------------------
// Legacy Bridge - Re-exports from /src/api/* (Native Fetch)
// -------------------------------------------------------------
export {
  client,
  client as apiClient,
  request,
  API_BASE_URL,
  getStoredToken,
  setStoredToken,
  authApi,
  normalizeUser,
  productsApi,
  normalizeProduct,
  ordersApi,
  normalizeOrder,
  adminApi
} from '../api';
