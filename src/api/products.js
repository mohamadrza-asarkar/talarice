import { api } from './client';

export const productsAPI = {
  // Get all products (with optional query params: category, search, page, limit, sort)
  getAll: async (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product by ID or slug
  getById: async (id) => {
    return api.get(`/products/${id}`);
  },

  // Create new product (Admin)
  create: async (productData) => {
    return api.post('/products', productData);
  },

  // Update product by ID (Admin)
  update: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product by ID (Admin)
  delete: async (id) => {
    return api.delete(`/products/${id}`);
  },

  // Update stock level quickly (Admin)
  updateStock: async (id, countInStock) => {
    return api.patch(`/products/${id}/stock`, { countInStock }).catch(() => {
      return api.put(`/products/${id}`, { countInStock, stock: countInStock });
    });
  },

  // Add review to a product
  addReview: async (productId, reviewData) => {
    return api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Delete review (Admin)
  deleteReview: async (productId, reviewId) => {
    return api.delete(`/products/${productId}/reviews/${reviewId}`);
  },
};

export default productsAPI;
