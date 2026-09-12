import axios from 'axios';

// 1. Configuration & Base URL
const DEFAULT_REMOTE_BASE_URL = 'https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_REMOTE_BASE_URL;

export const TOKEN_STORAGE_KEY = 'tala_rice_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not store token:', err);
  }
}

// 2. Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Parse errors cleanly
apiClient.interceptors.response.use(
  (response) => {
    // Some Cloud Run dev environments return HTML auth check pages instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      const err = new Error('Remote API requires interactive browser authentication session');
      err.isAuthRedirect = true;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'خطا در برقراری ارتباط با سرور';
    return Promise.reject(new Error(message));
  }
);

// Helper to normalize product images and fields
export function normalizeProduct(p) {
  if (!p) return null;
  const id = p._id || p.id;
  const image = p.image || p.imageUrl || p.fullImageUrl || '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  const price = Number(p.price || p.originalPrice || 0);
  const originalPrice = Number(p.originalPrice || p.oldPrice || p.price || 0);
  const discountPercent = Number(p.discountPercent || p.dealDiscountPercent || 0);
  
  return {
    ...p,
    id,
    _id: id,
    name: p.name || 'برنج اصیل ایرانی',
    description: p.description || '',
    price,
    originalPrice,
    oldPrice: originalPrice,
    discountPercent,
    dealPrice: p.dealPrice || (discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : price),
    isAmazing: Boolean(p.isAmazing || discountPercent > 0),
    amazingExpiresAt: p.amazingExpiresAt || null,
    isAvailable: p.isAvailable !== false,
    stock: p.countInStock !== undefined ? p.countInStock : (p.stock !== undefined ? p.stock : 20),
    weight: p.weight || '۱۰ کیلوگرم',
    category: p.category || 'kamfirouz',
    rating: p.rating || 4.9,
    reviewsCount: p.reviews?.length || p.reviewsCount || 12,
    image,
    imageUrl: image,
    fullImageUrl: image
  };
}

// -------------------------------------------------------------
// 1. Auth API (/api/auth)
// -------------------------------------------------------------
export const authApi = {
  // 1.1 Register
  async register({ name, email, password, phone }) {
    const res = await apiClient.post('/auth/register', { name, email, password, phone });
    if (res.data?.data?.token) {
      setStoredToken(res.data.data.token);
    }
    return res.data;
  },

  // 1.2 Login
  async login({ email, password }) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.data?.token) {
      setStoredToken(res.data.data.token);
    }
    return res.data;
  },

  // 1.3 Get Current Profile
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // 1.4 Update Profile
  async updateProfile({ name, phone }) {
    const res = await apiClient.put('/auth/profile', { name, phone });
    return res.data;
  },

  // 1.5 Change Password
  async changePassword({ oldPassword, newPassword }) {
    const res = await apiClient.put('/auth/change-password', { oldPassword, newPassword });
    return res.data;
  },

  logout() {
    setStoredToken(null);
  }
};

