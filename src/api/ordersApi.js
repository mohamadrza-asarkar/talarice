import client from './client';

function parseOrder(o) {
  if (!o) return null;
  const status = o.status || 'pending';
  return {
    id: String(o.id || o._id || `order-${Date.now()}`),
    _id: String(o._id || o.id || `order-${Date.now()}`),
    orderCode: o.orderCode || o.code || `TR-${Math.floor(100000 + Math.random() * 900000)}`,
    date: o.date || new Date().toISOString().split('T')[0],
    createdAt: o.createdAt || new Date().toISOString(),
    status: status,
    customerName: o.customerName || o.fullName || o.receiverName || 'خریدار محترم',
    customerPhone: o.customerPhone || o.phone || o.receiverPhone || '۰۹۱۲۰۰۰۰۰۰۰',
    customerAddress: o.customerAddress || o.address || o.shippingAddress || 'استان فارس، شیراز',
    items: Array.isArray(o.items) ? o.items.map(item => ({
      id: item.id || item.productId,
      name: item.name || item.title || 'برنج کامفیروزی',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
      image: item.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      weight: item.weight || 10
    })) : [],
    totalAmount: Number(o.totalAmount || o.totalPrice || o.finalAmount || 0),
    discountAmount: Number(o.discountAmount || 0),
    shippingFee: Number(o.shippingFee ?? 49000),
    paymentMethod: o.paymentMethod || 'پرداخت آنلاین کارت به کارت',
    trackingCode: o.trackingCode || (status === 'shipped' || status === 'completed' ? `POST-${Math.floor(100000000 + Math.random() * 900000000)}` : null)
  };
}

export const ordersApi = {
  /**
   * Fetch all orders (Admin or Customer history)
   */
  async getOrders() {
    try {
      const response = await client.get('/orders');
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseOrder)
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت لیست سفارشات' };
    } catch (err) {
      console.error('[ordersApi] Fetch orders error:', err.message || err);
      throw err;
    }
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
      return { success: false, data: null, message: 'سفارش مورد نظر پیدا نشد.' };
    } catch (err) {
      console.error(`[ordersApi] Fetch order ${idOrCode} error:`, err.message || err);
      throw err;
    }
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
          message: response.message || 'سفارش شما با موفقیت ثبت شد.'
        };
      }
      return { success: false, message: 'خطا در ثبت سفارش.' };
    } catch (err) {
      console.error('[ordersApi] Submit order error:', err.message || err);
      throw err;
    }
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
      return { success: false, message: 'خطا در ویرایش وضعیت سفارش.' };
    } catch (err) {
      console.error(`[ordersApi] Update order status ${orderId} error:`, err.message || err);
      throw err;
    }
  },

  /**
   * Pay order simulator
   */
  async payOrder(orderId) {
    try {
      const response = await client.post(`/orders/${orderId}/pay`);
      return response || { success: true, message: 'پرداخت با موفقیت انجام شد.' };
    } catch (err) {
      console.error(`[ordersApi] Pay order ${orderId} error:`, err.message || err);
      throw err;
    }
  }
};

export default ordersApi;
