import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context';
import { ordersApi } from '../api';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  Crown,
  Search,
  Copy,
  LogOut,
  Headphones,
  Lock,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import styles from './profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAdmin,
    orders: contextOrders,
    logout,
    updateProfile,
    changePassword,
    showToast,
    cartCount
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'tracking' | 'info' | 'security' | 'support'
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Postal Tracking state
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setPostalCode(currentUser.postalCode || '');
    }
  }, [currentUser]);

  // Fetch real user orders from API
  useEffect(() => {
    let isMounted = true;
    setIsLoadingOrders(true);
    ordersApi.getMyOrders()
      .then((data) => {
        if (isMounted) {
          setUserOrders(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.debug('Orders sync notice:', err.message);
        if (isMounted && Array.isArray(contextOrders)) {
          setUserOrders(contextOrders);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingOrders(false);
      });

    return () => {
      isMounted = false;
    };
  }, [contextOrders]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateProfile({ name, phone, address, postalCode });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      showToast('لطفاً رمز عبور فعلی را وارد کنید.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('رمز عبور جدید و تکرار آن یکسان نیستند.', 'warning');
      return;
    }
    if (newPassword.length < 4) {
      showToast('رمز عبور جدید باید حداقل ۴ کاراکتر باشد.', 'warning');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res?.success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else if (res?.message) {
        showToast(res.message, 'error');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTrackingSearch = async (e) => {
    e.preventDefault();
    const query = trackingQuery.trim();
    if (!query) {
      setTrackingError('لطفاً شماره سفارش یا کد رهگیری پستی را وارد نمایید.');
      return;
    }

    setIsSearchingTracking(true);
    setTrackingError('');
    setTrackedOrder(null);

    try {
      const res = await ordersApi.track(query);
      setTrackedOrder(res);
    } catch (err) {
      // Check in local list as fallback
      const found = userOrders.find(
        (o) => String(o.id) === query || String(o.trackingCode) === query || String(o.postalTrackingCode) === query
      );
      if (found) {
        setTrackedOrder(found);
      } else {
        setTrackingError('سفارشی با این شماره یا کد رهگیری در سامانه ثبت نشده است.');
      }
    } finally {
      setIsSearchingTracking(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    showToast('کد رهگیری پستی در کلیپ‌بورد کپی شد.', 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'تحویل شده':
        return (
          <span className={`${styles.orderStatusBadge} ${styles.statusCompleted}`}>
            <CheckCircle2 size={14} />
            تحویل شده
          </span>
        );
      case 'shipped':
      case 'ارسال شده':
        return (
          <span className={`${styles.orderStatusBadge} ${styles.statusShipped}`}>
            <Truck size={14} />
            ارسال شده (پست پیشتاز)
          </span>
        );
      default:
        return (
          <span className={`${styles.orderStatusBadge} ${styles.statusPending}`}>
            <Clock size={14} />
            در حال پردازش در شالیزار
          </span>
        );
    }
  };

  const activeOrdersCount = userOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'تحویل شده' && o.status !== 'cancelled'
  ).length;

  const deliveredOrdersCount = userOrders.filter(
    (o) => o.status === 'completed' || o.status === 'تحویل شده'
  ).length;

  return (
    <main className={styles.profileContainer}>
      {/* 1. کارت هدر و اطلاعات اصلی کاربر */}
      <section className={styles.userHeroCard}>
        <div className={styles.heroMainRow}>
          <div className={styles.userInfoGroup}>
            <div className={styles.avatarCircle}>
              {currentUser?.name ? currentUser.name.charAt(0) : <User size={28} />}
            </div>

            <div className={styles.userMeta}>
              <div className={styles.userNameRow}>
                <h1 className={styles.userName}>{currentUser?.name || 'کاربر گرامی'}</h1>
                {isAdmin ? (
                  <span className={styles.roleBadgeAdmin}>
                    <Crown size={12} />
                    مدیر فروشگاه
                  </span>
                ) : (
                  <span className={styles.roleBadgeCustomer}>
                    <ShieldCheck size={12} />
                    مشتری وفادار طلا رایس
                  </span>
                )}
              </div>
              <span className={styles.userPhone}>
                <Phone size={13} />
                {currentUser?.phone || 'بدون شماره تلفن'}
              </span>
            </div>
          </div>

          <div className={styles.heroActions}>
            {isAdmin && (
              <Link to="/admin" className={styles.adminPanelBtn} title="ورود به داشبورد مدیریتی">
                <Crown size={16} />
                <span>پنل مدیریت فروشگاه</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              className={styles.logoutBtn}
              title="خروج از حساب"
            >
              <LogOut size={15} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. آمارهای سریع پنل */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.statIconGreen}`}>
            <Package size={22} />
          </div>
          <div className={styles.statTextGroup}>
            <span className={styles.statValue}>{userOrders.length.toLocaleString('fa-IR')}</span>
            <span className={styles.statLabel}>کل سفارش‌ها</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.statIconAmber}`}>
            <Clock size={22} />
          </div>
          <div className={styles.statTextGroup}>
            <span className={styles.statValue}>{activeOrdersCount.toLocaleString('fa-IR')}</span>
            <span className={styles.statLabel}>سفارش‌های فعال</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.statIconBlue}`}>
            <Truck size={22} />
          </div>
          <div className={styles.statTextGroup}>
            <span className={styles.statValue}>{deliveredOrdersCount.toLocaleString('fa-IR')}</span>
            <span className={styles.statLabel}>تحویل موفق</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.statIconGold}`}>
            <ShoppingBag size={22} />
          </div>
          <div className={styles.statTextGroup}>
            <span className={styles.statValue}>{cartCount.toLocaleString('fa-IR')}</span>
            <span className={styles.statLabel}>اقلام در سبد</span>
          </div>
        </div>
      </section>

      {/* 3. تب‌های ناوبری پنل کاربری */}
      <nav className={styles.tabsNav} aria-label="منوی پنل کاربری">
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'orders' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={17} />
          <span>سفارش‌های من</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'tracking' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <Search size={17} />
          <span>رهگیری مرسوله</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'info' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <User size={17} />
          <span>مشخصات و آدرس</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'security' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={17} />
          <span>امنیت و رمز عبور</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'support' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('support')}
        >
          <Headphones size={17} />
          <span>پشتیبانی</span>
        </button>
      </nav>

      {/* 4. محتوای تب فعال */}
      <section className={styles.contentCard}>
        {/* تب ۱: سفارش‌های من */}
        {activeTab === 'orders' && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                تاریخچه و وضعیت سفارش‌ها
              </h2>
              <span className={styles.sectionBadge}>
                {userOrders.length.toLocaleString('fa-IR')} سفارش ثبت شده
              </span>
            </div>

            {isLoadingOrders ? (
              <div className={styles.emptyState}>
                <Clock size={32} className="animate-spin text-emerald-700" />
                <p>در حال دریافت اطلاعات سفارش‌ها از سرور...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <ShoppingBag size={28} />
                </div>
                <p>شما هنوز سفارشی در طلا رایس ثبت نکرده‌اید.</p>
                <Link to="/products" className={styles.primaryBtn}>
                  مشاهده کاتالوگ برنج اصیل
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {userOrders.map((order) => (
                  <article key={order.id || order._id} className={styles.orderCard}>
                    <div className={styles.orderTopRow}>
                      <div className={styles.orderIdDate}>
                        <span className={styles.orderIdText}>
                          سفارش #{String(order.id || order._id).slice(-6)}
                        </span>
                        <span className={styles.orderDateText}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : 'به تازگی'}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* لیست اقلام */}
                    <div className={styles.orderItemsList}>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <span className={styles.orderItemName}>{item.name || item.title || 'کیسه برنج اصیل'}</span>
                            <span className={styles.orderItemQtyPrice}>
                              {(item.quantity || item.qty || 1).toLocaleString('fa-IR')} عدد × {(item.price || 0).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.orderItemRow}>
                          <span className={styles.orderItemName}>سفارش برنج ارگانیک کامفیروز</span>
                          <span className={styles.orderItemQtyPrice}>۱ کیسه ۱۰ کیلویی</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.orderBottomRow}>
                      <div className={styles.orderTotalAmount}>
                        <span>مبلغ کل:</span>
                        <strong className={styles.orderTotalValue}>
                          {(order.totalPrice || 0).toLocaleString('fa-IR')} تومان
                        </strong>
                      </div>

                      {order.trackingCode && (
                        <div className={styles.trackingCodeBox}>
                          <span>کد رهگیری پستی:</span>
                          <span className={styles.trackingCodeVal}>{order.trackingCode}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(order.trackingCode)}
                            className={styles.copyCodeBtn}
                            title="کپی کد رهگیری"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* تب ۲: رهگیری مرسوله پستی */}
        {activeTab === 'tracking' && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Search size={20} />
                سامانه رهگیری ارسال مستقیم از شالیزار
              </h2>
            </div>

            <form onSubmit={handleTrackingSearch} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Search size={15} />
                  شماره سفارش یا کد ۲۴ رقمی پست پیشتاز
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="مثال: TR-98421 یا 192837465019283746501234"
                    className={styles.inputField}
                    style={{ direction: 'ltr', textAlign: 'right' }}
                  />
                  <button
                    type="submit"
                    disabled={isSearchingTracking}
                    className={styles.primaryBtn}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isSearchingTracking ? 'در حال جستجو...' : 'استعلام وضعیت'}
                  </button>
                </div>
                {trackingError && (
                  <p style={{ color: '#e11d48', fontSize: '0.825rem', marginTop: '0.4rem', fontWeight: 600 }}>
                    {trackingError}
                  </p>
                )}
              </div>
            </form>

            {trackedOrder && (
              <div style={{ marginTop: '1rem' }} className={styles.orderCard}>
                <div className={styles.orderTopRow}>
                  <span className={styles.orderIdText}>
                    مرسوله مربوط به سفارش #{String(trackedOrder.id || trackedOrder._id).slice(-6)}
                  </span>
                  {getStatusBadge(trackedOrder.status)}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  مرسوله شما با بسته‌بندی نخی ویژه طلا رایس جهت حفظ عطر و تازگی، توسط پست پیشتاز ارسال شده است.
                </p>
                {trackedOrder.trackingCode && (
                  <div className={styles.trackingCodeBox} style={{ alignSelf: 'flex-start' }}>
                    <span>کد رهگیری ملی پست:</span>
                    <span className={styles.trackingCodeVal}>{trackedOrder.trackingCode}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(trackedOrder.trackingCode)}
                      className={styles.copyCodeBtn}
                    >
                      کپی
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* تب ۳: مشخصات و آدرس */}
        {activeTab === 'info' && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <User size={20} />
                مشخصات کاربری و آدرس ارسال
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className={styles.formGrid}>
              <div className={styles.formGrid2} style={{ display: 'grid', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>شماره تلفن همراه</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={styles.inputField}
                    style={{ direction: 'ltr', textAlign: 'right' }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <MapPin size={15} />
                  آدرس دقیق پستی جهت تحویل سفارش
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..."
                  rows={3}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>کد پستی ۱۰ رقمی</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="مثال: ۷۱۸۵۸۴۹۲۱۵"
                  maxLength={10}
                  className={styles.inputField}
                  style={{ direction: 'ltr', textAlign: 'right' }}
                />
              </div>

              <button type="submit" disabled={isUpdatingProfile} className={styles.primaryBtn}>
                {isUpdatingProfile ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات مشخصات'}
              </button>
            </form>
          </>
        )}

        {/* تب ۴: امنیت و تغییر رمز */}
        {activeTab === 'security' && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Lock size={20} />
                تغییر رمز عبور حساب کاربری
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رمز عبور فعلی</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className={styles.inputField}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.formGrid2} style={{ display: 'grid', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>رمز عبور جدید</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={4}
                    className={styles.inputField}
                    placeholder="حداقل ۴ کاراکتر"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تکرار رمز عبور جدید</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={4}
                    className={styles.inputField}
                    placeholder="تکرار رمز عبور جدید"
                  />
                </div>
              </div>

              <button type="submit" disabled={isChangingPassword} className={styles.primaryBtn}>
                {isChangingPassword ? 'در حال تغییر...' : 'ثبت رمز عبور جدید'}
              </button>
            </form>
          </>
        )}

        {/* تب ۵: پشتیبانی و ارتباط */}
        {activeTab === 'support' && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Headphones size={20} />
                ارتباط با واحد مشتریان طلا رایس
              </h2>
            </div>

            <div className={styles.supportChannelsGrid}>
              <div className={styles.supportChannelCard}>
                <div className={styles.supportIconCircle}>
                  <Phone size={20} />
                </div>
                <div className={styles.supportChannelInfo}>
                  <span className={styles.supportTitle}>تماس تلفنی با دفتر شالیزار</span>
                  <span className={styles.supportDetail}>
                    ۰۷۱-۳۸۳۰۱۵۶۰ (خط مستقیم پشتیبانی شنبه تا پنجشنبه ۸ الی ۲۰)
                  </span>
                </div>
              </div>

              <div className={styles.supportChannelCard}>
                <div className={styles.supportIconCircle}>
                  <Truck size={20} />
                </div>
                <div className={styles.supportChannelInfo}>
                  <span className={styles.supportTitle}>ارسال مستقیم و ضمانت پخت</span>
                  <span className={styles.supportDetail}>
                    تمامی محصولات با ۷ روز ضمانت بازگشت وجه در صورت عدم رضایت از عطر و ری ارائه می‌شوند.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
