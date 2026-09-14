// -------------------------------------------------------------
// Shopping Cart API (/api/cart)
// Section 4 of backend API Documentation
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';

export const cartApi = {
  /**
   * Get entire cart from server
   */
  async getCart() {
    try {
      const res = await client.get('/cart');
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
   * Add item to cart
   */
  async addItem(productId, quantity = 1) {
    const res = await client.post('/cart/items', {
      productId,
      quantity: Number(quantity)
    });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Update item quantity in cart
   */
  async updateQuantity(productId, quantity) {
    const res = await client.put(`/cart/items/${productId}`, {
      quantity: Number(quantity)
    });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Remove item from cart
   */
  async removeItem(productId) {
    const res = await client.delete(`/cart/items/${productId}`);
    return unwrapDoc(res?.data || res);
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    const res = await client.delete('/cart');
    return unwrapDoc(res?.data || res);
  }
};

export default cartApi;
