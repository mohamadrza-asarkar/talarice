import React, { useState } from 'react';
import { useApp } from '../../context';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  X,
  FileText,
  MapPin,
  Phone,
  User,
  Check
} from 'lucide-react';
import styles from './style.module.css';

export function OrdersTab() {
  const { orders, setOrders } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  function updateStatus(id, newStatus) {
    const updated = orders.map(function (o) {
      const orderId = o.id || o._id;
      if (orderId === id) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    if (selectedOrder && (selectedOrder.id === id || selectedOrder._id === id)) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(function (o) {
    const orderId = String(o.id || o._id || '');
    const tracking = String(o.trackingCode || '');
    const customerName = o.user?.name || o.addresses?.[0]?.recipientName || '';
    const customerPhone = o.user?.phone || o.addresses?.[0]?.phone || '';

    const matchesSearch =
      !search ||
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      tracking.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerPhone.includes(search);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'reviewing' && (o.status === 'reviewing' || o.status === 'processing')) ||
      (statusFilter === 'shipping' && (o.status === 'shipping' || o.status === 'in_transit')) ||
      (statusFilter === 'shipped' && o.status === 'shipped') ||
      (statusFilter === 'delivered' && o.status === 'delivered') ||
      o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const reviewingCount = orders.filter(function (o) { return o.status === 'reviewing' || o.status === 'processing'; }).length;
  const shippingCount = orders.filter(function (o) { return o.status === 'shipping' || o.status === 'in_transit'; }).length;
  const shippedCount = orders.filter(function (o) { return o.status === 'shipped'; }).length;
  const deliveredCount = orders.filter(function (o) { return o.status === 'delivered'; }).length;

  return (
    <div>
      {/* Tab Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت سفارشات و فاکتورها</span>
          </h1>
          <p className={styles.tabSubtitle}>
            بررسی وضعیت پرداخت، آدرس تحویل و ثبت کد رهگیری مرسولات برنج طلا رایس
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو بر اساس نام خریدار، شماره تماس، کد رهگیری..."
              value={search}
              onChange={function (e) { setSearch(e.target.value); }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterChips}>
            <button
              onClick={function () { setStatusFilter('all'); }}
              className={`${styles.filterChip} ${statusFilter === 'all' ? styles.filterChipActive : ''}`}
            >
              همه ({orders.length})
            </button>
            <button
              onClick={function () { setStatusFilter('reviewing'); }}
              className={`${styles.filterChip} ${
                statusFilter === 'reviewing' ? styles.filterChipActive : ''
              }`}
            >
              درحال بررسی ({reviewingCount})
            </button>
            <button
              onClick={function () { setStatusFilter('shipping'); }}
              className={`${styles.filterChip} ${
                statusFilter === 'shipping' ? styles.filterChipActive : ''
              }`}
            >
              در حال ارسال ({shippingCount})
            </button>
            <button
              onClick={function () { setStatusFilter('shipped'); }}
              className={`${styles.filterChip} ${
                statusFilter === 'shipped' ? styles.filterChipActive : ''
              }`}
            >
              ارسال شده ({shippedCount})
            </button>
            <button
              onClick={function () { setStatusFilter('delivered'); }}
              className={`${styles.filterChip} ${
                statusFilter === 'delivered' ? styles.filterChipActive : ''
              }`}
            >
              تحویل شده ({deliveredCount})
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableContainer}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ سفارشی با مشخصات مورد نظر یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>کد سفارش</th>
                    <th className={styles.th}>مشخصات خریدار</th>
                    <th className={styles.th}>تاریخ ثبت</th>
                    <th className={styles.th}>مبلغ پرداختی</th>
                    <th className={styles.th}>وضعیت مرسوله</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>اقدام / فاکتور</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(function (o) {
                    const id = o.id || o._id;
                    const customerName =
                      o.user?.name || o.addresses?.[0]?.recipientName || 'مشتری ناشناس';
                    const customerPhone =
                      o.user?.phone || o.addresses?.[0]?.phone || 'ثبت نشده';
                    const amount = o.finalAmount || o.totalPrice || o.totalAmount || 0;

                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Order code */}
                        <td className={styles.td}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.8125rem',
                              fontWeight: 800,
                              color: '#042a1b',
                              backgroundColor: '#f1f5f9',
                              padding: '0.3125rem 0.625rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #e2e8f0',
                              display: 'inline-block'
                            }}
                          >
                            {String(id).slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className={styles.td}>
                          <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                            {customerName}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '0.125rem' }}>
                            {customerPhone}
                          </div>
                        </td>

                        {/* Date */}
                        <td className={styles.td}>
                          <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                            {o.date || '۱۴۰۳/۰۶/۲۰'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className={styles.td}>
                          <span className={styles.priceText}>{amount.toLocaleString()}</span>{' '}
                          <span className={styles.currency}>تومان</span>
                        </td>

                        {/* Status */}
                        <td className={styles.td}>
                          {(o.status === 'reviewing' || o.status === 'processing') && (
                            <span className={styles.statusProcessing}>
                              <Clock size={13} />
                              درحال بررسی
                            </span>
                          )}
                          {(o.status === 'shipping' || o.status === 'in_transit') && (
                            <span
                              className={styles.statusShipped}
                              style={{ backgroundColor: '#f0f9ff', color: '#0284c7', borderColor: '#bae6fd' }}
                            >
                              <Truck size={13} />
                              در حال ارسال
                            </span>
                          )}
                          {o.status === 'shipped' && (
                            <span
                              className={styles.statusShipped}
                              style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}
                            >
                              <Package size={13} />
                              ارسال شده
                            </span>
                          )}
                          {o.status === 'delivered' && (
                            <span className={styles.statusDelivered}>
                              <CheckCircle2 size={13} />
                              تحویل شده
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div className={styles.actionBtnGroup}>
                            <button
                              onClick={function () { setSelectedOrder(o); }}
                              className={styles.detailBtn}
                              title="مشاهده جزئیات فاکتور"
                            >
                              <Eye size={15} />
                              <span>فاکتور</span>
                            </button>

                            {(o.status === 'reviewing' || o.status === 'processing') && (
                              <button
                                onClick={function () { updateStatus(id, 'shipping'); }}
                                className={styles.orderActionBtn}
                                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                                title="تغییر به در حال ارسال"
                              >
                                <Truck size={14} />
                                <span>ارسال</span>
                              </button>
                            )}

                            {(o.status === 'shipping' || o.status === 'in_transit') && (
                              <button
                                onClick={function () { updateStatus(id, 'shipped'); }}
                                className={styles.orderActionBtn}
                                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                                title="تغییر به ارسال شده"
                              >
                                <Package size={14} />
                                <span>ارسال شد</span>
                              </button>
                            )}

                            {o.status === 'shipped' && (
                              <button
                                onClick={function () { updateStatus(id, 'delivered'); }}
                                className={styles.orderActionBtn}
                                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                                title="تغییر به تحویل شده"
                              >
                                <Check size={14} />
                                <span>تحویل</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details / Invoice Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={function () { setSelectedOrder(null); }}>
          <div className={styles.modalBox} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>جزئیات فاکتور سفارش</h3>
                <p className={styles.modalDesc}>
                  کد سفارش: {String(selectedOrder.id || selectedOrder._id).slice(-8).toUpperCase()} | تاریخ:{' '}
                  {selectedOrder.date || 'امروز'}
                </p>
              </div>
              <button
                type="button"
                onClick={function () { setSelectedOrder(null); }}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.invoiceBox}>
                {/* Status bar inside invoice */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#fafbfc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#042a1b' }}>
                    تغییر وضعیت مرسوله:
                  </span>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={function () { updateStatus(selectedOrder.id || selectedOrder._id, 'reviewing'); }}
                      className={`${styles.filterChip} ${
                        (selectedOrder.status === 'reviewing' || selectedOrder.status === 'processing')
                          ? styles.filterChipActive
                          : ''
                      }`}
                    >
                      درحال بررسی
                    </button>
                    <button
                      onClick={function () { updateStatus(selectedOrder.id || selectedOrder._id, 'shipping'); }}
                      className={`${styles.filterChip} ${
                        (selectedOrder.status === 'shipping' || selectedOrder.status === 'in_transit')
                          ? styles.filterChipActive
                          : ''
                      }`}
                    >
                      در حال ارسال
                    </button>
                    <button
                      onClick={function () { updateStatus(selectedOrder.id || selectedOrder._id, 'shipped'); }}
                      className={`${styles.filterChip} ${
                        selectedOrder.status === 'shipped' ? styles.filterChipActive : ''
                      }`}
                    >
                      ارسال شده
                    </button>
                    <button
                      onClick={function () { updateStatus(selectedOrder.id || selectedOrder._id, 'delivered'); }}
                      className={`${styles.filterChip} ${
                        selectedOrder.status === 'delivered' ? styles.filterChipActive : ''
                      }`}
                    >
                      تحویل شده
                    </button>
                  </div>
                </div>

                {/* Customer Information */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <User size={15} /> مشخصات تحویل‌گیرنده
                  </h4>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>نام و نام خانوادگی:</span>
                    <span className={styles.invoiceVal}>
                      {selectedOrder.user?.name ||
                        selectedOrder.addresses?.[0]?.recipientName ||
                        'محمد رضایی'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>شماره تماس:</span>
                    <span className={styles.invoiceVal} dir="ltr">
                      {selectedOrder.user?.phone ||
                        selectedOrder.addresses?.[0]?.phone ||
                        '۰۹۱۷ ۱۲۳ ۴۵۶۷'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>آدرس پستی:</span>
                    <span className={styles.invoiceVal} style={{ textAlign: 'left', maxWidth: '65%' }}>
                      {selectedOrder.addresses?.[0]?.fullAddress ||
                        'شیراز، بلوار ارم، کوچه ۱۲، پلاک ۴، زنگ ۲'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>کد پستی:</span>
                    <span className={styles.invoiceVal} dir="ltr">
                      {selectedOrder.addresses?.[0]?.postalCode || '۷۱۹۴۷۱۲۳۴۵'}
                    </span>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <Package size={15} /> اقلام سفارش داده شده
                  </h4>
                  <div className={styles.invoiceItemList}>
                    {(selectedOrder.items || []).length > 0 ? (
                      selectedOrder.items.map(function (item, idx) {
                        return (
                          <div key={idx} className={styles.invoiceItemCard}>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#042a1b' }}>
                                {item.product?.name || 'برنج کامفیروزی اعلا طلا رایس'}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.125rem' }}>
                                بسته‌بندی: گونی نخی اعلا ضد رطوبت | تعداد:{' '}
                                {item.quantity || 1} کیسه
                              </div>
                            </div>
                            <div style={{ fontWeight: 900, color: '#042a1b', fontSize: '0.8125rem' }}>
                              {((item.product?.price || 1450000) * (item.quantity || 1)).toLocaleString()}{' '}
                              تومان
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.invoiceItemCard}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#042a1b' }}>
                            برنج کامفیروزی ممتاز اعلا طلا رایس
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            بسته‌بندی: کیسه نخی سفید اعلا | تعداد: ۱ کیسه
                          </div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#042a1b', fontSize: '0.8125rem' }}>
                          {(selectedOrder.finalAmount || 1450000).toLocaleString()} تومان
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <FileText size={15} /> خلاصه مالی سفارش
                  </h4>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>جمع اقلام:</span>
                    <span className={styles.invoiceVal}>
                      {(
                        selectedOrder.totalAmount ||
                        selectedOrder.finalAmount ||
                        1450000
                      ).toLocaleString()}{' '}
                      تومان
                    </span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className={styles.invoiceRow}>
                      <span className={styles.invoiceLabel}>تخفیف اعمال شده:</span>
                      <span className={styles.invoiceVal} style={{ color: '#059669' }}>
                        - {selectedOrder.discountAmount.toLocaleString()} تومان
                      </span>
                    </div>
                  )}
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>هزینه بسته‌بندی نخی و ارسال:</span>
                    <span className={styles.invoiceVal} style={{ color: '#059669' }}>
                      {selectedOrder.shippingFee === 0 || !selectedOrder.shippingFee
                        ? 'رایگان (طلا رایس)'
                        : `${selectedOrder.shippingFee.toLocaleString()} تومان`}
                    </span>
                  </div>
                  <div
                    className={styles.invoiceRow}
                    style={{
                      borderTop: '1px solid #cbd5e1',
                      paddingTop: '0.5rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    <span style={{ fontWeight: 900, color: '#042a1b', fontSize: '0.9375rem' }}>
                      مبلغ نهایی پرداختی:
                    </span>
                    <span style={{ fontWeight: 900, color: '#042a1b', fontSize: '1.0625rem' }}>
                      {(
                        selectedOrder.finalAmount ||
                        selectedOrder.totalPrice ||
                        1450000
                      ).toLocaleString()}{' '}
                      تومان
                    </span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={function () { setSelectedOrder(null); }}
                    className={styles.cancelBtn}
                    style={{ width: '100%' }}
                  >
                    بستن فاکتور
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
