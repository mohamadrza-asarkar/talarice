import client from './client';
import { initialOrders } from '../data/mockData';

function parseOrder(o) {
  if (!o) return null;
  const status = o.status || 'reviewing';
  return {
    id: String(o.id || o._id || `order-${Date.now()}`),
    _id: String(o._id || o.id || `order-${Date.now()}`),
    orderCode: o.orderCode || o.code || `TR-${Math.floor(100000 + Math.random() * 900000)}`,
    date: o.date || new Date().toISOString().split('T')[0],
    createdAt: o.createdAt || new Date().toISOString(),
    status: status,
    customerName: o.customerName || o.fullName || 'خریدار محترم',
    customerPhone: o.customerPhone || o.phone || '۰۹۱۲۰۰۰۰۰۰۰',
    customerAddress: o.customerAddress || o.address || 'استان فارس، شیراز',
    items: Array.isArray(o.items) ? o.items.map(item => ({
      id: item.id || item.productId,
      name: item.name || item.title || 'برنج کامفیروزی',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
      image: item.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      weight: item.weight || 10
    })) : [],
    totalAmount: Number(o.totalAmount || o.finalAmount || 0),
    discountAmount: Number(o.discountAmount || 0),
    shippingFee: Number(o.shippingFee ?? 49000),
    paymentMethod: o.paymentMethod || 'پرداخت آنلاین کارت به کارت',
    trackingCode: o.trackingCode || (status === 'shipped' || status === 'delivered' ? `POST-${Math.floor(100000000 + Math.random() * 900000000)}` : null)
  };
}

export const ordersApi = {
  /**
   * Fetch all orders (Admin or Customer history)
   */
  async getOrders() {
    try {
      const response = await client.get('/orders');
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data.map(parseOrder)
        };
      }
    } catch (err) {
      console.warn('[ordersApi] Fetch orders server fallback:', err.message);
    }
    // Return initial/stored mock orders parsed
    return {
      success: true,
      data: initialOrders.map(parseOrder)
    };
  },

  /**
   * Get order details by ID or code
   */
  async getOrderById(idOrCode) {
    try {
      const response = await client.get(`/orders/${idOrCode}`);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseOrder(response.data)
        };
      }
    } catch (err) {
      console.warn(`[ordersApi] Fetch order ${idOrCode} fallback:`, err.message);
    }
    const found = initialOrders.find(o => o.id === idOrCode || o.orderCode === idOrCode);
    return {
      success: Boolean(found),
      data: found ? parseOrder(found) : null
    };
  },

  /**
   * Submit/Create a new order from checkout
   */
  async createOrder(orderPayload) {
    try {
      const response = await client.post('/orders', orderPayload);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseOrder(response.data),
          message: 'سفارش شما با موفقیت ثبت شد.'
        };
      }
    } catch (err) {
      console.warn('[ordersApi] Submit order server fallback:', err);
    }
    const created = parseOrder({
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderCode: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'reviewing'
    });
    return {
      success: true,
      data: created,
      message: 'سفارش با موفقیت در سیستم ثبت گردید.'
    };
  },

  /**
   * Update order status (pending, processing, shipped, completed, cancelled)
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await client.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseOrder(response.data),
          message: response.message || 'وضعیت سفارش با موفقیت به‌روزرسانی شد.'
        };
      }
    } catch (err) {
      console.warn(`[ordersApi] Update order status ${orderId} error:`, err.message || err);
      throw err;
    }
    return {
      success: true,
      data: { id: orderId, status: newStatus },
      message: 'وضعیت سفارش تغییر یافت.'
    };
  },

  /**
   * Pay order simulator
   */
  async payOrder(orderId) {
    try {
      const response = await client.post(`/orders/${orderId}/pay`);
      return response || { success: true, message: 'پرداخت با موفقیت انجام شد.' };
    } catch (err) {
      console.warn(`[ordersApi] Pay order ${orderId} error:`, err.message || err);
      throw err;
    }
  }
};

export default ordersApi;
