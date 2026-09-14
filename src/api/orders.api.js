// -------------------------------------------------------------
// Orders API (/api/orders)
// Native fetch implementation with resilient multi-route fallback
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';

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

  const rawStatus = String(o.status || o.state || 'processing').trim();
  const trackingCode = String(
    o.trackingCode ||
    o.postalTrackingCode ||
    o.postTrackingCode ||
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
    customerName: o.customerName || o.name || o.recipientName || '',
    customerPhone: o.customerPhone || o.phone || o.mobile || '',
    customerAddress: o.customerAddress || o.address || '',
    paymentStatus: o.paymentStatus || 'pending',
    createdAt: o.createdAt || o.date || new Date().toISOString()
  };
}

export const ordersApi = {
  /**
   * Create a new order
   */
  async create(orderData) {
    const payload = {
      name: orderData.name || orderData.customerName || '',
      phone: orderData.phone || orderData.customerPhone || '',
      address: orderData.address || orderData.customerAddress || '',
      postalCode: orderData.postalCode || '',
      products: orderData.products || orderData.items || [],
      paymentReceipt: orderData.paymentReceipt || orderData.receiptImage || ''
    };
    const res = await client.post('/orders', payload);
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  createOrder(orderData) {
    return this.create(orderData);
  },
  
  /**
   * Upload or set payment receipt
   */
  async uploadReceipt(id, receiptBase64) {
    let res = null;
    let lastErr = null;
    const payload = {
      receiptImage: receiptBase64,
      paymentReceipt: receiptBase64
    };
    
    try {
      res = await client.put(`/orders/${id}/receipt`, payload);
    } catch (err) {
      lastErr = err;
      try {
        res = await client.post(`/orders/${id}/receipt`, payload);
      } catch (err2) {
        lastErr = err2;
      }
    }
    
    if (!res && lastErr) throw lastErr;
    
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Get logged-in user's orders with intelligent multi-endpoint fallback
   * Prevents 500 crashes caused by Express route collisions (e.g. CastError on /:id)
   */
  async getMyOrders(userFilter = null) {
    const candidateEndpoints = [
      '/orders/my-orders',
      '/orders/my',
      '/orders/mine',
      '/orders/user',
      '/orders/me',
      '/orders'
    ];

    let lastError = null;
    let rawList = null;

    for (const endpoint of candidateEndpoints) {
      try {
        const res = await client.get(endpoint);
        if (Array.isArray(res)) {
          rawList = res;
          break;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
          break;
        } else if (Array.isArray(res?.orders)) {
          rawList = res.orders;
          break;
        } else if (res && typeof res === 'object' && (res._id || res.id)) {
          rawList = [res];
          break;
        }
      } catch (err) {
        lastError = err;
        // Continue trying next candidate endpoint
      }
    }

    if (!rawList) {
      if (lastError && !lastError.isNetworkError && lastError.status !== 404 && lastError.status !== 500) {
        throw lastError;
      }
      return [];
    }

    let orders = rawList.map(normalizeOrder).filter(Boolean);

    // If endpoint was general /orders, filter by logged-in user if not admin
    if (userFilter && typeof userFilter === 'object' && !userFilter.isAdmin) {
      const uId = String(userFilter._id || userFilter.id || '');
      const uPhone = String(userFilter.phone || '').trim();
      if (uId || uPhone) {
        const filtered = orders.filter((o) => {
          const ordUserId = String(o.user || o.userId || o.customer || '');
          const ordPhone = String(o.customerPhone || o.phone || '').trim();
          return (uId && ordUserId === uId) || (uPhone && ordPhone === uPhone);
        });
        if (filtered.length > 0 || orders.length > 0) {
          orders = filtered;
        }
      }
    }

    return orders;
  },

  /**
   * Get single order by ID
   */
  async getById(id) {
    const res = await client.get(`/orders/${id}`);
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  getOrderById(id) {
    return this.getById(id);
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
      try {
        const res = await client.get(`/orders?trackingCode=${clean}`);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list.length > 0) return normalizeOrder(list[0]);
      } catch {
        // ignore
      }
      throw new Error('سفارشی با این کد رهگیری یافت نشد.');
    }
  },

  trackOrder(query) {
    return this.track(query);
  },

  /**
   * Admin: Get all orders in store with fallback
   */
  async getAllOrders(params = {}) {
    const candidateEndpoints = [
      '/orders',
      '/admin/orders',
      '/orders/admin',
      '/orders/all'
    ];

    let rawList = null;
    let lastError = null;

    for (const ep of candidateEndpoints) {
      try {
        const query = new URLSearchParams();
        if (params.status) query.append('status', params.status);
        if (params.page) query.append('page', params.page);
        const qs = query.toString();
        const fullEp = `${ep}${qs ? `?${qs}` : ''}`;

        const res = await client.get(fullEp);
        if (Array.isArray(res)) {
          rawList = res;
          break;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
          break;
        } else if (Array.isArray(res?.orders)) {
          rawList = res.orders;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!rawList) {
      if (lastError && !lastError.isNetworkError && lastError.status !== 404) {
        throw lastError;
      }
      return [];
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  getAll(params = {}) {
    return this.getAllOrders(params);
  },

  getAdminOrders(params = {}) {
    return this.getAllOrders(params);
  },

  /**
   * Admin: Update order status & postal tracking code
   */
  async updateStatus(id, { status, state, trackingCode, postTrackingCode, postalTrackingCode, adminNote }) {
    const targetStatus = status || state || 'processing';
    const targetTracking = trackingCode || postTrackingCode || postalTrackingCode || '';
    
    // Status translation for Persian and English backends
    const statusMapEn = {
      'در حال پردازش': 'processing',
      'ارسال شده': 'shipped',
      'تحویل شده': 'delivered',
      'لغو شده': 'cancelled'
    };
    const statusMapFa = {
      'processing': 'در حال پردازش',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل شده',
      'cancelled': 'لغو شده'
    };
    
    const enStatus = statusMapEn[targetStatus] || targetStatus;
    const faStatus = statusMapFa[targetStatus] || targetStatus;

    const payload = {
      status: targetStatus,
      state: targetStatus,
      orderStatus: targetStatus,
      enStatus,
      faStatus,
      trackingCode: targetTracking,
      postalTrackingCode: targetTracking,
      postTrackingCode: targetTracking,
      adminNote: adminNote || ''
    };

    const endpoints = [
      `/orders/${id}/status`,
      `/orders/${id}`,
      `/admin/orders/${id}/status`,
      `/admin/orders/${id}`
    ];

    let res = null;
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        res = await client.put(ep, payload);
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await client.patch(ep, payload);
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Admin: Verify bank receipt payment
   */
  async verifyPayment(id, payload = {}) {
    const endpoints = [
      `/orders/${id}/verify-payment`,
      `/orders/${id}/payment`,
      `/orders/${id}/status`,
      `/orders/${id}`
    ];

    let res = null;
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        res = await client.put(ep, payload);
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await client.patch(ep, payload);
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  /**
   * Admin: Delete order
   */
  async delete(id) {
    const endpoints = [
      `/orders/${id}`,
      `/admin/orders/${id}`
    ];
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        return await client.delete(ep);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  },

  deleteOrder(id) {
    return this.delete(id);
  }
};

export default ordersApi;
