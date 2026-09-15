import axiosInstance, { getStoredToken } from './axios';
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
   * Create a new order using axios.post
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
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.post('/orders', payload, { headers });
    const raw = res?.data || res?.order || res;
    return normalizeOrder(raw);
  },

  createOrder(orderData) {
    return this.create(orderData);
  },
  
  /**
   * Upload or set payment receipt using axios.put/patch
   */
  async uploadReceipt(id, receiptBase64) {
    let res = null;
    let lastErr = null;
    const payload = {
      receiptImage: receiptBase64,
      paymentReceipt: receiptBase64
    };
    
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [
      `/orders/${id}/receipt`,
      `/orders/${id}/payment-receipt`,
      `/orders/${id}`
    ];

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.put(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await axiosInstance.patch(ep, payload, { headers });
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
   * Get order by ID or tracking code using axios.get
   */
  async getById(idOrTracking) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [
      `/orders/${idOrTracking}`,
      `/orders/track/${idOrTracking}`,
      `/orders?trackingCode=${idOrTracking}`
    ];

    let res = null;
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        res = await axiosInstance.get(ep, { headers });
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const rawList = res?.data || res?.orders || res;
    if (Array.isArray(rawList)) {
      const found = rawList.find(o => String(o.id || o._id || o.trackingCode) === String(idOrTracking));
      return normalizeOrder(found || rawList[0]);
    }

    return normalizeOrder(rawList);
  },

  getOrderById(id) {
    return this.getById(id);
  },

  /**
   * Get all orders (Admin or User) using axios.get with Token header
   */
  async getAll(params = {}) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = ['/orders', '/admin/orders'];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.get(ep, { headers, params });
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    let rawList = [];
    if (res && res.data && Array.isArray(res.data)) {
      rawList = res.data;
    } else if (Array.isArray(res)) {
      rawList = res;
    } else if (res?.orders && Array.isArray(res.orders)) {
      rawList = res.orders;
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  getOrders(params = {}) {
    return this.getAll(params);
  },

  /**
   * Admin: Update order status using axios.put/patch with Token header
   */
  async updateStatus(id, status, trackingCode, adminNote) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const targetStatus = typeof status === 'object' ? (status.status || status.state) : status;
    const targetTracking = typeof status === 'object' ? (status.trackingCode || status.postalTrackingCode) : trackingCode;

    const statusMapEn = {
      'در حال بررسی': 'processing',
      'تایید شده': 'confirmed',
      'ارسال شده': 'shipped',
      'تحویل داده شده': 'delivered',
      'لغو شده': 'cancelled'
    };

    const statusMapFa = {
      'processing': 'در حال بررسی',
      'confirmed': 'تایید شده',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
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
        res = await axiosInstance.put(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await axiosInstance.patch(ep, payload, { headers });
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
   * Admin: Verify bank receipt payment using axios.put/patch with Token header
   */
  async verifyPayment(id, payload = {}) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
        res = await axiosInstance.put(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await axiosInstance.patch(ep, payload, { headers });
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
   * Admin: Delete order using axios.delete with Token header
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [
      `/orders/${id}`,
      `/admin/orders/${id}`
    ];
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        return await axiosInstance.delete(ep, { headers });
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
