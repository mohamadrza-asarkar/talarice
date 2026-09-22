import React, { useState } from 'react';
import styles from '../admin.module.css';

export function AdminOrders({
  adminOrders = [],
  isLoadingOrders = false,
  onRefreshOrders,
  onUpdateStatus,
  onDeleteOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [previewReceipt, setPreviewReceipt] = useState(null);

  const queryText = searchQuery.trim().toLowerCase();

  const filteredOrders = adminOrders.filter((order) => {
    const tracking = order.trackingCode || '';
    const postTracking = order.postTrackingCode || '';
    const customer = order.customerName || order.name || '';
    const phone = order.customerPhone || order.phone || '';

    const matchSearch =
      !queryText ||
      tracking.includes(queryText) ||
      postTracking.includes(queryText) ||
      customer.toLowerCase().includes(queryText) ||
      phone.includes(queryText);

    const statusText = order.status || '';
    const matchStatus =
      statusFilter === 'all' ||
      statusText === statusFilter ||
      (statusFilter === 'processing' && (statusText === 'در حال پردازش' || statusText === 'pending')) ||
      (statusFilter === 'shipped' && (statusText === 'ارسال شده' || statusText === 'shipped')) ||
      (statusFilter === 'delivered' && (statusText === 'تحویل شده' || statusText === 'delivered')) ||
      (statusFilter === 'cancelled' && (statusText === 'لغو شده' || statusText === 'cancelled'));

    return matchSearch && matchStatus;
  });

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>فهرست سفارشات مشتریان</h2>
          <p className={styles.subtitle}>تغییر وضعیت سفارش، بررسی فیش و مدیریت مرسولات</p>
        </div>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onRefreshOrders}
          disabled={isLoadingOrders}
        >
          <i className={`fa-solid fa-arrows-rotate ${isLoadingOrders ? 'fa-spin' : ''}`} />
          <span>{isLoadingOrders ? 'در حال بارگذاری...' : 'تازه‌سازی'}</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجو با کد رهگیری، نام مشتری یا تلفن..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل داده شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
      </div>

      <div className={styles.itemsList}>
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: '2rem' }} />
            <p>هیچ سفارشی یافت نشد.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderId = order.id || order._id;
            const items = Array.isArray(order.items) ? order.items : [];
            const amount = Number(order.finalAmount || order.totalPrice || 0);

            return (
              <div key={orderId} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <div className={styles.rowCenterWrap}>
                    <h3 className={styles.itemName}>
                      {order.customerName || order.name || 'مشتری بدون نام'}
                    </h3>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
                      {order.status || 'در حال پردازش'}
                    </span>
                  </div>

                  <p className={styles.itemMeta}>
                    <span>کد سفارش: {order.trackingCode || orderId?.slice(-6)}</span>
                    <span>|</span>
                    <span>مبلغ: {amount.toLocaleString('fa-IR')} تومان</span>
                    <span>|</span>
                    <span>تلفن: {order.customerPhone || order.phone || 'ثبت نشده'}</span>
                  </p>

                  {items.length > 0 && (
                    <p className={styles.itemMeta}>
                      <span>اقلام: {items.map((item) => `${item.name || 'محصول'} (${item.quantity} کیسه)`).join('، ')}</span>
                    </p>
                  )}
                </div>

                <div className={styles.itemActions}>
                  {order.paymentReceipt && (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => setPreviewReceipt(order.paymentReceipt)}
                      title="مشاهده فیش واریزی"
                    >
                      <i className="fa-solid fa-eye" />
                      <span>فیش واریز</span>
                    </button>
                  )}

                  <select
                    className={styles.select}
                    value={order.status || 'در حال پردازش'}
                    onChange={(event) => onUpdateStatus && onUpdateStatus(orderId, event.target.value)}
                  >
                    <option value="در حال پردازش">در حال پردازش</option>
                    <option value="ارسال شده">ارسال شده</option>
                    <option value="تحویل شده">تحویل شده</option>
                    <option value="لغو شده">لغو شده</option>
                  </select>

                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setOrderToDelete(order)}
                  >
                    <i className="fa-solid fa-trash-can" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {orderToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأیید حذف سفارش</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setOrderToDelete(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <p className={styles.confirmText}>
              آیا از حذف سفارش شماره «{orderToDelete.trackingCode || (orderToDelete.id || orderToDelete._id)?.slice(-6)}» اطمینان دارید؟
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setOrderToDelete(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => {
                  const id = orderToDelete.id || orderToDelete._id;
                  setOrderToDelete(null);
                  if (onDeleteOrder) onDeleteOrder(id);
                }}
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {previewReceipt && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تصویر فیش واریزی</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setPreviewReceipt(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <img
              src={previewReceipt}
              alt="فیش واریزی"
              className={styles.receiptImg}
            />
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setPreviewReceipt(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
