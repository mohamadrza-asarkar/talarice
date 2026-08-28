import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseOrder(o) {
  if (!o) return null;
  const status = o.status || 'pending';
  const id = String(o._id || o.id || '');
  const orderNumber = o.orderNumber || o.orderCode || o.code || id;

  let items = [];
  if (Array.isArray(o.items)) {
    items = o.items.map(item => {
      const prod = item.product || item;
      return {
        id: item.productId || prod.id || prod._id || '',
        productId: item.productId || prod.id || prod._id || '',
        name: item.title || item.name || prod.name || prod.title || '',
        title: item.title || item.name || prod.name || prod.title || '',
        price: Number(item.finalPrice || item.price || prod.price || 0),
        quantity: Number(item.quantity || item.qty || item.count || 1),
        image: item.image || item.imageUrl || prod.image || prod.imageUrl || '',
        weight: item.weight || 10
      };
    });
  }

  return {
    id,
    _id: id,
    orderNumber,
    orderCode: orderNumber,
    date: o.date || (o.createdAt ? o.createdAt.split('T')[0] : ''),
    createdAt: o.createdAt || '',
    status: status,
    isPaid: Boolean(o.isPaid),
    customerName: o.customerName || o.fullName || o.receiverName || o.user?.name || '',
    customerPhone: o.customerPhone || o.phone || o.receiverPhone || o.user?.phone || '',
    customerAddress: o.customerAddress || o.address || o.shippingAddress || '',
    shippingAddress: o.customerAddress || o.address || o.shippingAddress || '',
    items: items,
    totalAmount: Number(o.totalAmount || o.totalPrice || o.finalAmount || 0),
    finalAmount: Number(o.finalAmount || o.totalAmount || o.totalPrice || 0),
    shippingFee: Number(o.shippingFee ?? 0),
    paymentMethod: o.paymentMethod || 'online',
    trackingCode: o.trackingCode || o.transactionId || null,
    user: o.user
  };
}

export const ordersApi = {
  /**
   * Get list of user orders
   * GET /api/orders
   */
  async getOrders() {
    try {
      const response = await client.get('/orders');
      let orderList = [];
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          orderList = response.data;
        } else if (response.data?.orders && Array.isArray(response.data.orders)) {
          orderList = response.data.orders;
        }
      } else if (Array.isArray(response)) {
        orderList = response;
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: orderList.map(parseOrder).filter(Boolean),
        message: response?.message || 'لیست سفارش‌ها با موفقیت دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Create new order
   * POST /api/orders
   * Body: { items: [{ productId, quantity }], shippingAddress, paymentMethod }
   */
  async createOrder(orderPayload) {
    try {
      const formattedItems = (orderPayload.items || []).map(item => ({
        productId: String(item.productId || item.product?._id || item.product?.id || item.id),
        quantity: Number(item.quantity || 1)
      }));

      const payload = {
        items: formattedItems,
        shippingAddress: orderPayload.shippingAddress || orderPayload.fullAddress || orderPayload.address || '',
        paymentMethod: orderPayload.paymentMethod || 'online'
      };

      const response = await client.post('/orders', payload);
      const rawOrder = response?.data?.order || response?.data;
      const parsed = parseOrder(rawOrder);

      return {
        success: true,
        statusCode: response?.statusCode || 201,
        data: parsed,
        order: parsed,
        message: response?.message || 'سفارش با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Pay for order
   * POST /api/orders/:id/pay
   * Body: { transactionId }
   */
  async payOrder(orderId, transactionId = '') {
    try {
      const response = await client.post(`/orders/${orderId}/pay`, {
        transactionId: transactionId || `TRX-${Date.now()}`
      });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'پرداخت سفارش با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Update order status (Admin)
   * PUT /api/orders/:id/status
   * Body: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await client.put(`/orders/${orderId}/status`, { status });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'وضعیت سفارش به‌روزرسانی شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default ordersApi;