// -------------------------------------------------------------
// 2. Products API (/api/products)
// -------------------------------------------------------------
export const productsApi = {
  // 2.1 Get Products with filter & search
  async getProducts(params = {}) {
    const res = await apiClient.get('/products', { params });
    const rawData = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    const normalized = rawData.map(normalizeProduct);
    return {
      success: res.data?.success ?? true,
      data: normalized,
      pagination: res.data?.pagination || {
        currentPage: 1,
        totalItems: normalized.length,
        totalPages: 1
      }
    };
  },

  // 2.2 Get Product by ID
  async getProductById(id) {
    const res = await apiClient.get(`/products/${id}`);
    const raw = res.data?.data || res.data;
    return {
      success: res.data?.success ?? true,
      data: normalizeProduct(raw)
    };
  },

  // 2.3 Create Product (Admin)
  async createProduct(productData) {
    const res = await apiClient.post('/products', productData);
    return {
      success: res.data?.success ?? true,
      data: normalizeProduct(res.data?.data || res.data)
    };
  },

  // 2.4 Update Product (Admin)
  async updateProduct(id, productData) {
    const res = await apiClient.put(`/products/${id}`, productData);
    return {
      success: res.data?.success ?? true,
      data: normalizeProduct(res.data?.data || res.data)
    };
  },

  // 2.5 Delete Product (Admin)
  async deleteProduct(id) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

// -------------------------------------------------------------
// 3. Amazing Products API (/api/amazing-products)
// -------------------------------------------------------------
export const amazingApi = {
  // 3.1 Get Amazing Products
  async getAmazingProducts(params = {}) {
    const res = await apiClient.get('/amazing-products', { params });
    const rawList = Array.isArray(res.data?.data) ? res.data.data : [];
    return {
      success: res.data?.success ?? true,
      data: rawList.map(normalizeProduct)
    };
  },

  // 3.2 Create Amazing Product
  async createAmazingProduct(data) {
    const res = await apiClient.post('/amazing-products', data);
    return {
      success: res.data?.success ?? true,
      data: normalizeProduct(res.data?.data || res.data)
    };
  },

  // 3.3 Update Amazing Product
  async updateAmazingProduct(id, data) {
    const res = await apiClient.put(`/amazing-products/${id}`, data);
    return {
      success: res.data?.success ?? true,
      data: normalizeProduct(res.data?.data || res.data)
    };
  },

  // 3.4 Delete Amazing Product
  async deleteAmazingProduct(id) {
    const res = await apiClient.delete(`/amazing-products/${id}`);
    return res.data;
  }
};

// -------------------------------------------------------------
// 4. Cart API (/api/cart)
// -------------------------------------------------------------
export const cartApi = {
  // 4.1 Get Cart
  async getCart() {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  // 4.2 Add Item
  async addItem({ productId, quantity = 1 }) {
    const res = await apiClient.post('/cart/items', { productId, quantity });
    return res.data;
  },

  // 4.3 Update Item Quantity
  async updateItem(productId, { quantity }) {
    const res = await apiClient.put(`/cart/items/${productId}`, { quantity });
    return res.data;
  },

  // 4.4 Remove Item
  async removeItem(productId) {
    const res = await apiClient.delete(`/cart/items/${productId}`);
    return res.data;
  },

  // 4.5 Clear Cart
  async clearCart() {
    const res = await apiClient.delete('/cart');
    return res.data;
  }
};

// -------------------------------------------------------------
// 5. Orders & Postal Tracking API (/api/orders)
// -------------------------------------------------------------
export const ordersApi = {
  // 5.1 Create Order
  async createOrder({ name, phone, address, postalCode, products, paymentReceipt }) {
    const res = await apiClient.post('/orders', {
      name,
      phone,
      address,
      postalCode,
      products,
      paymentReceipt
    });
    return res.data;
  },

  // 5.2 Track Order by Postal Code / Order ID
  async trackOrder(postTrackingCode) {
    const cleanCode = encodeURIComponent(String(postTrackingCode).trim());
    const res = await apiClient.get(`/orders/track/${cleanCode}`);
    return res.data;
  },

  // 5.3 Upload Receipt
  async uploadReceipt(id, { receiptImage }) {
    const res = await apiClient.put(`/orders/${id}/receipt`, { receiptImage });
    return res.data;
  },

  // 5.4 Verify Payment (Admin)
  async verifyPayment(id, { status, state, adminNote }) {
    const res = await apiClient.put(`/orders/${id}/verify-payment`, {
      status,
      state,
      adminNote
    });
    return res.data;
  },

  // 5.5 Update Status & Postal Tracking Code (Admin)
  async updateStatus(id, { state, postTrackingCode, adminNote }) {
    const res = await apiClient.put(`/orders/${id}/status`, {
      state,
      postTrackingCode,
      adminNote
    });
    return res.data;
  },

  // 5.6 My Orders
  async getMyOrders() {
    const res = await apiClient.get('/orders');
    return res.data;
  },

  // 5.7 Get Order By ID
  async getOrderById(id) {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  }
};

// -------------------------------------------------------------
// 6. Reviews API (/api/reviews)
// -------------------------------------------------------------
export const reviewsApi = {
  // 6.1 Get Product Reviews
  async getReviews(productId) {
    const res = await apiClient.get('/reviews', { params: { productId } });
    return res.data;
  },

  // 6.2 Create Review
  async createReview({ productId, comment, rating = 5 }) {
    const res = await apiClient.post('/reviews', { productId, comment, rating });
    return res.data;
  },

  // 6.3 Reply Review (Admin)
  async replyReview(id, { comment }) {
    const res = await apiClient.post(`/reviews/${id}/reply`, { comment });
    return res.data;
  },

  // 6.4 Delete Review (Admin)
  async deleteReview(id) {
    const res = await apiClient.delete(`/reviews/${id}`);
    return res.data;
  }
};

// -------------------------------------------------------------
// 7. Dynamic Slides API (/api/slides)
// -------------------------------------------------------------
export const slidesApi = {
  // 7.1 Get Slides
  async getSlides() {
    const res = await apiClient.get('/slides');
    return res.data;
  },

  // 7.2 Create Slide (Admin)
  async createSlide({ imageBase64 }) {
    const res = await apiClient.post('/slides', { imageBase64 });
    return res.data;
  },

  // 7.3 Delete Slide (Admin)
  async deleteSlide(id) {
    const res = await apiClient.delete(`/slides/${id}`);
    return res.data;
  }
};

// -------------------------------------------------------------
// 8. Admin Dashboard API (/api/admin)
// -------------------------------------------------------------
export const adminApi = {
  // 8.1 Dashboard Stats
  async getDashboard() {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },

  // 8.2 Get Users List
  async getUsers() {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  // 8.3 Update User Role
  async updateUserRole(id, role) {
    const res = await apiClient.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  // 8.4 Toggle User Status
  async toggleUserStatus(id) {
    const res = await apiClient.put(`/admin/users/${id}/toggle-status`);
    return res.data;
  },

  // 8.5 Get All Orders
  async getOrders() {
    const res = await apiClient.get('/admin/orders');
    return res.data;
  }
};

// -------------------------------------------------------------
// 9. System & Diagnostics API (/api/docs)
// -------------------------------------------------------------
export const systemApi = {
  async getHealth() {
    const res = await apiClient.get('/docs/health');
    return res.data;
  },
  async getMetrics() {
    const res = await apiClient.get('/docs/metrics');
    return res.data;
  },
  async resetDb() {
    const res = await apiClient.post('/docs/reset-db');
    return res.data;
  },
  async hashPassword(password) {
    const res = await apiClient.post('/docs/lab/hash-password', { password });
    return res.data;
  }
};
