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

  // Tracking Code Modal state
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Reject Reason Modal state
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

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

  const openTrackingModal = (order) => {
    setTrackingModalOrder(order);
    setTrackingInput(order.postTrackingCode || order.trackingCode || '');
  };

  const handleSaveTrackingCode = () => {
    if (!trackingModalOrder) return;
    const orderId = trackingModalOrder.id || trackingModalOrder._id;
    if (onUpdateStatus) {
      onUpdateStatus(orderId, trackingModalOrder.status || 'ارسال شده', trackingInput.trim());
    }
    setTrackingModalOrder(null);
    setTrackingInput('');
  };

  const openRejectModal = (order) => {
    setRejectModalOrder(order);
    setRejectReasonInput(order.cancelReason || '');
  };

  const handleSaveRejectReason = () => {
    if (!rejectModalOrder) return;
    const orderId = rejectModalOrder.id || rejectModalOrder._id;
    if (onUpdateStatus) {
      onUpdateStatus(orderId, 'لغو شده', rejectModalOrder.postTrackingCode, rejectReasonInput.trim());
    }
    setRejectModalOrder(null);
    setRejectReasonInput('');
  };

  const handleStatusSelectChange = (order, newStatus) => {
    const orderId = order.id || order._id;
    if (newStatus === 'لغو شده' || newStatus === 'cancelled') {
      openRejectModal(order);
    } else if (newStatus === 'ارسال شده' || newStatus === 'shipped') {
      setTrackingModalOrder(order);
      setTrackingInput(order.postTrackingCode || '');
    } else {
      if (onUpdateStatus) {
        onUpdateStatus(orderId, newStatus, order.postTrackingCode, order.cancelReason);
      }
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>فهرست سفارشات مشتریان</h2>
          <p className={styles.subtitle}>تغییر وضعیت، ثبت کد رهگیری پستی، دلیل رد سفارش و بررسی فیش‌ها</p>
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
          <option value="cancelled">لغو شده / رد شده</option>
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
            const isCancelled = order.status === 'لغو شده' || order.status === 'cancelled';

            return (
              <div key={orderId} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <div className={styles.rowCenterWrap}>
                    <h3 className={styles.itemName}>
                      {order.customerName || order.name || 'مشتری بدون نام'}
                    </h3>
                    <span className={`${styles.badge} ${isCancelled ? styles.badgeDanger : styles.badgeWarning}`}>
                      {order.status || 'در حال پردازش'}
                    </span>
                  </div>

                  <p className={styles.itemMeta}>
                    <span>شناسه سفارش: {order.trackingCode || orderId?.slice(-6)}</span>
                    <span>|</span>
                    <span>مبلغ: {amount.toLocaleString('fa-IR')} تومان</span>
                    <span>|</span>
                    <span>تلفن: {order.customerPhone || order.phone || 'ثبت نشده'}</span>
                  </p>

                  {order.postTrackingCode && (
                    <p className={styles.itemMeta} style={{ color: '#0284c7', fontWeight: 600 }}>
                      <i className="fa-solid fa-truck-fast" style={{ marginLeft: '4px' }} />
                      <span>کد رهگیری پستی: {order.postTrackingCode}</span>
                    </p>
                  )}

                  {isCancelled && order.cancelReason && (
                    <p className={styles.itemMeta} style={{ color: '#e11d48', fontWeight: 600 }}>
                      <i className="fa-solid fa-circle-exclamation" style={{ marginLeft: '4px' }} />
                      <span>دلیل رد/لغو سفارش: {order.cancelReason}</span>
                    </p>
                  )}

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

                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => openTrackingModal(order)}
                    title="ثبت یا ویرایش کد رهگیری پستی"
                  >
                    <i className="fa-solid fa-barcode" />
                    <span>کد رهگیری</span>
                  </button>

                  <select
                    className={styles.select}
                    value={order.status || 'در حال پردازش'}
                    onChange={(event) => handleStatusSelectChange(order, event.target.value)}
                  >
                    <option value="در حال پردازش">در حال پردازش</option>
                    <option value="ارسال شده">ارسال شده</option>
                    <option value="تحویل شده">تحویل شده</option>
                    <option value="لغو شده">لغو شده / رد شده</option>
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

      {/* Modal 1: Postal Tracking Code */}
      {trackingModalOrder && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>ثبت/ویرایش کد رهگیری پستی</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setTrackingModalOrder(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>کد ۲۴ رقمی مرسوله پستی اداره پست:</label>
              <input
                type="text"
                className={styles.input}
                placeholder="مثال: 192837465019283746501234"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                style={{ direction: 'ltr', textAlign: 'left', fontFamily: 'monospace' }}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setTrackingModalOrder(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleSaveTrackingCode}
              >
                ذخیره کد رهگیری
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Order Rejection Reason */}
      {rejectModalOrder && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>ثبت دلیل رد / لغو سفارش</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setRejectModalOrder(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>علت رد یا لغو این سفارش را برای اطلاع مشتری وارد کنید:</label>
              <textarea
                className={styles.input}
                rows={3}
                placeholder="مثال: عدم تطابق فیش واریزی با مبلغ سفارش / اتمام موجودی محصول"
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setRejectModalOrder(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleSaveRejectReason}
              >
                لغو و ثبت علت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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

      {/* Payment Receipt Preview Modal */}
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
