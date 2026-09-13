// -------------------------------------------------------------
// Orders API (/api/orders)
// Native fetch implementation
// -------------------------------------------------------------
import { client } from './client';

export function normalizeOrder(o) {
  if (!o) return null;
  const id = o._id || o.id;
  return {
    ...o,
    id,
    _id: id,
    trackingCode: o.trackingCode || o.postalTrackingCode || o.tracking_code || '',
    postalTrackingCode: o.postalTrackingCode || o.trackingCode || '',
    status: o.status || o.state || 'processing',
    totalPrice: Number(o.totalPrice || o.totalAmount || o.price || 0),
    items: Array.isArray(o.items || o.orderItems) ? (o.items || o.orderItems) : [],
    createdAt: o.createdAt || o.date || new Date().toISOString()
  };
}

export const ordersApi = {
  /**
   * Create a new order
   */
  async create(orderData) {
    const res = await client.post('/orders', orderData);
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Get logged-in user's orders (/orders/my-orders or /orders/my)
   */
  async getMyOrders() {
    let res;
    try {
      res = await client.get('/orders/my-orders');
    } catch (err) {
      if (err.status === 404) {
        res = await client.get('/orders/my');
      } else {
        throw err;
      }
    }

    let rawList = [];
    if (Array.isArray(res)) rawList = res;
    else if (Array.isArray(res?.data)) rawList = res.data;
    else if (Array.isArray(res?.orders)) rawList = res.orders;

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  /**
   * Get single order by ID
   */
  async getById(id) {
    const res = await client.get(`/orders/${id}`);
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Track order by tracking code or ID
   */
  async track(trackingCodeOrId) {
    const clean = encodeURIComponent(String(trackingCodeOrId).trim());
    try {
      const res = await client.get(`/orders/track/${clean}`);
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    } catch {
      // Fallback query
      const res = await client.get(`/orders?trackingCode=${clean}`);
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (list.length > 0) return normalizeOrder(list[0]);
      throw new Error('سفارشی با این کد رهگیری یافت نشد.');
    }
  },

  /**
   * Admin: Get all orders in store
   */
  async getAllOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    
    const qs = query.toString();
    const endpoint = `/orders${qs ? `?${qs}` : ''}`;
    const res = await client.get(endpoint);

    let rawList = [];
    if (Array.isArray(res)) rawList = res;
    else if (Array.isArray(res?.data)) rawList = res.data;
    else if (Array.isArray(res?.orders)) rawList = res.orders;

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  /**
   * Admin: Update order status & postal tracking code
   */
  async updateStatus(id, { status, trackingCode, adminNote }) {
    const res = await client.put(`/orders/${id}/status`, {
      status,
      trackingCode,
      postalTrackingCode: trackingCode,
      adminNote
    });
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Admin: Delete order
   */
  async delete(id) {
    return await client.delete(`/orders/${id}`);
  }
};

export default ordersApi;
