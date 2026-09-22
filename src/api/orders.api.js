import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';
import { imageToBlob } from './products.api';

export function normalizeOrder(raw) {
  if (!raw) return null;
  const o = unwrapDoc(raw);
  if (!o || typeof o !== 'object') return null;

  const id = String(o._id || o.id || (o.trackingCode ? `ord-${o.trackingCode}` : `ord-${Date.now()}`));
  const rawItems = o.items || o.orderItems || o.products || [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((it) => {
        const itemUnwrapped = unwrapDoc(it);
        return {
          ...itemUnwrapped,
          id: itemUnwrapped._id || itemUnwrapped.id || itemUnwrapped.productId,
          name: itemUnwrapped.name || itemUnwrapped.title || 'برنج طلا رایس',
          price: Number(itemUnwrapped.price || 0),
          quantity: Number(itemUnwrapped.quantity || itemUnwrapped.qty || 1),
          image: itemUnwrapped.image || itemUnwrapped.imageUrl || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
        };
      })
    : [];

  const rawStatus = String(o.status || o.state || 'pending').trim();
  const trackingCode = String(
    o.postTrackingCode ||
    o.postalTrackingCode ||
    o.trackingCode ||
    o.tracking_code ||
    ''
  ).trim();

  const totalPrice = Number(
    o.totalPrice !== undefined
      ? o.totalPrice
      : (o.totalAmount !== undefined
          ? o.totalAmount
          : (o.finalAmount !== undefined ? o.finalAmount : o.price || 0))
  );

  return {
    ...o,
    id,
    _id: id,
    trackingCode,
    postalTrackingCode: trackingCode,
    postTrackingCode: trackingCode,
    status: rawStatus,
    state: rawStatus,
    totalPrice,
    finalAmount: totalPrice,
    items,
    products: items,
    orderItems: items,
    customerName: o.receiverName || o.customerName || o.name || o.recipientName || '',
    customerPhone: o.receiverPhone || o.customerPhone || o.phone || o.mobile || '',
    customerAddress: o.shippingAddress || o.customerAddress || o.address || '',
    paymentStatus: o.isVerified ? 'verified' : (o.paymentStatus || 'pending'),
    isVerified: o.isVerified || false,
    createdAt: o.createdAt || o.date || new Date().toISOString()
  };
}

export const ordersApi = {
  /**
   * Create a new order using POST /api/orders
   */
  async create(orderData) {
    const data = orderData || {};
    const formData = new FormData();
    const address = data.shippingAddress || data.fullAddress || data.address || '';
    formData.append('shippingAddress', address);
    formData.append('address', address);
    formData.append('postalCode', data.postalCode || '');
    const recName = data.receiverName || data.recipientName || data.name || '';
    formData.append('receiverName', recName);
    formData.append('name', recName);
    const recPhone = data.receiverPhone || data.phone || '';
    formData.append('receiverPhone', recPhone);
    formData.append('phone', recPhone);
    if (data.province) formData.append('province', data.province);
    if (data.city) formData.append('city', data.city);
    if (data.paymentMethod) formData.append('paymentMethod', data.paymentMethod);
    if (data.totalPrice) formData.append('totalPrice', String(data.totalPrice));
    
    if (data.items && Array.isArray(data.items)) {
      formData.append('items', JSON.stringify(data.items));
      formData.append('products', JSON.stringify(data.items));
    } else if (data.products && Array.isArray(data.products)) {
      formData.append('items', JSON.stringify(data.products));
      formData.append('products', JSON.stringify(data.products));
    }

    const receiptImg = data.receipt || data.paymentReceipt || data.receiptImage;
    if (receiptImg) {
      const receiptBlob = await imageToBlob(receiptImg);
      if (receiptBlob) {
        formData.append('receipt', receiptBlob, 'receipt.jpg');
      }
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axiosInstance.post('/orders', formData, { headers });
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  createOrder(orderData) {
    return this.create(orderData);
  },
  
  /**
   * Upload or set payment receipt using POST /api/orders/:id/receipt
   */
  async uploadReceipt(id, receiptImage) {
    const formData = new FormData();
    const receiptBlob = await imageToBlob(receiptImage);
    if (receiptBlob) {
      formData.append('receipt', receiptBlob, 'receipt.jpg');
    }
    
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axiosInstance.post(`/orders/${id}/receipt`, formData, { headers });
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Get order by ID using GET /api/orders/:id
   */
  async getById(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axiosInstance.get(`/orders/${id}`, { headers });
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  getOrderById(id) {
    return this.getById(id);
  },

  /**
   * Get all orders of logged in user
   */
  async getAll(params = {}) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axiosInstance.get('/orders', { headers, params });
    const parsed = res?.data || res;
    let rawList = [];
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
      rawList = parsed.data;
    } else if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.orders)) {
      rawList = parsed.orders;
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  getOrders(params = {}) {
    return this.getAll(params);
  },

  /**
   * Track order by code without login
   */
  async trackOrder(code) {
    const clean = encodeURIComponent(String(code || '').trim());
    try {
      const res = await axiosInstance.get(`/orders/track/${clean}`);
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    } catch (err) {
      const res = await axiosInstance.get(`/orders/${clean}`);
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    }
  },

  track(code) {
    return this.trackOrder(code);
  },

  /**
   * Admin: Update order overall shipment status
   */
  async updateStatus(id, status, postTrackingCode) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const targetStatus = typeof status === 'object' ? (status.status || status.state) : status;
    const targetTracking = typeof status === 'object' ? (status.postTrackingCode || status.trackingCode) : postTrackingCode;

    const statusMap = {
      'در حال بررسی': 'pending',
      'تایید شده': 'pending',
      'ارسال شده': 'shipped',
      'تحویل داده شده': 'delivered',
      'لغو شده': 'cancelled',
      'processing': 'pending',
      'pending': 'pending',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    const cleanStatus = statusMap[targetStatus] || targetStatus || 'pending';

    const res = await axiosInstance.put(`/orders/${id}/status`, {
      status: cleanStatus,
      postTrackingCode: targetTracking || ''
    }, { headers });

    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Admin: Verify bank receipt payment
   */
  async verifyPayment(id, payload = {}) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const isVerified = payload.isVerified !== undefined ? payload.isVerified : true;

    const res = await axiosInstance.put(`/orders/${id}/verify-payment`, {
      isVerified: isVerified === true || isVerified === 'true'
    }, { headers });

    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Delete order (Admin)
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.delete(`/orders/${id}`, { headers });
  },

  deleteOrder(id) {
    return this.delete(id);
  },

  async getMyOrders(user) {
    return this.getAll();
  }
};

export default ordersApi;
