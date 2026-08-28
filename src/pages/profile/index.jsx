import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { AuthPage } from '../auth';
import styles from './style.module.css';

export function ProfilePage() {
  const { orders, addresses, logout, currentUser, isAdmin, getOrderStatusInfo } = useApp();
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

  if (!currentUser) {
    return <AuthPage />;
  }

  function handleWholesaleSubmit(e) {
    e.preventDefault();
    setWholesaleSuccess(true);
    setTimeout(function () {
      setWholesaleSuccess(false);
      setWholesaleForm({
        businessName: '',
        contactName: '',
        phone: '',
        estimatedKg: '100',
        description: ''
      });
    }, 4000);
  }

  const tabs = [
    { id: 'orders', label: 'سفارش‌ها' },
    { id: 'addresses', label: 'آدرس‌ها' },
    { id: 'wholesale', label: 'خرید عمده' },
    { id: 'support', label: 'پشتیبانی' }
  ];

  return (
    <div className={styles.profileWrapper}>
      <header className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {currentUser?.name ? currentUser.name.charAt(0) : 'م'}
            </div>
            <div>
              <h2 className={styles.userName}>{currentUser?.name}</h2>
              <p className={styles.userPhone}>{currentUser?.mobile || currentUser?.phone}</p>
              <span className={styles.userBadge}>
                {currentUser?.role === 'admin' ? 'مدیر ارشد طلا رایس' : 'مشتری طلایی'}
              </span>
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
        {tabs.map(function (t) {
          return (
            <button
              key={t.id}
              onClick={function () { setActiveSubTab(t.id); }}
              className={`${styles.tabBtn} ${activeSubTab === t.id ? styles.tabActive : styles.tabInactive}`}
            >
              {t.label}
            </button>
          );
        })}
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
              orders.map(function (ord) {
                const statusInfo = (typeof getOrderStatusInfo === 'function' ? getOrderStatusInfo(ord.status) : null) || {
                  key: ord.status || 'reviewing',
                  label: ord.status === 'shipping' ? 'در حال ارسال' : ord.status === 'shipped' ? 'ارسال شده' : ord.status === 'delivered' ? 'تحویل شده' : 'درحال بررسی',
                  desc: 'سفارش در حال پردازش و آماده‌سازی در انبار است.',
                  color: '#b45309',
                  bg: '#fffbeb',
                  border: '#fde68a',
                  step: ord.status === 'delivered' ? 4 : ord.status === 'shipped' ? 4 : ord.status === 'shipping' ? 3 : 2
                };

                const currentStep = statusInfo.step || (ord.status === 'delivered' ? 4 : ord.status === 'shipped' ? 4 : ord.status === 'shipping' ? 3 : 2);

                return (
                  <article key={ord.id} className={styles.card}>
                    <div className={`${styles.row} ${styles.rowBorder}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-receipt" style={{ color: '#d4af37' }} />
                        <span className={styles.monoText}>سفارش #{ord.id}</span>
                      </div>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          borderColor: statusInfo.border
                        }}
                      >
                        {statusInfo.key === 'reviewing' && <i className="fa-regular fa-clock" />}
                        {statusInfo.key === 'shipping' && <i className="fa-solid fa-truck-fast" />}
                        {statusInfo.key === 'shipped' && <i className="fa-solid fa-box-open" />}
                        {statusInfo.key === 'delivered' && <i className="fa-solid fa-circle-check" />}
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    {/* Status Description Banner */}
                    <div
                      className={styles.statusDescBox}
                      style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`
                      }}
                    >
                      <i className="fa-solid fa-circle-info" />
                      <span>{statusInfo.desc}</span>
                    </div>

                    {/* Progress Stepper */}
                    <div className={styles.orderStepper}>
                      <div className={styles.stepperLine}>
                        <div
                          className={styles.stepperLineFill}
                          style={{
                            width: currentStep === 4 ? '100%' : currentStep === 3 ? '66%' : '33%'
                          }}
                        />
                      </div>

                      <div className={styles.stepperItem}>
                        <div className={`${styles.stepperDot} ${styles.stepperDotDone}`}>
                          <i className="fa-solid fa-check" />
                        </div>
                        <span className={`${styles.stepperLabel} ${styles.stepperLabelDone}`}>ثبت سفارش</span>
                      </div>

                      <div className={styles.stepperItem}>
                        <div
                          className={`${styles.stepperDot} ${
                            currentStep >= 2 ? (currentStep === 2 ? styles.stepperDotActive : styles.stepperDotDone) : styles.stepperDotPending
                          }`}
                        >
                          {currentStep > 2 ? <i className="fa-solid fa-check" /> : <span>۲</span>}
                        </div>
                        <span
                          className={`${styles.stepperLabel} ${
                            currentStep > 2 ? styles.stepperLabelDone : currentStep === 2 ? styles.stepperLabelActive : ''
                          }`}
                        >
                          درحال بررسی
                        </span>
                      </div>

                      <div className={styles.stepperItem}>
                        <div
                          className={`${styles.stepperDot} ${
                            currentStep >= 3 ? (currentStep === 3 ? styles.stepperDotActive : styles.stepperDotDone) : styles.stepperDotPending
                          }`}
                        >
                          {currentStep > 3 ? <i className="fa-solid fa-check" /> : <span>۳</span>}
                        </div>
                        <span
                          className={`${styles.stepperLabel} ${
                            currentStep > 3 ? styles.stepperLabelDone : currentStep === 3 ? styles.stepperLabelActive : ''
                          }`}
                        >
                          در حال ارسال
                        </span>
                      </div>

                      <div className={styles.stepperItem}>
                        <div
                          className={`${styles.stepperDot} ${
                            currentStep >= 4 ? styles.stepperDotDone : styles.stepperDotPending
                          }`}
                        >
                          {currentStep >= 4 ? <i className="fa-solid fa-check" /> : <span>۴</span>}
                        </div>
                        <span
                          className={`${styles.stepperLabel} ${
                            currentStep >= 4 ? styles.stepperLabelDone : ''
                          }`}
                        >
                          {ord.status === 'delivered' ? 'تحویل شده' : 'ارسال شده'}
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.row} ${styles.mediumText}`}>
                      <span>تاریخ ثبت: {ord.date}</span>
                      <span>کد رهگیری: <strong className={styles.monoText}>{ord.trackingCode}</strong></span>
                    </div>

                    {/* Order Items preview */}
                    {ord.items && ord.items.length > 0 && (
                      <div className={styles.orderItemsList}>
                        {ord.items.map(function (item, idx) {
                          const pName = item.product?.name || item.name || 'برنج کامفیروز ممتاز';
                          const weight = item.weightKg || item.product?.weightKg || 10;
                          const qty = item.quantity || 1;
                          return (
                            <div key={idx} className={styles.orderItemRow}>
                              <span>🌾 {pName} ({weight.toLocaleString('fa-IR')} کیلوگرم)</span>
                              <strong>{qty.toLocaleString('fa-IR')} عدد</strong>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {ord.fullAddress && (
                      <div style={{ fontSize: '0.75rem', color: '#4b5563', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: '#d4af37' }} />
                        <span>تحویل به: {ord.recipientName || 'خریدار'} - {ord.fullAddress}</span>
                      </div>
                    )}

                    <div className={styles.totalRow}>
                      <span>مبلغ کل پرداختی:</span>
                      <strong className={styles.totalValue}>
                        {((ord.finalAmount ?? ord.totalAmount) ?? 0).toLocaleString('fa-IR')} تومان
                      </strong>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}

        {activeSubTab === 'addresses' && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس‌های ثبت شده:</h3>
            {addresses?.map(function (addr) {
              return (
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
              );
            })}
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
                    onChange={function (e) { setWholesaleForm({ ...wholesaleForm, businessName: e.target.value }); }}
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
                      onChange={function (e) { setWholesaleForm({ ...wholesaleForm, contactName: e.target.value }); }}
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
                      onChange={function (e) { setWholesaleForm({ ...wholesaleForm, phone: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>حجم تخمینی (کیلوگرم):</label>
                  <select
                    value={wholesaleForm.estimatedKg}
                    onChange={function (e) { setWholesaleForm({ ...wholesaleForm, estimatedKg: e.target.value }); }}
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
                    onChange={function (e) { setWholesaleForm({ ...wholesaleForm, description: e.target.value }); }}
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
                onChange={function (e) { setSupportText(e.target.value); }}
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
                  onClick={function () {
                    if (supportText.trim()) {
                      setSupportSuccess(true);
                      setSupportText('');
                      setTimeout(function () { setSupportSuccess(false); }, 3000);
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
}

export default ProfilePage;
