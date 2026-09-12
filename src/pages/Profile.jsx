import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  ShieldCheck,
  ChevronLeft,
  Search,
  ExternalLink,
  Phone,
  Send,
  LogOut,
  Headphones,
  Lock,
  KeyRound
} from 'lucide-react';
import styles from './pages.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const {
    currentUser,
    orders,
    getOrderStatusInfo,
    logout,
    updateProfile,
    changePassword,
    trackOrder,
    showSuccess,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'info', 'support', 'security'
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Postal tracking query
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedOrderResult, setTrackedOrderResult] = useState(null);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);

  // Status mapping
  const getStatusIcon = (statusStr) => {
    switch (statusStr) {
      case 'در حال پردازش':
      case 'processing':
      case 'pending':
        return <Clock size={16} className="text-amber-400" />;
      case 'ارسال شده':
      case 'shipped':
        return <Truck size={16} className="text-blue-400" />;
      case 'تحویل شده':
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      default:
        return <AlertCircle size={16} className="text-stone-400" />;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(name, phone);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('رمز عبور جدید و تکرار آن یکسان نیستند.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.', 'error');
      return;
    }
    const res = await changePassword(oldPassword, newPassword);
    if (res?.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (res?.message) {
      showToast(res.message, 'error');
    }
  };

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    setIsSearchingTracking(true);
    setTrackedOrderResult(null);

    const result = await trackOrder(trackingQuery.trim());
    setIsSearchingTracking(false);

    if (result) {
      setTrackedOrderResult(result);
    } else {
      showToast('سفارشی با این کد رهگیری پستی یافت نشد.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className={styles.pageContainer}>
      {/* کارت سربرگ مشخصات کاربر */}
      <header className={styles.profileHeaderCard}>
        <div className={styles.profileAvatarBox}>
          <User size={36} />
        </div>

        <div className={styles.profileMetaInfo}>
          <div className={styles.profileNameRow}>
            <h1 className={styles.profileUserName}>{currentUser?.name || 'کاربر گرامی'}</h1>
            {currentUser?.isAdmin && (
              <span className={styles.adminBadge}>
                <ShieldCheck size={12} />
                مدیر فروشگاه
              </span>
            )}
          </div>
          <span className={styles.profileUserPhone} dir="ltr">
            {currentUser?.phone || 'شماره ثبت‌نشده'}
          </span>
        </div>

        {currentUser?.isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className={styles.btnAdminAccess}
          >
            <span>ورود به پنل مدیریت</span>
            <ChevronLeft size={16} />
          </button>
        )}
      </header>

      {/* ناوبری تب‌های پروفایل */}
      <nav className={styles.tabsNavList}>
        <button
          type="button"
          className={`${styles.tabNavItem} ${activeTab === 'orders' ? styles.tabNavItemActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={17} />
          <span>سفارش‌های من</span>
          {orders.length > 0 && (
            <span className={styles.tabBadgeCounter}>{orders.length.toLocaleString('fa-IR')}</span>
          )}
        </button>

        <button
          type="button"
          className={`${styles.tabNavItem} ${activeTab === 'info' ? styles.tabNavItemActive : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <User size={17} />
          <span>اطلاعات فردی</span>
        </button>

        <button
          type="button"
          className={`${styles.tabNavItem} ${activeTab === 'security' ? styles.tabNavItemActive : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={17} />
          <span>امنیت و رمز عبور</span>
        </button>

        <button
          type="button"
          className={`${styles.tabNavItem} ${activeTab === 'support' ? styles.tabNavItemActive : ''}`}
          onClick={() => setActiveTab('support')}
        >
          <Headphones size={17} />
          <span>پشتیبانی شالیزار</span>
        </button>
      </nav>

      {/* تب ۱: سفارش‌های کاربر + رهگیری مرسوله پستی */}
      {activeTab === 'orders' && (
        <section className={styles.card}>
          {/* فرم استعلام کد مرسوله پستی */}
          <div className={styles.trackingSearchBox} style={{ marginBottom: '1.25rem', padding: '1rem', background: '#fcfbf8', borderRadius: '12px', border: '1px solid #eee5d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Truck size={18} className="text-yellow-500" />
              <strong style={{ fontSize: '0.95rem' }}>رهگیری برخط مرسوله پستی</strong>
            </div>
            <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className={styles.input}
                placeholder="کد پیگیری پستی یا شماره سفارش..."
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={isSearchingTracking}
                style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
              >
                {isSearchingTracking ? 'در حال استعلام...' : 'رهگیری'}
              </button>
            </form>

            {/* نتیجه رهگیری */}
            {trackedOrderResult && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #dfd7be' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>سفارش {trackedOrderResult.trackingCode || trackedOrderResult.postTrackingCode}</strong>
                  <span className={styles.badge}>{trackedOrderResult.status || trackedOrderResult.state}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>
                  گیرنده: {trackedOrderResult.customerName || trackedOrderResult.name} | مبلغ: {(trackedOrderResult.finalAmount || trackedOrderResult.totalPrice || 0).toLocaleString('fa-IR')} تومان
                </p>
                {trackedOrderResult.postTrackingCode && (
                  <p style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '0.3rem', direction: 'ltr', textAlign: 'left' }}>
                    Post Barcode: <strong>{trackedOrderResult.postTrackingCode}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={styles.formCardHeader}>
            <Package size={18} className="text-yellow-400" />
            <h2 className={styles.pageTitle}>تاریخچه سفارشات ثبت‌شده</h2>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyOrdersState}>
              <Package size={44} className={styles.emptyIcon} />
              <strong className={styles.emptyTitle}>هنوز هیچ سفارشی ثبت نشده است</strong>
              <p className={styles.emptySubtitle}>
                می‌توانید همین حالا انواع برنج ممتاز کامفیروز را بررسی و مستقیماً از شالیزار سفارش دهید.
              </p>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className={styles.btnPrimary}
              >
                مشاهده و خرید برنج
              </button>
            </div>
          ) : (
            <div className={styles.ordersListContainer}>
              {orders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.status || order.state);
                return (
                  <article key={order._id || order.id} className={styles.orderCardItem}>
                    <header className={styles.orderHeaderRow}>
                      <div className={styles.orderMainDetails}>
                        <div className={styles.orderTrackingCodeRow}>
                          <span className={styles.codeLabel}>کد پیگیری:</span>
                          <strong className={styles.orderCodeValue} dir="ltr">
                            {order.postTrackingCode || order.trackingCode}
                          </strong>
                        </div>
                        <time className={styles.orderDateText}>{order.date || 'به‌تازگی'}</time>
                      </div>

                      <div className={styles.orderStatusPill}>
                        {getStatusIcon(order.status || order.state)}
                        <span>{statusInfo.label}</span>
                      </div>
                    </header>

                    <div className={styles.orderProductsSummary}>
                      {(order.items || order.products || []).map((item, index) => (
                        <div key={index} className={styles.orderProductRow}>
                          <span className={styles.productNameText}>{item.name}</span>
                          <span className={styles.productQtyBadge}>
                            {(item.quantity || 1).toLocaleString('fa-IR')} کیسه
                          </span>
                        </div>
                      ))}
                    </div>

                    <footer className={styles.orderFooterSummary}>
                      <div className={styles.orderTotalAmount}>
                        <span className={styles.totalLabel}>مبلغ کل سفارش:</span>
                        <strong className={styles.amountValue}>
                          {(order.finalAmount || order.totalPrice || 0).toLocaleString('fa-IR')}
                        </strong>
                        <span className={styles.currency}>تومان</span>
                      </div>

                      {order.postTrackingCode && (
                        <span className={styles.postCodeNotice}>
                          کد مرسوله پستی: <strong dir="ltr">{order.postTrackingCode}</strong>
                        </span>
                      )}
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* تب ۲: فرم مشخصات و نشانی */}
      {activeTab === 'info' && (
        <section className={styles.card}>
          <div className={styles.formCardHeader}>
            <User size={18} className="text-yellow-400" />
            <h2 className={styles.pageTitle}>ویرایش مشخصات فردی و نشانی تحویل</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام و نام خانوادگی:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="مثال: علی رضایی"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>شماره تلفن همراه:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                style={{ textAlign: 'left', direction: 'ltr' }}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>نشانی دقیق پستی:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد و کد پستی"
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              <span>ذخیره تغییرات مشخصات</span>
            </button>
          </form>
        </section>
      )}

      {/* تب ۳: امنیت و تغییر رمز عبور */}
      {activeTab === 'security' && (
        <section className={styles.card}>
          <div className={styles.formCardHeader}>
            <KeyRound size={18} className="text-yellow-400" />
            <h2 className={styles.pageTitle}>تغییر کلمه عبور</h2>
          </div>

          <form onSubmit={handleChangePassword} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>رمز عبور فعلی:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>رمز عبور جدید (حداقل ۶ نویسه):</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>تکرار رمز عبور جدید:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              <span>تغییر و ذخیره رمز عبور</span>
            </button>
          </form>
        </section>
      )}

      {/* تب ۴: پشتیبانی */}
      {activeTab === 'support' && (
        <section className={styles.card}>
          <div className={styles.formCardHeader}>
            <Headphones size={18} className="text-yellow-400" />
            <h2 className={styles.pageTitle}>پشتیبانی و مشاوره خرید برنج</h2>
          </div>

          <p className={styles.descText}>
            تیم شالیزار طلا رایس آماده پاسخگویی به سوالات شما در خصوص روش پخت، ارسال عمده و تضمین کیفیت ارقام برنج است.
          </p>

          <div className={styles.supportChannelsList}>
            <a href="tel:09170000000" className={styles.supportChannelItem}>
              <div className={styles.channelIconBox}>
                <Phone size={18} />
              </div>
              <div className={styles.channelDetails}>
                <strong>تماس تلفنی با واحد فروش</strong>
                <small>شنبه تا پنج‌شنبه از ساعت ۸ صبح الی ۲۰ شب</small>
              </div>
              <ChevronLeft size={16} className="text-yellow-400" />
            </a>

            <a
              href="https://wa.me/989170000000"
              target="_blank"
              rel="noreferrer"
              className={styles.supportChannelItem}
            >
              <div className={styles.channelIconBox} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                <Send size={18} />
              </div>
              <div className={styles.channelDetails}>
                <strong>پشتیبانی آنلاین در واتساپ</strong>
                <small>پاسخگویی سریع و پیگیری سفارشات ارسالی</small>
              </div>
              <ChevronLeft size={16} className="text-yellow-400" />
            </a>
          </div>
        </section>
      )}

      {/* دکمه خروج */}
      <footer className={styles.profileFooterLogout}>
        <button type="button" onClick={handleLogout} className={styles.btnLogout}>
          <LogOut size={16} />
          <span>خروج از حساب کاربری</span>
        </button>
      </footer>
    </main>
  );
}

export { Profile };
