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
      
      // Handle the data shape returned by GET /api/cart:
      // { userId, products: [{ productId, name, price, quantity, image }], totalPrice }
      const products = Array.isArray(data?.products) ? data.products : (Array.isArray(data?.items) ? data.items : []);
      const items = products.map(p => ({
        ...p,
        productId: p.productId || p.product?._id || p.product?.id,
        quantity: Number(p.quantity || p.qty || 1)
      }));

      return {
        items,
        totalPrice: Number(data?.totalPrice || 0),
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    } catch {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  },

  /**
   * Add item to cart using POST /cart/items
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
   * Update item quantity in cart using PUT /cart/items/:productId
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
   * Remove item from cart using DELETE /cart/items/:productId
   */
  async removeItem(productId) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.delete(`/cart/items/${productId}`, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Clear entire cart using DELETE /cart
   */
  async clearCart() {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.delete('/cart', { headers });
    return unwrapDoc(res?.data || res);
  }
};

export default cartApi;
