import client from './client';
import { parseApiError } from '../utils/errorHandler';

export const cartApi = {
  /**
   * Get Cart
   * GET /api/cart
   */
  async getCart() {
    try {
      const response = await client.get('/cart');
      const cartData = response?.data?.cart || response?.data || { items: [] };
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: cartData,
        message: response?.message || 'اطلاعات سبد خرید دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Add item to cart
   * POST /api/cart/items
   * Body: { productId, quantity }
   */
  async addItem(productId, quantity = 1) {
    try {
      const response = await client.post('/cart/items', { productId, quantity });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'کالا به سبد خرید اضافه شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Update item quantity in cart
   * PUT /api/cart/items/:productId
   * Body: { quantity }
   */
  async updateQuantity(productId, quantity) {
    try {
      const response = await client.put(`/cart/items/${productId}`, { quantity });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'تعداد کالا در سبد خرید به‌روزرسانی شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:productId
   */
  async removeItem(productId) {
    try {
      const response = await client.delete(`/cart/items/${productId}`);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'کالا از سبد خرید حذف شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  async clearCart() {
    try {
      const response = await client.delete('/cart');
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'سبد خرید خالی شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default cartApi;
