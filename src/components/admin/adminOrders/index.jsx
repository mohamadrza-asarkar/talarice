import React, { useState } from 'react';
import { ShoppingBag, RefreshCw, CheckCircle2, XCircle, Truck, Eye, Trash2, X } from 'lucide-react';
import styles from '../admin.module.css';

export function AdminOrders({
  adminOrders = [],
  isLoadingOrders = false,
  onRefreshOrders,
  onUpdateStatus,
  onDeleteOrder,
  getOrderStatusInfo
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [previewReceipt, setPreviewReceipt] = useState(null);

  const filteredOrders = adminOrders.filter((o) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      String(o.trackingCode || '').includes(q) ||
      String(o.postTrackingCode || '').includes(q) ||
      String(o.customerName || o.name || '').toLowerCase().includes(q) ||
      String(o.customerPhone || o.phone || '').includes(q);

    const statusNorm = String(o.status || '').trim();
    const matchStatus =
      statusFilter === 'all' ||
      statusNorm === statusFilter ||
      (statusFilter === 'processing' && (statusNorm === 'در حال پردازش' || statusNorm === 'pending')) ||
      (statusFilter === 'shipped' && (statusNorm === 'ارسال شده' || statusNorm === 'shipped')) ||
      (statusFilter === 'delivered' && (statusNorm === 'تحویل شده' || statusNorm === 'delivered')) ||
      (statusFilter === 'cancelled' && (statusNorm === 'لغو شده' || statusNorm === 'cancelled'));

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
          <RefreshCw size={14} />
          <span>{isLoadingOrders ? 'در حال بارگذاری...' : 'تازه‌سازی'}</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجو با کد رهگیری، نام مشتری یا تلفن..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
            <ShoppingBag size={32} />
            <p>هیچ سفارشی یافت نشد.</p>
          </div>
        ) : (
          filteredOrders.map((o) => {
            const oid = o.id || o._id;
            const items = Array.isArray(o.items) ? o.items : [];
            const amount = Number(o.finalAmount || o.totalPrice || 0);

            return (
              <div key={oid} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <div className={styles.rowCenterWrap}>
                    <h3 className={styles.itemName}>
                      {o.customerName || o.name || 'مشتری بدون نام'}
                    </h3>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
                      {o.status || 'در حال پردازش'}
                    </span>
                  </div>

                  <p className={styles.itemMeta}>
                    <span>کد سفارش: {o.trackingCode || oid?.slice(-6)}</span>
                    <span>|</span>
                    <span>مبلغ: {amount.toLocaleString('fa-IR')} تومان</span>
                    <span>|</span>
                    <span>تلفن: {o.customerPhone || o.phone || 'ثبت نشده'}</span>
                  </p>

                  {items.length > 0 && (
                    <p className={styles.itemMeta}>
                      <span>اقلام: {items.map((it) => `${it.name || 'محصول'} (${it.quantity} کیسه)`).join('، ')}</span>
                    </p>
                  )}
                </div>

                <div className={styles.itemActions}>
                  {o.paymentReceipt && (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => setPreviewReceipt(o.paymentReceipt)}
                      title="مشاهده فیش واریزی"
                    >
                      <Eye size={14} />
                      <span>فیش واریز</span>
                    </button>
                  )}

                  <select
                    className={styles.select}
                    value={o.status || 'processing'}
                    onChange={(e) => onUpdateStatus && onUpdateStatus(oid, e.target.value)}
                  >
                    <option value="در حال پردازش">در حال پردازش</option>
                    <option value="ارسال شده">ارسال شده</option>
                    <option value="تحویل شده">تحویل شده</option>
                    <option value="لغو شده">لغو شده</option>
                  </select>

                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setOrderToDelete(o)}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                <X size={18} />
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

      {/* Receipt Preview Modal */}
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
                <X size={18} />
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
