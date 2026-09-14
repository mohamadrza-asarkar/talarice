import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Truck,
  Image as ImageIcon,
  DollarSign,
  Eye,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  UserCheck,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { adminApi, ordersApi, productsApi, slidesApi } from '../api';
import styles from './pages.module.css';

export default function Admin() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAdmin,
    products,
    setProducts,
    addProduct,
    deleteProduct,
    sliders,
    setSliders,
    addSlide,
    deleteSlide,
    getOrderStatusInfo,
    showSuccess,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'slides', 'users'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);

  // Search & Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Form for new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdDiscount, setNewProdDiscount] = useState('0');
  const [newProdCategory, setNewProdCategory] = useState('kamfirouz');
  const [newProdWeight, setNewProdWeight] = useState('۱۰ کیلوگرم');
  const [newProdStock, setNewProdStock] = useState('30');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImageBase64, setNewProdImageBase64] = useState('');
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);

  // Form for new slide / banner
  const [showAddSlideForm, setShowAddSlideForm] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlideCta, setNewSlideCta] = useState('مشاهده و خرید آنلاین');
  const [newSlideCategory, setNewSlideCategory] = useState('all');
  const [newSlideImageBase64, setNewSlideImageBase64] = useState('');
  const [isSubmittingSlide, setIsSubmittingSlide] = useState(false);

  // Postal tracking modal / state
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState(null);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);

  // Receipt preview
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);

  // 1. Fetch live orders for admin
  const fetchAdminOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const list = await ordersApi.getAllOrders();
      setAdminOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.debug('Admin orders sync notice:', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // 2. Fetch live registered users
  const fetchAdminUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const list = await adminApi.getUsers();
      setAdminUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.debug('Admin users sync notice:', err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // 3. Fetch products directly
  const fetchAdminProducts = useCallback(async () => {
    try {
      const res = await productsApi.getAll({ limit: 100 });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.products) ? res.products : []));
      if (rawList.length > 0) {
        setProducts(rawList);
      }
    } catch (err) {
      console.debug('Admin products sync notice:', err.message);
    }
  }, [setProducts]);

  // 4. Fetch slides from server
  const fetchAdminSlides = useCallback(async () => {
    setIsLoadingSlides(true);
    try {
      const list = await slidesApi.getAll();
      if (Array.isArray(list) && list.length > 0) {
        setSliders(list);
      }
    } catch (err) {
      console.debug('Admin slides sync notice:', err.message);
    } finally {
      setIsLoadingSlides(false);
    }
  }, [setSliders]);

  // 5. Fetch dashboard stats
  const fetchDashboard = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await adminApi.getDashboard();
      if (res && typeof res === 'object') {
        setDashboardStats(res);
      }
    } catch (err) {
      console.debug('Admin dashboard sync notice:', err.message);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const refreshAllAdminData = useCallback(async () => {
    setIsLoadingAll(true);
    await Promise.allSettled([
      fetchAdminOrders(),
      fetchAdminUsers(),
      fetchAdminProducts(),
      fetchAdminSlides(),
      fetchDashboard()
    ]);
    setIsLoadingAll(false);
    showToast('اطلاعات پنل مدیریت از وب‌سرویس بروزرسانی شد.', 'info');
  }, [fetchAdminOrders, fetchAdminUsers, fetchAdminProducts, fetchAdminSlides, fetchDashboard, showToast]);

  useEffect(() => {
    fetchAdminOrders();
    fetchAdminUsers();
    fetchAdminProducts();
    fetchAdminSlides();
    fetchDashboard();
  }, [fetchAdminOrders, fetchAdminUsers, fetchAdminProducts, fetchAdminSlides, fetchDashboard]);

  // Dynamic Revenue calculation
  const totalRevenue = dashboardStats?.totalRevenue ?? adminOrders.reduce(
    (sum, o) => sum + (Number(o.finalAmount || o.totalPrice) || 0),
    0
  );

  const totalOrdersCount = dashboardStats?.totalOrders ?? adminOrders.length;
  const totalProductsCount = dashboardStats?.totalProducts ?? products.length;
  const totalUsersCount = dashboardStats?.totalUsers ?? adminUsers.length;

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast('حجم تصویر نباید بیشتر از ۴ مگابایت باشد.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setNewProdImageBase64(uploadEvent.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSlideImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم تصویر اسلایدر نباید بیشتر از ۵ مگابایت باشد.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setNewSlideImageBase64(uploadEvent.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      showToast('لطفاً عنوان و قیمت محصول را مشخص فرمایید.', 'error');
      return;
    }

    setIsSubmittingProd(true);
    try {
      await addProduct({
        name: newProdName.trim(),
        price: Number(newProdPrice),
        originalPrice: Number(newProdOriginalPrice || newProdPrice),
        discountPercent: Number(newProdDiscount || 0),
        category: newProdCategory,
        weight: newProdWeight,
        stock: Number(newProdStock || 20),
        description: newProdDesc.trim() || 'برنج اصیل معطر درجه یک شالیزار کامفیروز',
        image: newProdImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
        imageBase64: newProdImageBase64
      });

      setNewProdName('');
      setNewProdPrice('');
      setNewProdOriginalPrice('');
      setNewProdDiscount('0');
      setNewProdDesc('');
      setNewProdImageBase64('');
      setShowAddForm(false);
      fetchAdminProducts();
    } catch (err) {
      // Error is caught and surfaced
    } finally {
      setIsSubmittingProd(false);
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlideTitle.trim()) {
      showToast('لطفاً عنوان اصلی اسلاید را وارد نمایید.', 'error');
      return;
    }

    setIsSubmittingSlide(true);
    try {
      await addSlide({
        title: newSlideTitle.trim(),
        subtitle: newSlideSubtitle.trim() || 'فروش ویژه طلا رایس',
        description: newSlideDesc.trim() || 'عرضه مستقیم با ضمانت صد در صدی کیفیت و پخت',
        ctaText: newSlideCta.trim() || 'مشاهده و خرید آنلاین',
        category: newSlideCategory,
        image: newSlideImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
        imageBase64: newSlideImageBase64
      });

      setNewSlideTitle('');
      setNewSlideSubtitle('');
      setNewSlideDesc('');
      setNewSlideCta('مشاهده و خرید آنلاین');
      setNewSlideImageBase64('');
      setShowAddSlideForm(false);
      fetchAdminSlides();
    } catch (err) {
      showToast('خطا در ایجاد اسلایدر: ' + err.message, 'error');
    } finally {
      setIsSubmittingSlide(false);
    }
  };

  const handleUpdateShipping = async (orderId) => {
    if (!trackingCodeInput.trim()) {
      showToast('لطفاً کد رهگیری پستی را وارد کنید.', 'error');
      return;
    }
    setIsUpdatingShipping(true);
    try {
      await ordersApi.updateStatus(orderId, {
        status: 'ارسال شده',
        state: 'ارسال شده',
        trackingCode: trackingCodeInput.trim(),
        postTrackingCode: trackingCodeInput.trim(),
        adminNote: adminNoteInput.trim()
      });

      setAdminOrders((prev) =>
        prev.map((o) =>
          (o.id === orderId || o._id === orderId)
            ? {
                ...o,
                status: 'ارسال شده',
                state: 'ارسال شده',
                trackingCode: trackingCodeInput.trim(),
                postTrackingCode: trackingCodeInput.trim(),
                postalTrackingCode: trackingCodeInput.trim()
              }
            : o
        )
      );

      showSuccess('کد رهگیری پستی در سرور ذخیره شد و وضعیت به ارسال شده تغییر یافت.');
      setEditingTrackingOrderId(null);
      setTrackingCodeInput('');
      setAdminNoteInput('');
    } catch (err) {
      showToast('خطا در ذخیره کد پستی: ' + err.message, 'error');
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  const handleUpdateOrderStatusDirect = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, {
        status: newStatus,
        state: newStatus
      });

      setAdminOrders((prev) =>
        prev.map((o) =>
          (o.id === orderId || o._id === orderId)
            ? { ...o, status: newStatus, state: newStatus }
            : o
        )
      );
      showSuccess(`وضعیت سفارش به «${newStatus}» تغییر یافت.`);
    } catch (err) {
      showToast(`خطا در تغییر وضعیت سفارش: ${err.message}`, 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('آیا از حذف این سفارش در سرور اطمینان دارید؟')) return;
    try {
      await ordersApi.deleteOrder(orderId);
      setAdminOrders((prev) => prev.filter((o) => o.id !== orderId && o._id !== orderId));
      showToast('سفارش از سرور حذف گردید.', 'info');
    } catch (err) {
      showToast(`خطا در حذف سفارش: ${err.message}`, 'error');
    }
  };

  const handleVerifyReceipt = async (orderId, isApproved) => {
    try {
      await ordersApi.verifyPayment(orderId, {
        status: isApproved ? 'approved' : 'rejected',
        state: isApproved ? 'processing' : 'cancelled',
        adminNote: isApproved ? 'فیش بانکی تایید شد' : 'فیش نامعتبر است'
      });
      showSuccess(isApproved ? 'فیش پرداخت تایید و وضعیت به در حال پردازش تغییر یافت.' : 'فیش پرداخت رد شد.');
      setAdminOrders((prev) =>
        prev.map((o) =>
          (o.id === orderId || o._id === orderId)
            ? {
                ...o,
                paymentStatus: isApproved ? 'approved' : 'rejected',
                status: isApproved ? 'در حال پردازش' : 'لغو شده',
                state: isApproved ? 'در حال پردازش' : 'لغو شده'
              }
            : o
        )
      );
    } catch (err) {
      showToast('خطا در ثبت وضعیت پرداخت: ' + err.message, 'error');
    }
  };

  const handleToggleUserRole = async (user) => {
    const userId = user._id || user.id;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = user.role === 'admin'
      ? `آیا می‌خواهید دسترسی مدیریت کاربر ${user.name} را لغو کنید؟`
      : `آیا می‌خواهید کاربر ${user.name} را به سطح مدیر ارتقا دهید؟`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await adminApi.updateUser(userId, { role: newRole });
      setAdminUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole, isAdmin: newRole === 'admin' } : u))
      );
      showSuccess(`نقش کاربری به ${newRole === 'admin' ? 'مدیر' : 'کاربر عادی'} تغییر یافت.`);
    } catch (err) {
      showToast('خطا در تغییر نقش کاربری: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      await adminApi.deleteUser(userId);
      setAdminUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
      showToast('کاربر با موفقیت حذف شد.', 'info');
    } catch (err) {
      showToast('خطا در حذف کاربر: ' + err.message, 'error');
    }
  };

  // Filtered orders
  const filteredOrders = adminOrders.filter((o) => {
    const matchSearch =
      !orderSearchQuery.trim() ||
      String(o.trackingCode || '').includes(orderSearchQuery.trim()) ||
      String(o.postTrackingCode || '').includes(orderSearchQuery.trim()) ||
      String(o.customerName || o.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      String(o.customerPhone || o.phone || '').includes(orderSearchQuery.trim());

    const statusNorm = String(o.status || o.state || '').trim();
    const matchStatus =
      orderStatusFilter === 'all' ||
      statusNorm === orderStatusFilter ||
      (orderStatusFilter === 'processing' && (statusNorm === 'در حال پردازش' || statusNorm === 'pending')) ||
      (orderStatusFilter === 'shipped' && (statusNorm === 'ارسال شده' || statusNorm === 'shipped')) ||
      (orderStatusFilter === 'delivered' && (statusNorm === 'تحویل شده' || statusNorm === 'delivered')) ||
      (orderStatusFilter === 'cancelled' && (statusNorm === 'لغو شده' || statusNorm === 'cancelled'));

    return matchSearch && matchStatus;
  });

  // Filtered users
  const filteredUsers = adminUsers.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase().trim();
    return (
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.phone || '').includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className={styles.pageTitle} style={{ margin: 0 }}>پنل مدیریت طلا رایس</h1>
            <span className={styles.badge} style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
              <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: '-2px', marginLeft: '3px' }} />
              مدیر سیستم: {currentUser?.name || 'مدیر'}
            </span>
          </div>
          <p className={styles.pageSubtitle}>مدیریت مستقیم سفارش‌ها، محصولات، اسلایدرها و کاربران در وب‌سرویس</p>
        </div>
        <div className={styles.flexRow}>
          <button
            type="button"
            className={styles.backButton}
            onClick={refreshAllAdminData}
            title="تازه‌سازی کلیه اطلاعات از وب‌سرویس"
            disabled={isLoadingAll}
          >
            <RefreshCw size={15} className={isLoadingAll ? styles.spinner : ''} />
            بروزرسانی داده‌ها
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/profile')} title="ورود به پنل کاربری">
            <Users size={15} />
            حساب من
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')} title="مشاهده فروشگاه">
            <ArrowRight size={15} />
            فروشگاه
          </button>
        </div>
      </header>

      {/* آمار داشبورد منطبق با وب‌سرویس */}
      <section className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>مجموع فروش کل</span>
          <span className={styles.statValue}>{Number(totalRevenue || 0).toLocaleString('fa-IR')} تومان</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>کل سفارش‌ها در سرور</span>
          <span className={styles.statValue}>
            {Number(totalOrdersCount || 0).toLocaleString('fa-IR')} سفارش
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>محصولات فعال</span>
          <span className={styles.statValue}>
            {Number(totalProductsCount || 0).toLocaleString('fa-IR')} رقم
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>اسلایدرهای فعال</span>
          <span className={styles.statValue}>
            {Number(sliders?.length || 0).toLocaleString('fa-IR')} بنر
          </span>
        </div>
      </section>

      {/* منوی تب‌ها */}
      <nav className={styles.tabsList}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} />
          مدیریت سفارشات ({adminOrders.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          مدیریت محصولات ({products.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'slides' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <Layers size={16} />
          اسلایدر و بنرها ({sliders?.length || 0})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          کاربران سامانه ({adminUsers.length})
        </button>
      </nav>

      {/* تب ۱: سفارشات و فیش‌های بانکی */}
      {activeTab === 'overview' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>فهرست سفارشات ثبت شده در سرور</h2>
              <p className={styles.pageSubtitle}>تغییر وضعیت سفارش، تایید فیش بانکی و ثبت کدهای رهگیری پستی ۲۴ رقمی</p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={fetchAdminOrders}
              disabled={isLoadingOrders}
            >
              <RefreshCw size={14} className={isLoadingOrders ? styles.spinner : ''} />
              تازه‌سازی سفارش‌ها
            </button>
          </div>

          {/* نوار جستجو و فیلتر سفارشات */}
          <div className={styles.flexRow} style={{ gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                className={styles.input}
                placeholder="جستجو با نام خریدار، شماره تماس یا کد رهگیری..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />
            </div>
            <select
              className={styles.select}
              style={{ width: 'auto', minWidth: '160px' }}
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
            >
              <option value="all">همه وضعیت‌ها ({adminOrders.length})</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipped">ارسال شده (پست)</option>
              <option value="delivered">تحویل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>

          <div className={styles.flexCol}>
            {isLoadingOrders && adminOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>
                <RefreshCw size={24} className={styles.spinner} style={{ margin: '0 auto 0.5rem auto' }} />
                <p>در حال دریافت سفارشات از سرور...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                <p>{orderSearchQuery ? 'سفارشی با مشخصات جستجو شده یافت نشد.' : 'هنوز سفارشی در سیستم ثبت نشده است.'}</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = getOrderStatusInfo(order.status || order.state);
                const orderId = order._id || order.id;
                const finalSum = Number(order.finalAmount || order.totalPrice || 0);

                return (
                  <div key={orderId} className={styles.statBox} style={{ border: '1px solid #e7e5e4', background: '#fff' }}>
                    <div className={styles.pageHeader} style={{ marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                      <div>
                        <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong className={styles.pageTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
                            کد رهگیری: {order.postTrackingCode || order.trackingCode || orderId}
                          </strong>
                          <span
                            className={styles.badge}
                            style={{
                              backgroundColor: status.bg,
                              color: status.color,
                              borderColor: status.border
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className={styles.pageSubtitle} style={{ margin: '0.25rem 0' }}>
                          خریدار: <strong>{order.customerName || order.name || 'کاربر گرامی'}</strong> | تلفن: <span dir="ltr">{order.customerPhone || order.phone || 'ثبت نشده'}</span>
                        </p>
                        <small className={styles.label}>
                          نشانی گیرنده: {order.customerAddress || order.address || 'نشانی ثبت نشده'}
                        </small>
                      </div>

                      <div style={{ textAlign: 'left' }}>
                        <span className={styles.currentPrice} style={{ fontSize: '1.1rem', display: 'block' }}>
                          {finalSum.toLocaleString('fa-IR')} تومان
                        </span>
                        <small className={styles.label} style={{ fontSize: '0.75rem' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : 'امروز'}
                        </small>
                      </div>
                    </div>

                    {/* اقلام سفارش */}
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#334155' }}>اقلام سفارش:</strong>
                      <div className={styles.flexCol} style={{ gap: '0.25rem' }}>
                        {(order.items || order.products || []).map((item, idx) => (
                          <div key={idx} className={styles.flexRow} style={{ justifyContent: 'space-between', color: '#475569' }}>
                            <span>• {item.name || item.title || 'برنج اصیل'}</span>
                            <span>{item.quantity || item.qty || 1} عدد ({Number(item.price || 0).toLocaleString('fa-IR')} تومان)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* فیش بانکی */}
                    {(order.paymentReceipt || order.receiptImage) && (
                      <div
                        style={{
                          background: '#fefce8',
                          border: '1px solid #fef08a',
                          borderRadius: '8px',
                          padding: '0.5rem 0.75rem',
                          margin: '0.5rem 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#854d0e' }}>فیش واریز کارت به کارت:</span>
                          <span className={styles.badge} style={{ backgroundColor: order.paymentStatus === 'approved' ? '#dcfce7' : '#fee2e2', color: order.paymentStatus === 'approved' ? '#166534' : '#991b1b' }}>
                            {order.paymentStatus === 'approved' ? 'تایید شده' : order.paymentStatus === 'rejected' ? 'رد شده' : 'در انتظار بررسی'}
                          </span>
                        </div>
                        <div className={styles.flexRow} style={{ gap: '0.4rem' }}>
                          <button
                            type="button"
                            className={styles.backButton}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => setPreviewReceiptUrl(order.paymentReceipt || order.receiptImage)}
                          >
                            <Eye size={13} />
                            مشاهده فیش
                          </button>
                          <button
                            type="button"
                            className={styles.btnPrimary}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#16a34a' }}
                            onClick={() => handleVerifyReceipt(orderId, true)}
                          >
                            <CheckCircle2 size={13} />
                            تایید فیش
                          </button>
                          <button
                            type="button"
                            className={styles.btnDanger}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => handleVerifyReceipt(orderId, false)}
                          >
                            <XCircle size={13} />
                            رد فیش
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ویرایش کد مرسوله پستی */}
                    {editingTrackingOrderId === orderId ? (
                      <div className={styles.cardHighlight} style={{ margin: '0.5rem 0', background: '#eff6ff', borderColor: '#bfdbfe' }}>
                        <label className={styles.label} style={{ color: '#1e40af', fontWeight: 'bold' }}>
                          ثبت شماره مرسوله پستی ۲۴ رقمی اداره پست:
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          dir="ltr"
                          placeholder="مثال: 241098234509123891238912"
                          value={trackingCodeInput}
                          onChange={(e) => setTrackingCodeInput(e.target.value)}
                        />
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="یادداشت مدیر (اختیاری)"
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          style={{ marginTop: '0.4rem' }}
                        />
                        <div className={styles.flexRow} style={{ marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={() => handleUpdateShipping(orderId)}
                            disabled={isUpdatingShipping}
                          >
                            {isUpdatingShipping ? 'در حال ذخیره...' : 'ذخیره کد رهگیری و ثبت وضعیت ارسال'}
                          </button>
                          <button
                            type="button"
                            className={styles.backButton}
                            onClick={() => setEditingTrackingOrderId(null)}
                          >
                            انصراف
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* نوار تغییر وضعیت و عملیات مدیر */}
                    <div className={styles.pageHeader} style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f5f5f4' }}>
                      <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className={styles.backButton}
                          title="ثبت یا ویرایش کد مرسوله پستی"
                          onClick={() => {
                            setEditingTrackingOrderId(orderId);
                            setTrackingCodeInput(order.postTrackingCode || order.trackingCode || '');
                          }}
                        >
                          <Truck size={14} />
                          {order.postTrackingCode ? 'ویرایش کد پستی' : 'ثبت کد رهگیری پستی'}
                        </button>
                      </div>

                      <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem' }}>
                        <span className={styles.label} style={{ fontSize: '0.8rem' }}>تغییر وضعیت:</span>
                        <select
                          className={styles.select}
                          style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                          value={order.status || order.state || 'در حال پردازش'}
                          onChange={(e) => handleUpdateOrderStatusDirect(orderId, e.target.value)}
                        >
                          <option value="در حال پردازش">در حال پردازش</option>
                          <option value="ارسال شده">ارسال شده (تحویل پست)</option>
                          <option value="تحویل شده">تحویل شده</option>
                          <option value="لغو شده">لغو شده</option>
                        </select>

                        <button
                          type="button"
                          className={styles.btnDanger}
                          title="حذف سفارش از سرور"
                          onClick={() => handleDeleteOrder(orderId)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* تب ۲: مدیریت محصولات */}
      {activeTab === 'products' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت ارقام برنج در وب‌سرویس</h2>
              <p className={styles.pageSubtitle}>افزودن محصولات جدید، ویرایش قیمت‌ها و مدیریت موجودی انبار</p>
            </div>
            <div className={styles.flexRow}>
              <button
                type="button"
                className={styles.backButton}
                onClick={fetchAdminProducts}
              >
                <RefreshCw size={14} />
                تازه‌سازی
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus size={16} />
                {showAddForm ? 'بستن فرم' : 'افزودن برنج جدید'}
              </button>
            </div>
          </div>

          {/* فرم افزودن برنج جدید */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} className={styles.cardHighlight} style={{ marginBottom: '1.5rem' }}>
              <h3 className={styles.pageTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                ثبت رقم برنج جدید در وب‌سرویس
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>نام و عنوان محصول:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: برنج طارم هاشمی ممتاز کشت اول"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت نهایی فروش (تومان):</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: 450000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت قبل از تخفیف (اختیاری):</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: 490000"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>درصد تخفیف (%):</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: 10"
                    value={newProdDiscount}
                    onChange={(e) => setNewProdDiscount(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>دسته‌بندی رقم برنج:</label>
                  <select
                    className={styles.select}
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="kamfirouz">برنج کامفیروز</option>
                    <option value="hashemi">برنج هاشمی</option>
                    <option value="tarom">برنج طارم</option>
                    <option value="doudi">برنج دودی</option>
                    <option value="brown">برنج قهوه‌ای</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>وزن بسته‌بندی:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: ۱۰ کیلوگرم"
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>موجودی انبار (تعداد کیسه):</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تصویر گونی برنج (آپلود فایل):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className={styles.input}
                />
                {newProdImageBase64 && (
                  <img
                    src={newProdImageBase64}
                    alt="پیش‌نمایش"
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem', border: '1px solid #e7e5e4' }}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات و مشخصات پخت و عطر:</label>
                <textarea
                  className={styles.textarea}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="ویژگی‌ها، عطر، کیفیت پخت، ری‌دهی و محل کشت..."
                  rows={3}
                />
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={isSubmittingProd}>
                {isSubmittingProd ? 'در حال ثبت در وب‌سرویس...' : 'ثبت و انتشار محصول در وب‌سرویس'}
              </button>
            </form>
          )}

          {/* فهرست محصولات */}
          <div className={styles.flexCol}>
            {products.length === 0 ? (
              <p className={styles.label}>هیچ محصولی یافت نشد.</p>
            ) : (
              products.map((product) => {
                const prodId = product._id || product.id;
                return (
                  <div key={prodId} className={styles.statBox} style={{ border: '1px solid #e7e5e4', background: '#fff' }}>
                    <div className={styles.pageHeader}>
                      <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={product.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'}
                          alt={product.name}
                          className={styles.productThumb}
                          style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className={styles.pageTitle} style={{ fontSize: '1rem', margin: 0 }}>{product.name}</strong>
                          <p className={styles.pageSubtitle} style={{ margin: '0.2rem 0' }}>
                            {Number(product.price || 0).toLocaleString('fa-IR')} تومان
                            {product.discountPercent > 0 && (
                              <span style={{ color: '#dc2626', marginRight: '4px' }}>
                                ({product.discountPercent}% تخفیف)
                              </span>
                            )}
                          </p>
                          <small className={styles.label}>
                            موجودی انبار: <strong>{product.stock ?? product.countInStock ?? 20} کیسه</strong> | وزن: {product.weight || '۱۰ کیلوگرم'}
                          </small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        title="حذف محصول از وب‌سرویس"
                        onClick={() => deleteProduct(prodId)}
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* تب ۳: مدیریت اسلایدرها و بنرهای تبلیغاتی */}
      {activeTab === 'slides' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت اسلایدرها و بنرهای صفحه نخست</h2>
              <p className={styles.pageSubtitle}>افزودن و ویرایش تصاویر هدر، عناوین تبلیغاتی و لینک‌های فروش ویژه در وب‌سرویس</p>
            </div>
            <div className={styles.flexRow}>
              <button
                type="button"
                className={styles.backButton}
                onClick={fetchAdminSlides}
                disabled={isLoadingSlides}
              >
                <RefreshCw size={14} className={isLoadingSlides ? styles.spinner : ''} />
                تازه‌سازی
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setShowAddSlideForm(!showAddSlideForm)}
              >
                <Plus size={16} />
                {showAddSlideForm ? 'بستن فرم' : 'افزودن اسلاید جدید'}
              </button>
            </div>
          </div>

          {/* فرم افزودن اسلاید جدید */}
          {showAddSlideForm && (
            <form onSubmit={handleAddSlide} className={styles.cardHighlight} style={{ marginBottom: '1.5rem' }}>
              <h3 className={styles.pageTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                افزودن اسلایدر جدید به صفحه نخست
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>عنوان اصلی اسلاید:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: جشنواره فروش ویژه برنج کامفیروز درجه یک"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان فرعی / تگ بالای تیتر:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: فروش ویژه پاییزه با ارسال رایگان"
                    value={newSlideSubtitle}
                    onChange={(e) => setNewSlideSubtitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>متن دکمه خرید / فراخوان:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: مشاهده و خرید آنلاین"
                    value={newSlideCta}
                    onChange={(e) => setNewSlideCta(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>فیلتر دسته‌بندی مرتبط:</label>
                  <select
                    className={styles.select}
                    value={newSlideCategory}
                    onChange={(e) => setNewSlideCategory(e.target.value)}
                  >
                    <option value="all">همه محصولات</option>
                    <option value="kamfirouz">برنج کامفیروز</option>
                    <option value="hashemi">برنج هاشمی</option>
                    <option value="tarom">برنج طارم</option>
                    <option value="doudi">برنج دودی</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تصویر اسلایدر (آپلود فایل بنر یا تصویر):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSlideImageFileChange}
                  className={styles.input}
                />
                {newSlideImageBase64 && (
                  <img
                    src={newSlideImageBase64}
                    alt="پیش‌نمایش اسلاید"
                    style={{ width: '140px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem', border: '1px solid #e7e5e4' }}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات تکمیلی اسلایدر:</label>
                <textarea
                  className={styles.textarea}
                  value={newSlideDesc}
                  onChange={(e) => setNewSlideDesc(e.target.value)}
                  placeholder="توضیح کوتاه در خصوص کیفیت، ارسال یا تخفیف ویژه..."
                  rows={2}
                />
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={isSubmittingSlide}>
                {isSubmittingSlide ? 'در حال ثبت در سرور...' : 'ثبت و انتشار اسلایدر در وب‌سرویس'}
              </button>
            </form>
          )}

          {/* لیست اسلایدها */}
          <div className={styles.flexCol}>
            {!sliders || sliders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
                <Layers size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                <p>هیچ اسلایدری یافت نشد. می‌توانید با دکمه بالا اسلایدر جدید اضافه نمایید.</p>
              </div>
            ) : (
              sliders.map((slide, idx) => {
                const slideId = slide._id || slide.id || `slide-${idx}`;
                return (
                  <div key={slideId} className={styles.statBox} style={{ border: '1px solid #e7e5e4', background: '#fff' }}>
                    <div className={styles.pageHeader} style={{ alignItems: 'flex-start' }}>
                      <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={slide.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'}
                          alt={slide.title}
                          style={{ width: '90px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e7e5e4' }}
                        />
                        <div>
                          <span className={styles.badge} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', marginBottom: '0.2rem', display: 'inline-block' }}>
                            {slide.subtitle || 'اسلاید ویژه'}
                          </span>
                          <strong className={styles.pageTitle} style={{ fontSize: '1rem', display: 'block', margin: '0.1rem 0' }}>
                            {slide.title}
                          </strong>
                          <p className={styles.pageSubtitle} style={{ margin: '0.2rem 0', fontSize: '0.82rem' }}>
                            {slide.description}
                          </p>
                          <small className={styles.label}>
                            متن دکمه: «{slide.ctaText || 'مشاهده'}» | دسته‌بندی: {slide.category || 'همه'}
                          </small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        title="حذف اسلایدر"
                        onClick={() => deleteSlide(slideId)}
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* تب ۴: کاربران سامانه */}
      {activeTab === 'users' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>کاربران ثبت‌نام شده در وب‌سرویس</h2>
              <p className={styles.pageSubtitle}>مشاهده شماره تماس کاربران، نشانی‌ها و تعیین سطح دسترسی مدیریت</p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={fetchAdminUsers}
              disabled={isLoadingUsers}
            >
              <RefreshCw size={14} className={isLoadingUsers ? styles.spinner : ''} />
              تازه‌سازی کاربران
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              className={styles.input}
              placeholder="جستجوی کاربر با نام، شماره تماس یا ایمیل..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.flexCol}>
            {isLoadingUsers && adminUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>
                <RefreshCw size={24} className={styles.spinner} style={{ margin: '0 auto 0.5rem auto' }} />
                <p>در حال دریافت کاربران از سرور...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
                <Users size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                <p>{userSearchQuery ? 'کاربری با این مشخصات یافت نشد.' : 'هنوز کاربری در سامانه ثبت‌نام نکرده است.'}</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const userId = user._id || user.id;
                const isUserAdmin = user.role === 'admin' || user.isAdmin === true;

                return (
                  <div key={userId} className={styles.statBox} style={{ border: '1px solid #e7e5e4', background: '#fff' }}>
                    <div className={styles.pageHeader}>
                      <div>
                        <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <strong className={styles.pageTitle} style={{ fontSize: '1rem', margin: 0 }}>
                            {user.name || 'کاربر گرامی'}
                          </strong>
                          <span
                            className={styles.badge}
                            style={{
                              backgroundColor: isUserAdmin ? '#fef3c7' : '#f1f5f9',
                              color: isUserAdmin ? '#92400e' : '#475569',
                              borderColor: isUserAdmin ? '#fde68a' : '#cbd5e1'
                            }}
                          >
                            {isUserAdmin ? 'مدیر ارشد' : 'مشتری عادی'}
                          </span>
                        </div>
                        <p className={styles.pageSubtitle} style={{ margin: '0.2rem 0' }}>
                          تلفن: <span dir="ltr">{user.phone || user.mobile || 'ثبت نشده'}</span> | ایمیل: {user.email || 'ثبت نشده'}
                        </p>
                        <small className={styles.label}>
                          نشانی ثبت شده: {user.address || user.fullAddress || 'ثبت نشده'}
                        </small>
                      </div>

                      <div className={styles.flexRow} style={{ gap: '0.4rem' }}>
                        <button
                          type="button"
                          className={styles.backButton}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          title={isUserAdmin ? 'تبدیل به کاربر عادی' : 'ارتقا به مدیر'}
                          onClick={() => handleToggleUserRole(user)}
                        >
                          <UserCheck size={14} />
                          {isUserAdmin ? 'لغو مدیریت' : 'ارتقا به مدیر'}
                        </button>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          title="حذف کاربر"
                          onClick={() => handleDeleteUser(userId)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* مودال مشاهده تصویر فیش */}
      {previewReceiptUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div
            style={{
              background: '#fff',
              padding: '1.25rem',
              borderRadius: '16px',
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: 'auto',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#1c1917' }}>تصویر فیش بانکی ارسالی خریدار</h3>
            <img
              src={previewReceiptUrl}
              alt="فیش پرداخت"
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', border: '1px solid #e7e5e4' }}
            />
            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setPreviewReceiptUrl(null)}
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export { Admin };
