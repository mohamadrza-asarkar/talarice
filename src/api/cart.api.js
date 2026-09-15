// -------------------------------------------------------------
// Shopping Cart API (/api/cart) using Axios
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export const cartApi = {
  /**
   * Get entire cart from server using axios.get with Token header
   */
  async getCart() {
    try {
      const token = getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.get('/cart', { headers });
      const data = unwrapDoc(res?.data || res);
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        totalPrice: Number(data?.totalPrice || 0),
        totalItems: Number(data?.totalItems || 0)
      };
    } catch {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  },

  /**
   * Add item to cart using axios.post with Token header
   */
  async addItem(productId, quantity = 1) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.post('/cart/items', {
      productId,
      quantity: Number(quantity)
    }, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Update item quantity in cart using axios.put with Token header
   */
  async updateQuantity(productId, quantity) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.put(`/cart/items/${productId}`, {
      quantity: Number(quantity)
    }, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Remove item from cart using axios.delete with Token header
   */
  async removeItem(productId) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.delete(`/cart/items/${productId}`, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Clear entire cart using axios.delete with Token header
   */
  async clearCart() {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.delete('/cart', { headers });
    return unwrapDoc(res?.data || res);
  }
};

export default cartApi;
