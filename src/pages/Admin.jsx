import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { adminApi, ordersApi, productsApi, slidesApi, reviewsApi, amazingProductsApi, normalizePhone } from '../api';
import { AdminOverview } from '../components/admin/adminOverview';
import { AdminProducts } from '../components/admin/adminProducts';
import { AdminOrders } from '../components/admin/adminOrders';
import { AdminUsers } from '../components/admin/adminUsers';
import { AdminSlides } from '../components/admin/adminSlides';
import { AdminDeals } from '../components/admin/adminDeals';
import { AdminReviews } from '../components/admin/adminReviews';
import styles from '../components/admin/admin.module.css';

export default function Admin() {
  const navigate = useNavigate();
  const {
    products,
    setProducts,
    sliders,
    setSliders,
    amazingProducts,
    setAmazingProducts,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load admin data on mount
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ordersRes, usersRes, reviewsRes] = await Promise.allSettled([
        adminApi.getOrders(),
        adminApi.getUsers(),
        reviewsApi.getAll()
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setAdminOrders(ordersRes.value);
      }
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
        setAdminUsers(usersRes.value);
      }
      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) {
        setReviews(reviewsRes.value);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Product Actions
  const handleAddProduct = async (productData) => {
    try {
      const created = await productsApi.create(productData);
      setProducts((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
      showToast('محصول جدید با موفقیت اضافه شد.', 'success');
    } catch {
      showToast('خطا در افزودن محصول', 'error');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const updated = await productsApi.update(id, productData);
      setProducts((prev) =>
        prev.map((p) => ((p.id || p._id) === id ? { ...p, ...updated } : p))
      );
      showToast('محصول با موفقیت ویرایش شد.', 'success');
    } catch {
      showToast('خطا در ویرایش محصول', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      showToast('محصول با موفقیت حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف محصول', 'error');
    }
  };

  // Slide Actions
  const handleAddSlide = async (slideData) => {
    try {
      const created = await slidesApi.create(slideData);
      setSliders((prev) => [...(Array.isArray(prev) ? prev : []), created]);
      showToast('اسلاید جدید ثبت شد.', 'success');
    } catch {
      showToast('خطا در ثبت اسلاید', 'error');
    }
  };

  const handleUpdateSlide = async (id, slideData) => {
    try {
      const updated = await slidesApi.update(id, slideData);
      setSliders((prev) =>
        prev.map((s) => ((s.id || s._id) === id ? { ...s, ...updated } : s))
      );
      showToast('اسلاید ویرایش شد.', 'success');
    } catch {
      showToast('خطا در ویرایش اسلاید', 'error');
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      await slidesApi.delete(id);
      setSliders((prev) => prev.filter((s) => (s.id || s._id) !== id));
      showToast('اسلاید حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف اسلاید', 'error');
    }
  };

  // User Actions
  const handleAddUser = async (userData) => {
    try {
      const phoneNorm = normalizePhone(userData.phone);
      const created = await adminApi.createUser({ ...userData, phone: phoneNorm });
      setAdminUsers((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
      showToast('کاربر جدید با موفقیت ثبت شد.', 'success');
    } catch {
      showToast('خطا در ثبت کاربر', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setAdminUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      showToast('کاربر با موفقیت حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف کاربر', 'error');
    }
  };

  const handleUpdateUserRole = async (id, currentRole) => {
    try {
      const nextRole = currentRole === 'admin' ? 'user' : 'admin';
      await adminApi.updateUserRole(id, nextRole);
      setAdminUsers((prev) =>
        prev.map((u) => ((u.id || u._id) === id ? { ...u, role: nextRole } : u))
      );
      showToast('نقش کاربر به‌روزرسانی شد.', 'success');
    } catch {
      showToast('خطا در تغییر نقش کاربر', 'error');
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status);
      setAdminOrders((prev) =>
        prev.map((o) => ((o.id || o._id) === id ? { ...o, status } : o))
      );
      showToast('وضعیت سفارش تغییر کرد.', 'success');
    } catch {
      showToast('خطا در تغییر وضعیت سفارش', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await ordersApi.delete(id);
      setAdminOrders((prev) => prev.filter((o) => (o.id || o._id) !== id));
      showToast('سفارش حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف سفارش', 'error');
    }
  };

  // Deal Actions
  const handleAddDeal = async (dealData) => {
    try {
      await amazingProductsApi.add(dealData);
      const selected = products.find((p) => (p.id || p._id) === dealData.productId);
      if (selected) {
        setAmazingProducts((prev) => [...prev, { ...selected, ...dealData }]);
      }
      showToast('محصول به شگفت‌انگیز اضافه شد.', 'success');
    } catch {
      showToast('خطا در افزودن پیشنهاد شگفت‌انگیز', 'error');
    }
  };

  const handleRemoveDeal = async (id) => {
    try {
      await amazingProductsApi.remove(id);
      setAmazingProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      showToast('محصول از شگفت‌انگیز حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف از شگفت‌انگیز', 'error');
    }
  };

  // Review Actions
  const handleDeleteReview = async (id) => {
    try {
      await reviewsApi.delete(id);
      setReviews((prev) => prev.filter((r) => (r.id || r._id) !== id));
      showToast('نظر با موفقیت حذف شد.', 'success');
    } catch {
      showToast('خطا در حذف نظر', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>داشبورد مدیریت طلا رایس</h1>
          <p className={styles.subtitle}>کنترل کامل موجودی، سفارشات، کاربران و جشنواره‌ها</p>
        </div>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => navigate('/')}
        >
          <ArrowRight size={16} />
          <span>بازگشت به فروشگاه</span>
        </button>
      </header>

      {/* Tabs Bar */}
      <nav className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} />
          <span>گزارش کلی</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          <span>محصولات</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} />
          <span>سفارشات</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'slides' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <Layers size={16} />
          <span>اسلایدر</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>کاربران</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'deals' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          <Sparkles size={16} />
          <span>شگفت‌انگیزها</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} />
          <span>نظرات</span>
        </button>
      </nav>

      {/* Active Tab View */}
      {activeTab === 'overview' && (
        <AdminOverview
          adminOrders={adminOrders}
          products={products}
          sliders={sliders}
          adminUsers={adminUsers}
          onTabChange={setActiveTab}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === 'orders' && (
        <AdminOrders
          adminOrders={adminOrders}
          isLoadingOrders={isLoading}
          onRefreshOrders={loadInitialData}
          onUpdateStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
        />
      )}

      {activeTab === 'slides' && (
        <AdminSlides
          sliders={sliders}
          onAddSlide={handleAddSlide}
          onUpdateSlide={handleUpdateSlide}
          onDeleteSlide={handleDeleteSlide}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsers
          adminUsers={adminUsers}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
          onUpdateRole={handleUpdateUserRole}
        />
      )}

      {activeTab === 'deals' && (
        <AdminDeals
          amazingProducts={amazingProducts}
          allProducts={products}
          onAddDeal={handleAddDeal}
          onRemoveDeal={handleRemoveDeal}
        />
      )}

      {activeTab === 'reviews' && (
        <AdminReviews
          reviews={reviews}
          onDeleteReview={handleDeleteReview}
        />
      )}
    </div>
  );
}
