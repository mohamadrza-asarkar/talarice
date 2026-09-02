import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseOrder(o) {
  if (!o) return null;
  const id = String(o._id || o.id || '');
  const state = o.state || o.status || 'pending';
  const orderNumber = o.orderNumber || o.orderCode || o.code || id;

  let items = [];
  // Handle products or items array from backend
  const rawList = o.products || o.items || [];
  if (Array.isArray(rawList)) {
    items = rawList.map(item => {
      const prod = item.product || item;
      return {
        id: item.productId || prod.id || prod._id || '',
        productId: item.productId || prod.id || prod._id || '',
        name: item.title || item.name || prod.name || prod.title || 'برنج اصیل طلا رایس',
        title: item.title || item.name || prod.name || prod.title || 'برنج اصیل طلا رایس',
        price: Number(item.price || item.finalPrice || prod.price || 0),
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
    name: o.name || o.customerName || o.fullName || o.receiverName || o.user?.name || '',
    phone: o.phone || o.customerPhone || o.receiverPhone || o.user?.phone || '',
    address: o.address || o.customerAddress || o.shippingAddress || '',
    shippingAddress: o.address || o.customerAddress || o.shippingAddress || '',
    postalCode: o.postalCode || '',
    postTrackingCode: o.postTrackingCode || o.trackingCode || '',
    trackingCode: o.postTrackingCode || o.trackingCode || '',
    state: state,
    status: state,
    paymentStatus: o.paymentStatus || (o.isPaid ? 'paid' : 'pending'),
    isPaid: o.paymentStatus === 'paid' || Boolean(o.isPaid),
    paymentReceipt: o.paymentReceipt || o.receiptImage || '',
    paymentReceiptDate: o.paymentReceiptDate || null,
    products: items,
    items: items,
    totalPrice: Number(o.totalPrice || o.totalAmount || o.finalAmount || 0),
    totalAmount: Number(o.totalPrice || o.totalAmount || o.finalAmount || 0),
    finalAmount: Number(o.totalPrice || o.totalAmount || o.finalAmount || 0),
    shippingFee: Number(o.shippingFee ?? 0),
    paymentMethod: o.paymentMethod || 'gateway',
    adminNote: o.adminNote || '',
    createdAt: o.createdAt || o.date || new Date().toISOString(),
    date: o.date || (o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
    user: o.user
  };
}

export const ordersApi = {
  /**
   * 5.1 Create new order
   * POST /api/orders
   * Headers: Authorization: Bearer <TOKEN>
   * Body: { name, phone, address, postalCode, products: [{ name, price, quantity }], paymentReceipt }
   */
  async createOrder(orderPayload) {
    try {
      // Format products according to documentation (Section 5.1)
      const formattedProducts = (orderPayload.products || orderPayload.items || []).map(item => {
        const prod = item.product || item;
        return {
          name: item.name || prod.name || prod.title || 'برنج اصیل طلا رایس',
          price: Number(item.price || prod.price || 0),
          quantity: Number(item.quantity || 1)
        };
      });

      const payload = {
        name: orderPayload.name || orderPayload.recipientName || '',
        phone: orderPayload.phone || '',
        address: orderPayload.address || orderPayload.fullAddress || orderPayload.shippingAddress || '',
        postalCode: orderPayload.postalCode || '',
        products: formattedProducts,
        paymentReceipt: orderPayload.paymentReceipt || orderPayload.receiptImage || ''
      };

      const response = await client.post('/orders', payload);
      const rawOrder = response?.data?.order || response?.data || response;
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
   * 5.2 Track order by postal tracking code
   * GET /api/orders/track/:postTrackingCode
   */
  async trackOrder(postTrackingCode) {
    try {
      const cleanCode = encodeURIComponent(postTrackingCode.trim());
      const response = await client.get(`/orders/track/${cleanCode}`);
      const rawOrder = response?.data?.order || response?.data;
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parseOrder(rawOrder),
        message: response?.message || 'اطلاعات رهگیری مرسوله با موفقیت دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.3 Upload payment receipt
   * PUT /api/orders/:id/receipt
   * Body: { receiptImage } or FormData
   */
  async uploadReceipt(orderId, receiptData) {
    try {
      const isFormData = receiptData instanceof FormData;
      const payload = isFormData ? receiptData : { receiptImage: receiptData.receiptImage || receiptData };
      const response = await client.put(`/orders/${orderId}/receipt`, payload);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'رسید پرداخت با موفقیت ارسال شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.4 Verify payment (Admin Only)
   * PUT /api/orders/:id/verify-payment
   * Body: { status: 'approved' | 'rejected', state: 'processing', adminNote }
   */
  async verifyPayment(orderId, verifyData) {
    try {
      const response = await client.put(`/orders/${orderId}/verify-payment`, verifyData);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'وضعیت پرداخت سفارش با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.5 Update order status & postal tracking code (Admin Only)
   * PUT /api/orders/:id/status
   * Body: { state, postTrackingCode, adminNote }
   */
  async updateOrderStatus(orderId, statusData) {
    try {
      const payload = typeof statusData === 'string'
        ? { state: statusData, status: statusData }
        : {
            state: statusData.state || statusData.status || 'pending',
            postTrackingCode: statusData.postTrackingCode || statusData.trackingCode || '',
            adminNote: statusData.adminNote || ''
          };

      const response = await client.put(`/orders/${orderId}/status`, payload);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'وضعیت سفارش و کد رهگیری پستی به‌روزرسانی شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.6 Get list of user orders
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
   * 5.7 Get single order details
   * GET /api/orders/:id
   */
  async getOrderById(orderId) {
    try {
      const response = await client.get(`/orders/${orderId}`);
      const rawOrder = response?.data?.order || response?.data;
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parseOrder(rawOrder),
        message: response?.message || 'جزئیات سفارش دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.8 Update order details (Admin)
   * PUT /api/orders/:id or PUT /api/admin/orders/:id
   */
  async updateOrder(orderId, orderData) {
    try {
      let response;
      try {
        response = await client.put(`/orders/${orderId}`, orderData);
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 405) {
          response = await client.put(`/admin/orders/${orderId}`, orderData);
        } else {
          throw err;
        }
      }
      const raw = response?.data?.order || response?.data || { id: orderId, ...orderData };
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parseOrder(raw),
        message: response?.message || 'اطلاعات سفارش با موفقیت ویرایش شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * 5.9 Delete order (Admin)
   * DELETE /api/orders/:id or DELETE /api/admin/orders/:id
   */
  async deleteOrder(orderId) {
    try {
      let response;
      try {
        response = await client.delete(`/orders/${orderId}`);
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 405) {
          response = await client.delete(`/admin/orders/${orderId}`);
        } else {
          throw err;
        }
      }
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'سفارش با موفقیت حذف گردید'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default ordersApi;
