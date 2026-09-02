import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  Building,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  Copy,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context';
import styles from './style.module.css';

export function ProfilePage() {
  const {
    orders,
    addresses,
    logout,
    currentUser,
    isAdmin,
    getOrderStatusInfo,
    trackOrder,
    uploadOrderReceipt,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('orders');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const [wholesaleForm, setWholesaleForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    estimatedKg: '100',
    description: ''
  });
  const [wholesaleSuccess, setWholesaleSuccess] = useState(false);

  // Receipt upload handling
  const fileInputRef = useRef(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  async function handleTrackSubmit(e) {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setIsSearchingTrack(true);
    setTrackError('');
    setTrackingResult(null);

    try {
      const res = await trackOrder(trackingInput.trim());
      if (res && res.data) {
        setTrackingResult(res.data);
      } else {
        setTrackError('سفارشی با این کد رهگیری یافت نشد.');
      }
    } catch (err) {
      setTrackError(err?.message || 'سفارشی با این کد رهگیری پستی یافت نشد.');
    } finally {
      setIsSearchingTrack(false);
    }
  }

  function handleCopy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      setCopiedCode(text);
      setTimeout(function () { setCopiedCode(''); }, 2000);
    });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !selectedOrderId) return;

    const reader = new FileReader();
    reader.onload = async function (uploadEvent) {
      const base64 = uploadEvent.target?.result;
      if (base64) {
        try {
          await uploadOrderReceipt(selectedOrderId, base64);
          setSelectedOrderId(null);
        } catch (err) {
          console.error(err);
        }
      }
    };
    reader.readAsDataURL(file);
  }

  const tabs = [
    { id: 'orders', label: 'سفارش‌ها', icon: Package },
    { id: 'tracking', label: 'رهگیری مرسوله', icon: Search },
    { id: 'addresses', label: 'آدرس‌ها', icon: MapPin },
    { id: 'wholesale', label: 'خرید عمده', icon: Building }
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
              <h2 className={styles.userName}>{currentUser?.name || 'مشتری طلا رایس'}</h2>
              <p className={styles.userPhone} dir="ltr">{currentUser?.phone || currentUser?.mobile}</p>
              <span className={styles.userBadge}>
                {currentUser?.role === 'admin' ? 'مدیر ارشد طلا رایس' : 'مشتری طلایی شالیزار'}
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
          const IconComp = t.icon;
          return (
            <button
              key={t.id}
              onClick={function () { setActiveSubTab(t.id); }}
              className={`${styles.tabBtn} ${activeSubTab === t.id ? styles.tabActive : styles.tabInactive}`}
            >
              {IconComp && <IconComp size={15} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} />}
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Hidden file input for receipt uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <main className={styles.tabContent}>
        {/* Tab 1: Orders */}
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
                const orderId = ord.id || ord._id;
                const state = ord.state || ord.status || 'pending';
                const statusInfo = (typeof getOrderStatusInfo === 'function' ? getOrderStatusInfo(state) : null) || {
                  key: state,
                  label: state === 'shipped' ? 'ارسال شده' : state === 'delivered' ? 'تحویل شده' : state === 'processing' ? 'در حال بسته‌بندی' : 'در انتظار بررسی',
                  desc: ord.adminNote || 'سفارش در حال پردازش و آماده‌سازی در انبار طلا رایس است.',
                  color: state === 'shipped' ? '#166534' : '#b45309',
                  bg: state === 'shipped' ? '#f0fdf4' : '#fffbeb',
                  border: state === 'shipped' ? '#86efac' : '#fde68a',
                  step: state === 'delivered' ? 4 : state === 'shipped' ? 3 : state === 'processing' ? 2 : 1
                };

                const currentStep = statusInfo.step || 1;

                return (
                  <article key={orderId} className={styles.card}>
                    <div className={`${styles.row} ${styles.rowBorder}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-receipt" style={{ color: '#d4af37' }} />
                        <span className={styles.monoText}>سفارش #{orderId}</span>
                      </div>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          borderColor: statusInfo.border
                        }}
                      >
                        {state === 'pending' && <Clock size={13} style={{ display: 'inline', marginLeft: '3px' }} />}
                        {state === 'processing' && <Package size={13} style={{ display: 'inline', marginLeft: '3px' }} />}
                        {state === 'shipped' && <Truck size={13} style={{ display: 'inline', marginLeft: '3px' }} />}
                        {state === 'delivered' && <CheckCircle2 size={13} style={{ display: 'inline', marginLeft: '3px' }} />}
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
                      <span>{ord.adminNote || statusInfo.desc}</span>
                    </div>

                    {/* Progress Stepper */}
                    <div className={styles.orderStepper}>
                      <div className={styles.stepperLine}>
                        <div
                          className={styles.stepperLineFill}
                          style={{
                            width: currentStep === 4 ? '100%' : currentStep === 3 ? '66%' : currentStep === 2 ? '33%' : '0%'
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
                          پردازش و بسته‌بندی
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
                          تحویل به اداره پست
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
                          تحویل به مشتری
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.row} ${styles.mediumText}`}>
                      <span>تاریخ ثبت: {ord.date || ord.createdAt?.split('T')[0]}</span>
                      {ord.postTrackingCode ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>کد رهگیری پستی:</span>
                          <strong className={styles.monoText} dir="ltr">{ord.postTrackingCode}</strong>
                          <button
                            type="button"
                            onClick={function () { handleCopy(ord.postTrackingCode); }}
                            className={styles.copyInlineBtn}
                            title="کپی کد رهگیری"
                          >
                            {copiedCode === ord.postTrackingCode ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                        </div>
                      ) : (
                        <span>کد پیگیری سیستمی: <strong className={styles.monoText}>{ord.trackingCode || orderId}</strong></span>
                      )}
                    </div>

                    {/* Order Items preview */}
                    {(ord.products || ord.items) && (ord.products || ord.items).length > 0 && (
                      <div className={styles.orderItemsList}>
                        {(ord.products || ord.items).map(function (item, idx) {
                          const pName = item.product?.name || item.name || item.title || 'برنج کامفیروز ممتاز';
                          const qty = item.quantity || 1;
                          const price = Number(item.price || item.product?.price || 0);
                          return (
                            <div key={idx} className={styles.orderItemRow}>
                              <span>🌾 {pName}</span>
                              <span>{qty.toLocaleString('fa-IR')} عدد ({price.toLocaleString('fa-IR')} تومان)</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Receipt Status or Upload Button */}
                    <div className={styles.receiptStatusBar}>
                      {ord.paymentReceipt ? (
                        <div className={styles.receiptPresentBadge}>
                          <CheckCircle2 size={14} color="#16a34a" />
                          <span>رسید واریزی ضمیمه شده است</span>
                        </div>
                      ) : ord.paymentMethod === 'card' ? (
                        <button
                          type="button"
                          onClick={function () {
                            setSelectedOrderId(orderId);
                            fileInputRef.current?.click();
                          }}
                          className={styles.uploadReceiptSmallBtn}
                        >
                          <Upload size={13} />
                          <span>ارسال / تغییر تصویر فیش بانکی</span>
                        </button>
                      ) : null}
                    </div>

                    {ord.address && (
                      <div style={{ fontSize: '0.75rem', color: '#4b5563', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: '#d4af37' }} />
                        <span>تحویل به: {ord.name || 'خریدار'} - {ord.address}</span>
                      </div>
                    )}

                    <div className={styles.totalRow}>
                      <span>مبلغ کل پرداختی:</span>
                      <strong className={styles.totalValue}>
                        {((ord.totalPrice ?? ord.finalAmount) ?? 0).toLocaleString('fa-IR')} تومان
                      </strong>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}

        {/* Tab 2: Postal Tracking */}
        {activeSubTab === 'tracking' && (
          <section className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <Search size={18} style={{ color: '#d4af37' }} />
              <span>رهگیری آنلاین مرسوله پستی</span>
            </h3>
            <p className={styles.mediumText}>
              با وارد کردن کد رهگیری مرسوله پستی ۲۴ رقمی یا شناسه سفارش خود، وضعیت ارسال برنج را لحظه‌ای بررسی نمایید.
            </p>

            <form onSubmit={handleTrackSubmit} className={styles.trackingSearchForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  dir="ltr"
                  value={trackingInput}
                  onChange={function (e) { setTrackingInput(e.target.value); }}
                  placeholder="کد ۲۴ رقمی رهگیری پستی یا شناسه سفارش..."
                  className={styles.input}
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingTrack || !trackingInput.trim()}
                className={styles.primaryButton}
              >
                {isSearchingTrack ? 'در حال جستجو...' : 'استعلام وضعیت مرسوله'}
              </button>
            </form>

            {trackError && (
              <div className={styles.trackErrorBox}>
                <AlertCircle size={16} />
                <span>{trackError}</span>
              </div>
            )}

            {trackingResult && (
              <div className={styles.trackResultBox}>
                <div className={styles.trackResultHeader}>
                  <ShieldCheck size={20} color="#16a34a" />
                  <strong>اطلاعات مرسوله یافت شد</strong>
                </div>
                <div className={styles.trackResultRow}>
                  <span>شناسه سفارش:</span>
                  <strong dir="ltr">{trackingResult.id || trackingResult._id}</strong>
                </div>
                {trackingResult.postTrackingCode && (
                  <div className={styles.trackResultRow}>
                    <span>کد رهگیری پستی:</span>
                    <strong dir="ltr" style={{ color: '#073822' }}>{trackingResult.postTrackingCode}</strong>
                  </div>
                )}
                <div className={styles.trackResultRow}>
                  <span>وضعیت سفارش:</span>
                  <span className={styles.statusBadge} style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                    {trackingResult.state === 'shipped' ? 'تحویل به پست' : trackingResult.state === 'delivered' ? 'تحویل شده' : 'در حال بسته‌بندی'}
                  </span>
                </div>
                <div className={styles.trackResultRow}>
                  <span>تحویل‌گیرنده:</span>
                  <span>{trackingResult.name}</span>
                </div>
                <div className={styles.trackResultRow}>
                  <span>نشانی مقصد:</span>
                  <span>{trackingResult.address}</span>
                </div>
                {trackingResult.adminNote && (
                  <div className={styles.adminNoteBanner}>
                    <span>پیام واحد ارسال: </span>
                    <em>{trackingResult.adminNote}</em>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Addresses */}
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

        {/* Tab 4: Wholesale */}
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
      </main>
    </div>
  );
}

export default ProfilePage;
