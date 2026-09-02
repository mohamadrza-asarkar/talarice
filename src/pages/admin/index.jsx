import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  ArrowRight,
  LayoutGrid,
  TrendingUp,
  Clock,
  ExternalLink,
  Award,
  ShieldCheck,
  KeyRound,
  LogOut
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { OverviewTab } from './OverviewTab';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { UsersTab } from './UsersTab';
import { SlidersTab } from './SlidersTab';
import { AdminAuthModal } from './AdminAuthModal';
import { HealthStatusIndicator } from '../../components/healthStatus';
import styles from './style.module.css';

export function AdminPage() {
  const navigate = useNavigate();
  const {
    products,
    orders,
    heroSlides,
    users,
    usersCount,
    serverHealth,
    checkHealth,
    currentUser,
    isAdmin,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const actualUsersCount = typeof usersCount === 'number' ? usersCount : (users?.length || 1);

  // Tab configurations
  const navItems = [
    { id: 'overview', label: 'داشبورد و آمار تحلیلی', icon: LayoutDashboard },
    { id: 'products', label: 'محصولات و انبارداری', icon: Package, count: products.length },
    { id: 'orders', label: 'سفارشات و رهگیری پستی', icon: ShoppingBag, count: orders.length },
    { id: 'users', label: 'کاربران و مشتریان', icon: Users, count: actualUsersCount },
    { id: 'sliders', label: 'ویترین و اسلایدرها', icon: ImageIcon, count: heroSlides.length },
  ];

  const todayPersian = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  if (!isAdmin) {
    return (
      <div className={styles.adminLayout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>عدم دسترسی به پنل مدیریت</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            برای مشاهده این بخش نیاز به ورود با حساب کاربری مدیر ارشد دارید.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={{ background: '#042a1b', color: '#fef08a', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ورود با حساب مدیریت
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
            >
              صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderRight}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.mobileBackBtn}
            aria-label="بازگشت به فروشگاه"
            title="بازگشت به فروشگاه"
          >
            <ArrowRight size={18} />
            <span>فروشگاه</span>
          </button>
          <div className={styles.mobileHeaderBrand}>
            <img src={logoImg} alt="طلا رایس" className={styles.mobileLogo} />
            <span className={styles.mobileTitle}>پنل مدیریت</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={styles.mobileMenuBtn}
          aria-label="باز کردن منو"
        >
          <LayoutGrid size={22} />
        </button>
      </header>

      {/* Elegant Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.brandArea}>
          <img src={logoImg} alt="لوگوی طلا رایس" className={styles.sidebarLogo} />
          <div>
            <h2 className={styles.brandTitle}>طلا رایس</h2>
            <span className={styles.brandBadge}>سامانه مدیریت و وب‌سرویس</span>
          </div>
        </div>

        <nav className={styles.navList}>
          <div className={styles.navLabel}>بخش‌های مدیریتی</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className={styles.navBadge}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Admin Profile & Auth Status */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfoCard}>
            <div className={styles.userAvatar}>
              {(currentUser?.name || 'م')[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p className={styles.userName}>{currentUser?.name || 'مدیر سیستم'}</p>
              <p className={styles.userRole}>
                {isAdmin ? 'مدیر ارشد طلا رایس' : 'کاربر عادی (بدون دسترسی)'}
              </p>
            </div>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: '#d4af37',
                  border: 'none',
                  color: '#042a1b',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.4rem',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 900
                }}
                title="ورود با دسترسی مدیریت"
              >
                لاگین
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            <ArrowRight size={17} />
            <span>مشاهده فروشگاه اصلی</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Top Banner Greeting */}
          <div className={styles.topBar}>
            <div className={styles.topBarGreeting}>
              <h1 className={styles.topBarTitle}>
                <span>سامانه مدیریت متمرکز طلا رایس</span>
                <span style={{ fontSize: '1.1rem' }}>🌾</span>
              </h1>
              <p className={styles.topBarDate}>
                <span>امروز: </span>
                <strong>{todayPersian}</strong>
                <span style={{ marginRight: '0.75rem', opacity: 0.8 }}>| سرور مرکزی شیراز و مزارع کامفیروز</span>
              </p>
            </div>

            <div className={styles.topBarActions}>
              <HealthStatusIndicator health={serverHealth} onRetry={checkHealth} />
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className={styles.liveStoreBtn}
                style={{ background: '#042a1b', color: '#fef08a', border: '1px solid #d4af37' }}
              >
                <ShieldCheck size={16} color="#d4af37" />
                <span>{isAdmin ? 'احراز هویت: مدیر ارشد' : 'ورود به حساب مدیریت'}</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === 'overview' && <OverviewTab onNavigateTab={tab => setActiveTab(tab)} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'sliders' && <SlidersTab />}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Authentication & Lock Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default AdminPage;
