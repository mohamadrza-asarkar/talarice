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
   * Create a new order using POST /api/orders (Section 5.الف)
   */
  async create(orderData) {
    const data = orderData || {};
    const formData = new FormData();
    const address = data.shippingAddress || data.fullAddress || data.address || '';
    formData.append('shippingAddress', address);
    formData.append('address', address);
    formData.append('postalCode', data.postalCode || '');
    formData.append('receiverName', data.receiverName || data.recipientName || data.name || '');
    formData.append('receiverPhone', data.receiverPhone || data.phone || '');
    if (data.province) formData.append('province', data.province);
    if (data.city) formData.append('city', data.city);
    if (data.paymentMethod) formData.append('paymentMethod', data.paymentMethod);
    if (data.totalPrice) formData.append('totalPrice', String(data.totalPrice));
    
    if (data.items && Array.isArray(data.items)) {
      formData.append('items', JSON.stringify(data.items));
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

    try {
      const res = await axiosInstance.post('/orders', formData, { headers });
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    } catch (err) {
      console.warn('Network error or server error creating order, saving offline:', err);
      // Generate clean persistent offline order
      const randomTrack = Math.floor(100000 + Math.random() * 900000);
      const offlineOrder = normalizeOrder({
        _id: `ord-${Date.now()}`,
        id: `ord-${Date.now()}`,
        trackingCode: `TR-${randomTrack}`,
        postalTrackingCode: `IR-${Date.now().toString().slice(-8)}`,
        status: 'pending',
        state: 'pending',
        totalPrice: Number(data.totalPrice || 0),
        items: data.items || data.products || [],
        receiverName: data.receiverName || data.recipientName || data.name || 'کاربر گرامی',
        receiverPhone: data.receiverPhone || data.phone || '',
        shippingAddress: address,
        paymentStatus: data.paymentMethod === 'card' ? 'awaiting_approval' : 'pending',
        paymentMethod: data.paymentMethod || 'gateway',
        createdAt: new Date().toISOString()
      });

      try {
        const stored = localStorage.getItem('tala_rice_offline_orders');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(offlineOrder);
        localStorage.setItem('tala_rice_offline_orders', JSON.stringify(list));
      } catch {
        // ignore
      }

      return offlineOrder;
    }
  },

  createOrder(orderData) {
    return this.create(orderData);
  },
  
  /**
   * Upload or set payment receipt using POST /api/orders/:id/receipt (Section 5.د)
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
   * Get order by ID using GET /api/orders/:id (Section 5.ج)
   */
  async getById(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axiosInstance.get(`/orders/${id}`, { headers });
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    } catch (err) {
      // Check local offline orders
      try {
        const stored = localStorage.getItem('tala_rice_offline_orders');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((o) => o.id === id || o._id === id);
          if (found) return normalizeOrder(found);
        }
      } catch {
        // ignore
      }
      throw err;
    }
  },

  getOrderById(id) {
    return this.getById(id);
  },

  /**
   * Get all orders of logged in user (Section 5.ب)
   */
  async getAll(params = {}) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    let rawList = [];
    try {
      const res = await axiosInstance.get('/orders', { headers, params });
      const parsed = res?.data || res;
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.orders)) {
        rawList = parsed.orders;
      }
    } catch {
      // ignore
    }

    // Merge offline saved orders
    try {
      const stored = localStorage.getItem('tala_rice_offline_orders');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          rawList = [...list, ...rawList];
        }
      }
    } catch {
      // ignore
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  getOrders(params = {}) {
    return this.getAll(params);
  },

  /**
   * Track order by code without login (Section 5.هـ)
   */
  async trackOrder(code) {
    const clean = encodeURIComponent(String(code || '').trim());
    try {
      const res = await axiosInstance.get(`/orders/track/${clean}`);
      const raw = res?.data || res?.order || res;
      return normalizeOrder(raw);
    } catch (err) {
      // Try /orders/:id fallback
      try {
        const res = await axiosInstance.get(`/orders/${clean}`);
        const raw = res?.data || res?.order || res;
        return normalizeOrder(raw);
      } catch {
        // Check offline orders
        try {
          const stored = localStorage.getItem('tala_rice_offline_orders');
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find(
              (o) => String(o.id) === String(code) ||
                     String(o.trackingCode) === String(code) ||
                     String(o.postalTrackingCode) === String(code)
            );
            if (found) return normalizeOrder(found);
          }
        } catch {
          // ignore
        }
      }
      throw err;
    }
  },

  track(code) {
    return this.trackOrder(code);
  },

  /**
   * Admin: Update order overall shipment status (Section 5.و)
   * PUT /api/orders/:id/status with body { status, postTrackingCode }
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
   * Admin: Verify bank receipt payment (Section 5.و)
   * PUT /api/orders/:id/verify-payment with body { isVerified }
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
