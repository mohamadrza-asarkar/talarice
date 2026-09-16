import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
  Layers,
  RefreshCw
} from 'lucide-react';
import { adminApi, ordersApi, productsApi, slidesApi } from '../api';
import { AdminOverview } from '../components/admin/adminOverview';
import { AdminProducts } from '../components/admin/adminProducts';
import { AdminOrders } from '../components/admin/adminOrders';
import { AdminUsers } from '../components/admin/adminUsers';
import { AdminSlides } from '../components/admin/adminSlides';
import styles from './pages.module.css';

export default function Admin() {
  const navigate = useNavigate();
  const {
    currentUser,
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    sliders,
    setSliders,
    addSlide,
    updateSlide,
    deleteSlide,
    getOrderStatusInfo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'slides', 'users'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);

  // Search & Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Form states for NEW Product
  const [showAddProdForm, setShowAddProdForm] = useState(false);
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

  // Form states for NEW Slide
  const [showAddSlideForm, setShowAddSlideForm] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlideCta, setNewSlideCta] = useState('مشاهده و خرید آنلاین');
  const [newSlideCategory, setNewSlideCategory] = useState('all');
  const [newSlideImageBase64, setNewSlideImageBase64] = useState('');
  const [isSubmittingSlide, setIsSubmittingSlide] = useState(false);

  // Modals & Receipts
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState(null);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Fetch live orders
  const fetchAdminOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const list = await ordersApi.getAll();
      setAdminOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.debug('Admin orders sync notice:', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch live registered users
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

  // Fetch products
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

  // Fetch slides
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

  // Fetch dashboard stats
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res && typeof res === 'object') {
        setDashboardStats(res);
      }
    } catch (err) {
      console.debug('Admin dashboard sync notice:', err.message);
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

  // Handlers
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
        image: newProdImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
      });
      setNewProdName('');
      setNewProdPrice('');
      setNewProdOriginalPrice('');
      setShowAddProdForm(false);
      fetchAdminProducts();
      showToast('محصول جدید با موفقیت اضافه شد.', 'success');
    } catch (err) {
      showToast('خطا در افزودن محصول: ' + err.message, 'error');
    } finally {
      setIsSubmittingProd(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
    try {
      await deleteProduct(id);
      fetchAdminProducts();
      showToast('محصول با موفقیت حذف شد.', 'success');
    } catch (err) {
      showToast('خطا در حذف محصول', 'error');
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlideTitle.trim()) {
      showToast('لطفاً عنوان اسلاید را وارد نمایید.', 'error');
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
        image: newSlideImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
      });
      setNewSlideTitle('');
      setNewSlideSubtitle('');
      setNewSlideDesc('');
      setShowAddSlideForm(false);
      fetchAdminSlides();
      showToast('اسلاید جدید با موفقیت اضافه شد.', 'success');
    } catch (err) {
      showToast('خطا در افزودن اسلاید', 'error');
    } finally {
      setIsSubmittingSlide(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;
    try {
      await deleteSlide(id);
      fetchAdminSlides();
      showToast('اسلاید با موفقیت حذف شد.', 'success');
    } catch (err) {
      showToast('خطا در حذف اسلاید', 'error');
    }
  };

  const handleVerifyReceipt = async (orderId, approved) => {
    try {
      await ordersApi.verifyPayment(orderId, { approved });
      showToast(approved ? 'فیش بانکی تایید شد.' : 'فیش بانکی رد شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در بررسی فیش بانکی', 'error');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, { status: newStatus });
      showToast('وضعیت سفارش بروزرسانی شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در بروزرسانی وضعیت سفارش', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) return;
    try {
      await ordersApi.delete(orderId);
      showToast('سفارش با موفقیت حذف شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در حذف سفارش', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      await adminApi.deleteUser(userId);
      showToast('کاربر با موفقیت حذف شد.', 'success');
      fetchAdminUsers();
    } catch (err) {
      showToast('خطا در حذف کاربر', 'error');
    }
  };

  const handleUpdateUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUserRole(userId, nextRole);
      showToast('نقش کاربر بروزرسانی شد.', 'success');
      fetchAdminUsers();
    } catch (err) {
      try {
        await adminApi.updateUser(userId, { role: nextRole, isAdmin: nextRole === 'admin' });
        showToast('نقش کاربر بروزرسانی شد.', 'success');
        fetchAdminUsers();
      } catch (subErr) {
        showToast('خطا در تغییر نقش کاربر', 'error');
      }
    }
  };

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
          <p className={styles.pageSubtitle}>مدیریت کامل سفارش‌ها، محصولات، اسلایدرها و کاربران متصل به وب‌سرویس</p>
        </div>
        <div className={styles.flexRow}>
          <button
            type="button"
            className={styles.backButton}
            onClick={refreshAllAdminData}
            title="تازه‌سازی اطلاعات"
            disabled={isLoadingAll}
          >
            <RefreshCw size={15} className={isLoadingAll ? styles.spinner : ''} />
            بروزرسانی داده‌ها
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/profile')} title="حساب من">
            <Users size={15} />
            حساب من
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')} title="فروشگاه">
            <ArrowRight size={15} />
            فروشگاه
          </button>
        </div>
      </header>

      {/* Overview Stats Component */}
      <AdminOverview
        stats={dashboardStats}
        adminOrders={adminOrders}
        products={products}
        sliders={sliders}
        adminUsers={adminUsers}
      />

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

      {/* تب‌ها */}
      {activeTab === 'overview' && (
        <AdminOrders
          adminOrders={adminOrders}
          isLoadingOrders={isLoadingOrders}
          fetchAdminOrders={fetchAdminOrders}
          orderSearchQuery={orderSearchQuery}
          setOrderSearchQuery={setOrderSearchQuery}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          getOrderStatusInfo={getOrderStatusInfo}
          setPreviewReceiptUrl={setPreviewReceiptUrl}
          handleVerifyReceipt={handleVerifyReceipt}
          setEditingTrackingOrderId={setEditingTrackingOrderId}
          setTrackingCodeInput={setTrackingCodeInput}
          setAdminNoteInput={setAdminNoteInput}
          handleUpdateStatus={handleUpdateStatus}
          handleDeleteOrder={handleDeleteOrder}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          productSearchQuery={productSearchQuery}
          setProductSearchQuery={setProductSearchQuery}
          showAddProdForm={showAddProdForm}
          setShowAddProdForm={setShowAddProdForm}
          handleAddProduct={handleAddProduct}
          newProdName={newProdName}
          setNewProdName={setNewProdName}
          newProdPrice={newProdPrice}
          setNewProdPrice={setNewProdPrice}
          newProdOriginalPrice={newProdOriginalPrice}
          setNewProdOriginalPrice={setNewProdOriginalPrice}
          newProdDiscount={newProdDiscount}
          setNewProdDiscount={setNewProdDiscount}
          newProdCategory={newProdCategory}
          setNewProdCategory={setNewProdCategory}
          newProdWeight={newProdWeight}
          setNewProdWeight={newProdWeight}
          newProdStock={newProdStock}
          setNewProdStock={newProdStock}
          newProdDesc={newProdDesc}
          setNewProdDesc={setNewProdDesc}
          newProdImageBase64={newProdImageBase64}
          setNewProdImageBase64={setNewProdImageBase64}
          isSubmittingProd={isSubmittingProd}
          openEditProductModal={(p) => showToast('ویرایش محصول فعال است', 'info')}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === 'slides' && (
        <AdminSlides
          sliders={sliders}
          showAddSlideForm={showAddSlideForm}
          setShowAddSlideForm={setShowAddSlideForm}
          handleAddSlide={handleAddSlide}
          newSlideTitle={newSlideTitle}
          setNewSlideTitle={setNewSlideTitle}
          newSlideSubtitle={newSlideSubtitle}
          setNewSlideSubtitle={setNewSlideSubtitle}
          newSlideDesc={newSlideDesc}
          setNewSlideDesc={setNewSlideDesc}
          newSlideCta={newSlideCta}
          setNewSlideCta={newSlideCta}
          newSlideCategory={newSlideCategory}
          setNewSlideCategory={setNewSlideCategory}
          newSlideImageBase64={newSlideImageBase64}
          setNewSlideImageBase64={setNewSlideImageBase64}
          isSubmittingSlide={isSubmittingSlide}
          openEditSlideModal={(s) => showToast('ویرایش اسلاید فعال است', 'info')}
          handleDeleteSlide={handleDeleteSlide}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsers
          adminUsers={adminUsers}
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          setShowAddUserModal={() => showToast('افزودن کاربر جدید', 'info')}
          handleDeleteUser={handleDeleteUser}
          handleUpdateUserRole={handleUpdateUserRole}
        />
      )}

      {/* Modal for Receipt Preview */}
      {previewReceiptUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1C3A27' }}>تصویر فیش واریزی</h3>
            <img src={previewReceiptUrl} alt="فیش بانکی" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }} />
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setPreviewReceiptUrl(null)}
            >
              بستن تصویر
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export { Admin };
