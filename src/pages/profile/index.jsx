import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProfilePage = () => {
  const { orders, addresses, logout } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('orders');

  const [wholesaleForm, setWholesaleForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    estimatedKg: '100',
    description: ''
  });
  const [wholesaleSuccess, setWholesaleSuccess] = useState(false);

  const [supportText, setSupportText] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleWholesaleSubmit = (e) => {
    e.preventDefault();
    setWholesaleSuccess(true);
    setTimeout(() => {
      setWholesaleSuccess(false);
      setWholesaleForm({
        businessName: '',
        contactName: '',
        phone: '',
        estimatedKg: '100',
        description: ''
      });
    }, 4000);
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.headerCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              M
            </div>
            <div>
              <h2 className={styles.userName}>محمد رضایی</h2>
              <p className={styles.userPhone}>
                ۰۹۱۷ ۱۲۳ ۴۵۶۷
              </p>
              <span className={styles.userBadge}>
                مشتری طلایی
              </span>
            </div>
          </div>
          <button 
            onClick={logout}
            style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginLeft: '0.5rem' }} />
            خروج
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`${styles.tabBtn} ${
            activeSubTab === 'orders' ? styles.tabActive : styles.tabInactive
          }`}
        >
          سفارش‌ها
        </button>
        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`${styles.tabBtn} ${
            activeSubTab === 'addresses' ? styles.tabActive : styles.tabInactive
          }`}
        >
          آدرس‌ها
        </button>
      </div>

      {activeSubTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 className={styles.sectionTitle}>
            تاریخچه سفارش‌های شما:
          </h3>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-file-invoice" style={{ fontSize: '2.25rem', color: '#d4af37', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className={styles.card}
              >
                <div className={`${styles.row} ${styles.rowBorder}`}>
                  <span className={styles.monoText}>
                    {ord.id}
                  </span>
                  <span className={styles.badgeStatus}>
                    در حال پردازش و بسته‌بندی
                  </span>
                </div>

                <div className={`${styles.row} ${styles.mediumText}`}>
                  <span>تاریخ ثبت: {ord.date}</span>
                  <span>
                    کد پیگیری:{' '}
                    <strong className={styles.monoText}>
                      {ord.trackingCode}
                    </strong>
                  </span>
                </div>

                <div className={styles.boldText}>
                  تعداد اقلام: {ord.items.length} کیسه برنج
                </div>

                <div className={styles.totalRow}>
                  <span>مبلغ کل:</span>
                  <span className={styles.totalValue}>
                    {ord.finalAmount.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'addresses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 className={styles.sectionTitle}>آدرس‌های ثبت شده:</h3>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={styles.card}
            >
              <div className={styles.row}>
                <span className={styles.boldText}>{addr.title}</span>
                {addr.isDefault && (
                  <span className={styles.badgeDefault}>
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className={styles.addressDesc}>
                {addr.fullAddress}
              </p>
              <div className={styles.addressContact}>
                گیرنده: {addr.recipientName} ({addr.phone})
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'wholesale' && (
        <div className={styles.card}>
          <div>
            <h3 className={styles.sectionTitle}>
              درخواست خرید عمده (رستوران، تالار، ارگان)
            </h3>
            <p className={styles.mediumText}>
              برای سفارش‌های بالای ۱۰۰ کیلوگرم، قیمت ویژه شالیزار و فاکتور رسمی صادر می‌شود.
            </p>
          </div>

          {wholesaleSuccess ? (
            <div className={styles.emptyState}>
              درخواست شما با موفقیت ثبت شد. کارشناسان طلا رایس به زودی با شما تماس خواهند گرفت.
            </div>
          ) : (
            <form onSubmit={handleWholesaleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  نام کسب‌وکار / ارگان:
                </label>
                <input
                  type="text"
                  required
                  value={wholesaleForm.businessName}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      businessName: e.target.value
                    })
                  }
                  placeholder="مثلاً: رستوران سنتی شیراز"
                  className={styles.input}
                />
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    نام رابط:
                  </label>
                  <input
                    type="text"
                    required
                    value={wholesaleForm.contactName}
                    onChange={(e) =>
                      setWholesaleForm({
                        ...wholesaleForm,
                        contactName: e.target.value
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    شماره تماس:
                  </label>
                  <input
                    type="text"
                    required
                    value={wholesaleForm.phone}
                    onChange={(e) =>
                      setWholesaleForm({
                        ...wholesaleForm,
                        phone: e.target.value
                      })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  حجم تخمینی (کیلوگرم):
                </label>
                <select
                  value={wholesaleForm.estimatedKg}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      estimatedKg: e.target.value
                    })
                  }
                  className={styles.input}
                >
                  <option value="100">۱۰۰ کیلوگرم (۱۰ کیسه)</option>
                  <option value="500">۵۰۰ کیلوگرم (۵۰ کیسه)</option>
                  <option value="1000">۱ تن به بالا (سفارش عمده)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  توضیحات اضافی:
                </label>
                <textarea
                  rows={2}
                  value={wholesaleForm.description}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      description: e.target.value
                    })
                  }
                  placeholder="نوع برنج درخواستی، تاریخ تحویل و..."
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryButton}
              >
                ثبت استعلام قیمت عمده
              </button>
            </form>
          )}
        </div>
      )}

      {activeSubTab === 'support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              ارتباط مستقیم با واحد فروش و امور مشتریان:
            </h3>

            <div className={styles.grid2}>
              <a
                href="tel:09170000000"
                className={styles.contactCard}
              >
                <i className="fa-solid fa-phone" style={{ color: '#d4af37' }} />
                <span>تماس تلفنی</span>
              </a>
              <a
                href="https://wa.me/#"
                target="_blank"
                rel="noreferrer"
                className={styles.contactCard}
              >
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', fontSize: '0.875rem' }} />
                <span>واتساپ پشتیبانی</span>
              </a>
            </div>

            <div className={styles.rowBorder} style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderBottom: 'none', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <label className={styles.label} style={{ marginBottom: '0.25rem' }}>
                ارسال پیام یا سوال به پشتیبانی:
              </label>
              <textarea
                rows={2}
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                placeholder="سوال خود درباره پخت، ارسال یا کیفیت برنج را بنویسید..."
                className={styles.input}
                style={{ marginBottom: '0.5rem' }}
              />
              {supportSuccess ? (
                <p className={styles.emptyState} style={{ padding: '0.5rem' }}>
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
                  className={styles.supportButton}
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

