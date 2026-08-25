import { api } from './client';

export const ordersAPI = {
  // Get all orders (Admin or User's orders)
  getAll: async (params = {}) => {
    return api.get('/orders', { params });
  },

  // Get user specific orders
  getMyOrders: async () => {
    return api.get('/orders/myorders').catch(() => api.get('/orders'));
  },

  // Get single order by ID
  getById: async (id) => {
    return api.get(`/orders/${id}`);
  },

  // Create new order (Checkout)
  create: async (orderData) => {
    return api.post('/orders', orderData);
  },

  // Update order status (Admin: processing, shipped, delivered, cancelled)
  updateStatus: async (id, status) => {
    return api.put(`/admin/orders/${id}/status`, { status }).catch(() => {
      return api.put(`/orders/${id}/status`, { status }).catch(() => {
        return api.put(`/orders/${id}`, { status });
      });
    });
  },

  // Delete order (Admin)
  delete: async (id) => {
    return api.delete(`/orders/${id}`);
  },
};

export default ordersAPI;
