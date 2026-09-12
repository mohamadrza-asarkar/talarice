import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { adminApi, ordersApi, productsApi } from '../services/api';
import styles from './pages.module.css';

export default function Admin() {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    deleteProduct,
    orders,
    setOrders,
    updateOrderStatus,
    deleteOrder,
    users,
    getOrderStatusInfo,
    showSuccess,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'users', 'status'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

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

  // Postal tracking modal / state
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState(null);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Receipt preview
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);

  // Fetch admin dashboard stats
  const fetchDashboard = async () => {
    setIsLoadingStats(true);
    try {
      const res = await adminApi.getDashboard();
      if (res?.data) {
        setDashboardStats(res.data);
      }
    } catch (err) {
      console.debug('Dashboard stats fallback note:', err.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalRevenue = dashboardStats?.totalRevenue ?? orders.reduce(
    (sum, o) => sum + (Number(o.finalAmount || o.totalPrice) || 0),
    0
  );

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

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
  };

  const handleUpdateShipping = async (orderId) => {
    if (!trackingCodeInput.trim()) {
      showToast('لطفاً کد رهگیری پستی را وارد کنید.', 'error');
      return;
    }
    await updateOrderStatus(orderId, 'ارسال شده', trackingCodeInput.trim(), adminNoteInput.trim());
    setEditingTrackingOrderId(null);
    setTrackingCodeInput('');
    setAdminNoteInput('');
  };

  const handleVerifyReceipt = async (orderId, isApproved) => {
    try {
      await ordersApi.verifyPayment(orderId, {
        status: isApproved ? 'approved' : 'rejected',
        state: isApproved ? 'processing' : 'cancelled',
        adminNote: isApproved ? 'فیش بانکی تایید شد' : 'فیش نامعتبر است'
      });
      showSuccess(isApproved ? 'فیش پرداخت تایید و وضعیت به در حال پردازش تغییر یافت.' : 'فیش پرداخت رد شد.');
      // update local
      setOrders((prev) =>
        prev.map((o) =>
          (o.id === orderId || o._id === orderId)
            ? { ...o, paymentStatus: isApproved ? 'approved' : 'rejected', status: isApproved ? 'در حال پردازش' : 'لغو شده' }
            : o
        )
      );
    } catch (err) {
      showToast('خطا در ثبت وضعیت پرداخت: ' + err.message, 'error');
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>پنل مدیریت طلا رایس</h1>
          <p className={styles.pageSubtitle}>مدیریت محصولات، سفارش‌ها و آمار وب‌سرویس</p>
        </div>
        <div className={styles.flexRow}>
          <button type="button" className={styles.backButton} onClick={fetchDashboard} title="تازه‌سازی آمار">
            <RefreshCw size={15} />
            بروزرسانی
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/profile')}>
            <ArrowRight size={15} />
            پروفایل
          </button>
        </div>
      </header>

      {/* آمار سریع منطبق با متد dashboard API */}
      <section className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>فروش کل</span>
          <span className={styles.statValue}>{totalRevenue.toLocaleString('fa-IR')} تومان</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>سفارش‌ها (مجموع)</span>
          <span className={styles.statValue}>
            {(dashboardStats?.totalOrders ?? orders.length).toLocaleString('fa-IR')}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>تعداد ارقام برنج</span>
          <span className={styles.statValue}>
            {(dashboardStats?.totalProducts ?? products.length).toLocaleString('fa-IR')}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>کاربران سیستم</span>
          <span className={styles.statValue}>
            {(dashboardStats?.totalUsers ?? users.length).toLocaleString('fa-IR')}
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
          سفارشات ({orders.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          محصولات ({products.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          کاربران ({users.length})
        </button>
      </nav>

      {/* تب ۱: سفارشات و فیش‌های بانکی */}
      {activeTab === 'overview' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>لیست سفارشات و کدهای رهگیری پستی</h2>
          </div>

          <div className={styles.flexCol}>
            {orders.length === 0 ? (
              <p className={styles.label}>هنوز سفارشی ثبت نشده است.</p>
            ) : (
              orders.map((order) => {
                const status = getOrderStatusInfo(order.status || order.state);
                const orderId = order._id || order.id;

                return (
                  <div key={orderId} className={styles.statBox}>
                    <div className={styles.pageHeader}>
                      <div>
                        <strong className={styles.pageTitle}>
                          {order.postTrackingCode || order.trackingCode}
                        </strong>
                        <p className={styles.pageSubtitle}>
                          خریدار: {order.customerName || order.name} ({order.customerPhone || order.phone})
                        </p>
                        <small className={styles.label}>
                          نشانی: {order.customerAddress || order.address || 'ثبت نشده'}
                        </small>
                      </div>
                      <span className={styles.badge}>{status.label}</span>
                    </div>

                    {/* لیست اقلام سفارش */}
                    <div className={styles.flexCol}>
                      {(order.items || order.products || []).map((item, idx) => (
                        <span key={idx} className={styles.label}>
                          • {item.name} × {item.quantity} عدد
                        </span>
                      ))}
                    </div>

                    {/* فیش واریزی در صورت وجود */}
                    {(order.paymentReceipt || order.receiptImage) && (
                      <div className={styles.receiptPreviewBox} style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className={styles.backButton}
                          onClick={() => setPreviewReceiptUrl(order.paymentReceipt || order.receiptImage)}
                        >
                          <Eye size={14} />
                          مشاهده فیش واریزی
                        </button>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => handleVerifyReceipt(orderId, true)}
                        >
                          <CheckCircle2 size={13} />
                          تایید پرداخت
                        </button>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => handleVerifyReceipt(orderId, false)}
                        >
                          <XCircle size={13} />
                          رد فیش
                        </button>
                      </div>
                    )}

                    {/* بخش رهگیری پستی */}
                    {editingTrackingOrderId === orderId ? (
                      <div className={styles.cardHighlight} style={{ margin: '0.5rem 0' }}>
                        <label className={styles.label}>کد مرسوله پستی ۲۴ رقمی:</label>
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
                          >
                            ثبت کد پستی و ارسال
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

                    <div className={styles.pageHeader}>
                      <span className={styles.currentPrice}>
                        {(order.finalAmount || order.totalPrice || 0).toLocaleString('fa-IR')} تومان
                      </span>

                      {/* تغییر وضعیت */}
                      <div className={styles.flexRow}>
                        <button
                          type="button"
                          className={styles.backButton}
                          title="ثبت کد مرسوله پستی"
                          onClick={() => {
                            setEditingTrackingOrderId(orderId);
                            setTrackingCodeInput(order.postTrackingCode || '');
                          }}
                        >
                          <Truck size={14} />
                          کد پستی
                        </button>

                        <select
                          className={styles.select}
                          value={order.status || order.state}
                          onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                        >
                          <option value="در حال پردازش">در حال پردازش</option>
                          <option value="ارسال شده">ارسال شده (تحویل پست)</option>
                          <option value="تحویل شده">تحویل شده</option>
                          <option value="لغو شده">لغو شده</option>
                        </select>

                        <button
                          type="button"
                          className={styles.btnDanger}
                          onClick={() => deleteOrder(orderId)}
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
            <h2 className={styles.pageTitle}>مدیریت محصولات برنج</h2>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={16} />
              {showAddForm ? 'بستن فرم' : 'افزودن برنج جدید'}
            </button>
          </div>

          {/* فرم افزودن برنج جدید با Base64 */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} className={styles.cardHighlight}>
              <h3 className={styles.pageTitle}>مشخصات برنج جدید</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>نام رقم برنج:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: برنج طارم هاشمی ممتاز کشت اول"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>قیمت فروش (تومان):</label>
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
                <label className={styles.label}>قیمت خط‌خورده / قبل تخفیف (اختیاری):</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="مثال: 490000"
                  value={newProdOriginalPrice}
                  onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>درصد تخفیف شگفت‌انگیز (%):</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="مثال: 10"
                  value={newProdDiscount}
                  onChange={(e) => setNewProdDiscount(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>دسته‌بندی:</label>
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
                <label className={styles.label}>موجودی انبار (تعداد کیسه):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                />
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
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.4rem' }}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات کوتاه محصول:</label>
                <textarea
                  className={styles.textarea}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="ویژگی‌ها، عطر، پخت و ری‌دهی"
                />
              </div>

              <button type="submit" className={styles.btnPrimary}>
                ثبت و انتشار محصول در وب‌سرویس
              </button>
            </form>
          )}

          {/* فهرست محصولات */}
          <div className={styles.flexCol}>
            {products.map((product) => (
              <div key={product._id || product.id} className={styles.statBox}>
                <div className={styles.pageHeader}>
                  <div className={styles.flexRow}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productThumb}
                    />
                    <div>
                      <strong className={styles.pageTitle}>{product.name}</strong>
                      <p className={styles.pageSubtitle}>
                        {product.price.toLocaleString('fa-IR')} تومان
                        {product.discountPercent > 0 && ` (${product.discountPercent}% تخفیف)`}
                      </p>
                      <small className={styles.label}>موجودی: {product.stock} گونی</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={() => deleteProduct(product._id || product.id)}
                  >
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* تب ۳: کاربران */}
      {activeTab === 'users' && (
        <section className={styles.card}>
          <h2 className={styles.pageTitle}>کاربران ثبت‌نام شده در سامانه</h2>
          <div className={styles.flexCol}>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716c' }}>
                <Users size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                <p>هنوز کاربری در سامانه ثبت‌نام نکرده است.</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user._id || user.id} className={styles.statBox}>
                  <div className={styles.pageHeader}>
                    <div>
                      <strong className={styles.pageTitle}>{user.name}</strong>
                      <p className={styles.pageSubtitle}>تلفن: {user.phone} | ایمیل: {user.email || 'ثبت نشده'}</p>
                    </div>
                    <span className={styles.badge}>
                      {user.role === 'admin' ? 'مدیر سیستم' : 'مشتری عادی'}
                    </span>
                  </div>
                  <span className={styles.label}>آدرس: {user.address || 'ثبت نشده'}</span>
                </div>
              ))
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
              padding: '1rem',
              borderRadius: '16px',
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: 'auto',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0' }}>تصویر فیش بانکی</h3>
            <img
              src={previewReceiptUrl}
              alt="فیش پرداخت"
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setPreviewReceiptUrl(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export { Admin };
