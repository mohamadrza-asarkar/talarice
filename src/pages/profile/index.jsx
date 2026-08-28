import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProfilePage = () => {
  const { orders, addresses, logout, currentUser, isAdmin, goBack } = useApp();
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

  const tabs = [
    { id: 'orders', label: 'سفارش‌ها' },
    { id: 'addresses', label: 'آدرس‌ها' },
    { id: 'wholesale', label: 'خرید عمده' },
    { id: 'support', label: 'پشتیبانی' }
  ];

  return (
    <div className={styles.profileWrapper}>
      <header className={styles.headerCard}>
        <div className={styles.headerTopBar}>
          <button
            type="button"
            onClick={() => goBack('/')}
            className={styles.backBtn}
            aria-label="بازگشت به فروشگاه"
          >
            <i className="fa-solid fa-arrow-right" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>

        <div className={styles.headerTop}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {currentUser?.name ? currentUser.name.charAt(0) : 'م'}
            </div>
            <div>
              <h2 className={styles.userName}>{currentUser?.name ?? 'محمد رضایی'}</h2>
              <p className={styles.userPhone}>{currentUser?.phone ?? '۰۹۱۷ ۱۲۳ ۴۵۶۷'}</p>
              <span className={styles.userBadge}>مشتری طلایی</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {isAdmin && (
              <Link to="/admin" className={styles.adminBtn}>
                <i className="fa-solid fa-crown" />
                <span>پنل مدیریت</span>
              </Link>
            )}
            <button onClick={logout} className={styles.logoutBtn}>
              <i className="fa-solid fa-arrow-right-from-bracket" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.tabsContainer}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`${styles.tabBtn} ${activeSubTab === t.id ? styles.tabActive : styles.tabInactive}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.tabContent}>
        {activeSubTab === 'orders' && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>تاریخچه سفارش‌های شما:</h3>
            {!orders?.length ? (
              <div className={styles.emptyState}>
                <i className={`fa-solid fa-file-invoice ${styles.emptyIcon}`} />
                <p>هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <article key={ord.id} className={styles.card}>
                  <div className={`${styles.row} ${styles.rowBorder}`}>
                    <span className={styles.monoText}>{ord.id}</span>
                    <span className={styles.badgeStatus}>در حال پردازش و بسته‌بندی</span>
                  </div>

                  <div className={`${styles.row} ${styles.mediumText}`}>
                    <span>تاریخ ثبت: {ord.date}</span>
                    <span>کد پیگیری: <strong className={styles.monoText}>{ord.trackingCode}</strong></span>
                  </div>

                  <div className={styles.boldText}>
                    تعداد اقلام: {(ord.items?.length ?? 0).toLocaleString('fa-IR')} کیسه برنج
                  </div>

                  <div className={styles.totalRow}>
                    <span>مبلغ کل:</span>
                    <strong className={styles.totalValue}>
                      {((ord.finalAmount ?? ord.totalAmount) ?? 0).toLocaleString('fa-IR')} تومان
                    </strong>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeSubTab === 'addresses' && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس‌های ثبت شده:</h3>
            {addresses?.map((addr) => (
              <article key={addr.id} className={styles.card}>
                <div className={styles.row}>
                  <strong className={styles.boldText}>{addr.title}</strong>
                  {addr.isDefault && <span className={styles.badgeDefault}>پیش‌فرض</span>}
                </div>
                <p className={styles.addressDesc}>{addr.fullAddress}</p>
                <small className={styles.addressContact}>
                  گیرنده: {addr.recipientName} ({addr.phone})
                </small>
              </article>
            ))}
          </section>
        )}

        {activeSubTab === 'wholesale' && (
          <section className={styles.card}>
            <div>
              <h3 className={styles.sectionTitle}>درخواست خرید عمده (رستوران، تالار، ارگان)</h3>
              <p className={styles.mediumText}>
                برای سفارش‌های بالای ۱۰۰ کیلوگرم، قیمت ویژه شالیزار و فاکتور رسمی صادر می‌شود.
              </p>
            </div>

            {wholesaleSuccess ? (
              <div className={styles.successState}>
                درخواست شما با موفقیت ثبت شد. کارشناسان طلا رایس به زودی با شما تماس خواهند گرفت.
              </div>
            ) : (
              <form onSubmit={handleWholesaleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>نام کسب‌وکار / ارگان:</label>
                  <input
                    type="text"
                    required
                    value={wholesaleForm.businessName}
                    onChange={(e) => setWholesaleForm({ ...wholesaleForm, businessName: e.target.value })}
                    placeholder="مثلاً: رستوران سنتی شیراز"
                    className={styles.input}
                  />
                </div>

                <div className={styles.grid2}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>نام رابط:</label>
                    <input
                      type="text"
                      required
                      value={wholesaleForm.contactName}
                      onChange={(e) => setWholesaleForm({ ...wholesaleForm, contactName: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>شماره تماس:</label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={wholesaleForm.phone}
                      onChange={(e) => setWholesaleForm({ ...wholesaleForm, phone: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>حجم تخمینی (کیلوگرم):</label>
                  <select
                    value={wholesaleForm.estimatedKg}
                    onChange={(e) => setWholesaleForm({ ...wholesaleForm, estimatedKg: e.target.value })}
                    className={styles.input}
                  >
                    <option value="100">۱۰۰ کیلوگرم (۱۰ کیسه)</option>
                    <option value="500">۵۰۰ کیلوگرم (۵۰ کیسه)</option>
                    <option value="1000">۱ تن به بالا (سفارش عمده)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>توضیحات اضافی:</label>
                  <textarea
                    rows={2}
                    value={wholesaleForm.description}
                    onChange={(e) => setWholesaleForm({ ...wholesaleForm, description: e.target.value })}
                    placeholder="نوع برنج درخواستی، تاریخ تحویل و..."
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.primaryButton}>
                  ثبت استعلام قیمت عمده
                </button>
              </form>
            )}
          </section>
        )}

        {activeSubTab === 'support' && (
          <section className={styles.card}>
            <h3 className={styles.sectionTitle}>ارتباط مستقیم با واحد فروش و امور مشتریان:</h3>

            <div className={styles.grid2}>
              <a href="tel:09170000000" className={styles.contactCard}>
                <i className="fa-solid fa-phone" />
                <span>تماس تلفنی</span>
              </a>
              <a href="https://wa.me/#" target="_blank" rel="noreferrer" className={styles.contactCard}>
                <i className="fa-brands fa-whatsapp" />
                <span>واتساپ پشتیبانی</span>
              </a>
            </div>

            <div className={styles.supportBox}>
              <label className={styles.label}>ارسال پیام یا سوال به پشتیبانی:</label>
              <textarea
                rows={2}
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                placeholder="سوال خود درباره پخت، ارسال یا کیفیت برنج را بنویسید..."
                className={styles.input}
              />
              {supportSuccess ? (
                <div className={styles.successState}>
                  پیام شما دریافت شد. همکاران ما به زودی پاسخ خواهند داد.
                </div>
              ) : (
                <button
                  type="button"
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
          </section>
        )}
      </main>
    </div>
  );
};
