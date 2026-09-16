import React from 'react';
import { ShoppingBag, RefreshCw, CheckCircle2, XCircle, Truck, Eye, Trash2 } from 'lucide-react';
import styles from '../../../pages/pages.module.css';

export function AdminOrders({
  adminOrders,
  isLoadingOrders,
  fetchAdminOrders,
  orderSearchQuery,
  setOrderSearchQuery,
  orderStatusFilter,
  setOrderStatusFilter,
  getOrderStatusInfo,
  setPreviewReceiptUrl,
  handleVerifyReceipt,
  setEditingTrackingOrderId,
  setTrackingCodeInput,
  setAdminNoteInput,
  handleUpdateStatus,
  handleDeleteOrder
}) {
  const filteredOrders = adminOrders.filter((o) => {
    const matchSearch =
      !orderSearchQuery.trim() ||
      String(o.trackingCode || '').includes(orderSearchQuery.trim()) ||
      String(o.postTrackingCode || '').includes(orderSearchQuery.trim()) ||
      String(o.customerName || o.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      String(o.customerPhone || o.phone || '').includes(orderSearchQuery.trim());

    const statusNorm = String(o.status || o.state || '').trim();
    const matchStatus =
      orderStatusFilter === 'all' ||
      statusNorm === orderStatusFilter ||
      (orderStatusFilter === 'processing' && (statusNorm === 'در حال پردازش' || statusNorm === 'pending')) ||
      (orderStatusFilter === 'shipped' && (statusNorm === 'ارسال شده' || statusNorm === 'shipped')) ||
      (orderStatusFilter === 'delivered' && (statusNorm === 'تحویل شده' || statusNorm === 'delivered')) ||
      (orderStatusFilter === 'cancelled' && (statusNorm === 'لغو شده' || statusNorm === 'cancelled'));

    return matchSearch && matchStatus;
  });

  return (
    <section className={styles.card}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>فهرست سفارشات ثبت شده در سرور</h2>
          <p className={styles.pageSubtitle}>تغییر وضعیت سفارش، تایید فیش بانکی و ثبت کدهای رهگیری پستی ۲۴ رقمی</p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          onClick={fetchAdminOrders}
          disabled={isLoadingOrders}
        >
          <RefreshCw size={14} className={isLoadingOrders ? styles.spinner : ''} />
          تازه‌سازی سفارش‌ها
        </button>
      </div>

      <div className={styles.flexRow} style={{ gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <input
            type="text"
            className={styles.input}
            placeholder="جستجو با نام خریدار، شماره تماس یا کد رهگیری..."
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          style={{ width: 'auto', minWidth: '160px' }}
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
        >
          <option value="all">همه وضعیت‌ها ({adminOrders.length})</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده (پست)</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
      </div>

      <div className={styles.flexCol}>
        {isLoadingOrders && adminOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>
            <RefreshCw size={24} className={styles.spinner} style={{ margin: '0 auto 0.5rem auto' }} />
            <p>در حال دریافت سفارشات از سرور...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
            <ShoppingBag size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
            <p>{orderSearchQuery ? 'سفارشی با مشخصات جستجو شده یافت نشد.' : 'هنوز سفارشی در سیستم ثبت نشده است.'}</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = getOrderStatusInfo(order.status || order.state);
            const orderId = order._id || order.id;
            const finalSum = Number(order.finalAmount || order.totalPrice || 0);

            return (
              <div key={orderId} className={styles.statBox} style={{ border: '1px solid #e7e5e4', background: '#fff' }}>
                <div className={styles.pageHeader} style={{ marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <div>
                    <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <strong className={styles.pageTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
                        کد رهگیری: {order.postTrackingCode || order.trackingCode || orderId}
                      </strong>
                      <span
                        className={styles.badge}
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                          borderColor: status.border
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className={styles.pageSubtitle} style={{ margin: '0.25rem 0' }}>
                      خریدار: <strong>{order.customerName || order.name || 'کاربر گرامی'}</strong> | تلفن: <span dir="ltr">{order.customerPhone || order.phone || 'ثبت نشده'}</span>
                    </p>
                    <small className={styles.label}>
                      نشانی گیرنده: {order.customerAddress || order.address || 'نشانی ثبت نشده'}
                    </small>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <span className={styles.currentPrice} style={{ fontSize: '1.1rem', display: 'block' }}>
                      {finalSum.toLocaleString('fa-IR')} تومان
                    </span>
                    <small className={styles.label} style={{ fontSize: '0.75rem' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : 'امروز'}
                    </small>
                  </div>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#334155' }}>اقلام سفارش:</strong>
                  <div className={styles.flexCol} style={{ gap: '0.25rem' }}>
                    {(order.items || order.products || []).map((item, idx) => (
                      <div key={idx} className={styles.flexRow} style={{ justifyContent: 'space-between', color: '#475569' }}>
                        <span>• {item.name || item.title || 'برنج اصیل'}</span>
                        <span>{item.quantity || item.qty || 1} عدد ({Number(item.price || 0).toLocaleString('fa-IR')} تومان)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* دکمه‌های عملیات مدیریت سفارش */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  {(order.paymentReceipt || order.receiptImage) && (
                    <button
                      type="button"
                      className={styles.backButton}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                      onClick={() => setPreviewReceiptUrl(order.paymentReceipt || order.receiptImage)}
                    >
                      <Eye size={13} />
                      مشاهده فیش
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.backButton}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#0284c7', borderColor: '#bae6fd' }}
                    onClick={() => {
                      setEditingTrackingOrderId(orderId);
                      setTrackingCodeInput(order.postTrackingCode || '');
                      setAdminNoteInput(order.adminNote || '');
                    }}
                  >
                    <Truck size={13} />
                    ثبت کد پستی / رهگیری
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#0284c7' }}
                    onClick={() => handleUpdateStatus(orderId, 'ارسال شده')}
                  >
                    تغییر به ارسال شده
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#16a34a' }}
                    onClick={() => handleUpdateStatus(orderId, 'تحویل شده')}
                  >
                    تغییر به تحویل شده
                  </button>
                  {handleDeleteOrder && (
                    <button
                      type="button"
                      className={styles.btnDanger}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleDeleteOrder(orderId)}
                    >
                      <Trash2 size={13} />
                      حذف
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
