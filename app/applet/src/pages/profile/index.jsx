import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProfilePage = () => {
  const { orders } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('orders');
  const [supportText, setSupportText] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  return (
    <div className={styles.profileWrapper}>
      
      <div className={styles.heroBox}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <i className="fa-solid fa-user" />
          </div>
        </div>
        <h2 className={styles.userName}>
          کاربر طلا رایس
        </h2>
        <span className={styles.userPhone}>
          ۰۹۱۷***۱۲۳۴
        </span>
      </div>

      <div className={styles.tabsContainer}>
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`${styles.tabBtn} ${
            activeSubTab === 'orders' ? styles.tabBtnActive : styles.tabBtnInactive
          }`}
        >
          سفارشات من
        </button>
        <button
          onClick={() => setActiveSubTab('support')}
          className={`${styles.tabBtn} ${
            activeSubTab === 'support' ? styles.tabBtnActive : styles.tabBtnInactive
          }`}
        >
          پشتیبانی
        </button>
      </div>

      {activeSubTab === 'orders' && (
        <div className={styles.ordersContainer}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <i className="fa-solid fa-file-invoice" />
              </div>
              <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderIdBadge}>
                      سفارش #{order.id}
                    </div>
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                  
                  <div className={styles.orderDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>وضعیت:</span>
                      <span className={styles.statusBadge}>{order.status}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>مبلغ کل:</span>
                      <span className={styles.detailValue}>
                        {order.finalAmount.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    {order.trackingCode && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>کد رهگیری:</span>
                        <span className={styles.trackingCode}>{order.trackingCode}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={styles.orderItem}>
                        <span>
                          {item.product.name} (کیسه {item.weightKg.toLocaleString('fa-IR')} ک)
                        </span>
                        <span>
                          {item.quantity.toLocaleString('fa-IR')} عدد
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'support' && (
        <div className={styles.supportContainer}>
          <div className={styles.supportCard}>
            <h3 className={styles.supportTitle}>
              ارتباط مستقیم با واحد فروش و امور مشتریان:
            </h3>
            <div className={styles.contactGrid}>
              <a href="tel:09170000000" className={styles.contactBtn}>
                <i className="fa-solid fa-phone" />
                <span>تماس تلفنی</span>
              </a>
              <a href="https://wa.me/#" target="_blank" rel="noreferrer" className={styles.whatsappBtn}>
                <i className="fa-brands fa-whatsapp" />
                <span>واتساپ پشتیبانی</span>
              </a>
            </div>

            <div className={styles.ticketSection}>
              <label className={styles.ticketLabel}>
                ارسال پیام یا سوال به پشتیبانی:
              </label>
              <textarea
                rows={2}
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                placeholder="سوال خود درباره پخت، ارسال یا کیفیت برنج را بنویسید..."
                className={styles.ticketTextarea}
              />
              {supportSuccess ? (
                <p className={styles.ticketSuccess}>
                  پیام شما دریافت شد. همکاران ما به زودی پاسخ خواهند داد.
                </p>
              ) : (
                <button
                  onClick={() => {
                    if (supportText.trim()) {
                      setSupportSuccess(true);
                      setSupportText('');
                      setTimeout(() => setSupportSuccess(false), 3000);
                    }
                  }}
                  className={styles.ticketSubmitBtn}
                >
                  ارسال تیکت پشتیبانی
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
