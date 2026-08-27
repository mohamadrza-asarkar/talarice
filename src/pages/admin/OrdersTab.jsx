import React from 'react';
import { useApp } from '../../context';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import styles from './style.module.css';

export const OrdersTab = () => {
  const { orders, setOrders } = useApp();

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>سفارشات فروشگاه</h1>
          <p className={styles.tabSubtitle}>مشاهده و بررسی وضعیت مرسولات مشتریان</p>
        </div>
      </div>

      <div className={styles.card}>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={64} className={styles.emptyIcon} />
            <p className={styles.emptyText}>سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th} style={{ paddingLeft: '1rem' }}>کد رهگیری سیستم</th>
                    <th className={styles.th}>اطلاعات مشتری</th>
                    <th className={styles.th}>مبلغ نهایی (تومان)</th>
                    <th className={styles.th}>وضعیت فعلی</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id || o._id} className={styles.tr}>
                      <td className={styles.td} style={{ paddingLeft: '1rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700, color: '#475569', backgroundColor: '#f1f5f9', padding: '0.375rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                          {String(o.id || o._id).slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 900, color: '#1e293b' }}>{o.user?.name || o.addresses?.[0]?.recipientName || 'مشتری ناشناس'}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '0.125rem' }}>{o.user?.phone || o.addresses?.[0]?.phone || '---'}</div>
                      </td>
                      <td className={styles.td} style={{ fontWeight: 900, color: '#334155' }}>
                        {(o.finalAmount || o.totalPrice)?.toLocaleString()}
                      </td>
                      <td className={styles.td}>
                        {o.status === 'processing' && (
                          <div className={styles.statusProcessing}>
                            در حال پردازش
                          </div>
                        )}
                        {o.status === 'shipped' && (
                          <div className={styles.statusShipped}>
                            <Truck size={14} />
                            ارسال شده
                          </div>
                        )}
                        {o.status === 'delivered' && (
                          <div className={styles.statusDelivered}>
                            <CheckCircle2 size={14} />
                            تحویل شده
                          </div>
                        )}
                      </td>
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        {o.status === 'processing' ? (
                           <button onClick={() => updateStatus(o.id || o._id, 'shipped')} className={styles.orderActionBtn}>
                             <Truck size={14} /> تغییر به ارسال شده
                           </button>
                        ) : (
                           <span style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 700, padding: '0.5rem 1rem' }}>اقدامی نیاز نیست</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
