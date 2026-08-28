import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import {
  Package,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  LayoutGrid,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { UsersTab } from './UsersTab';
import { SlidersTab } from './SlidersTab';
import { BlogTab } from './BlogTab';
import { HealthStatusIndicator } from '../../components/healthStatus';
import styles from './style.module.css';

export function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, currentUser, products, orders, heroSlides, articles, serverHealth, checkHealth } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/" replace />;

  const navItems = [
    { id: 'products', label: 'محصولات انبار', icon: Package, count: products.length },
    { id: 'orders', label: 'سفارشات', icon: ShoppingBag, count: orders.length },
    { id: 'sliders', label: 'ویترین و اسلایدر', icon: ImageIcon, count: heroSlides.length },
    { id: 'blog', label: 'دانشنامه و مقالات', icon: BookOpen, count: articles.length },
    { id: 'users', label: 'مشتریان و کاربران', icon: Users, count: 5 },
  ];

  // Calculated Stats
  const totalSales = orders.reduce(function (sum, o) {
    return sum + (Number(o.finalAmount || o.totalPrice || 0));
  }, 0);
  const pendingOrders = orders.filter(function (o) { return o.status === 'reviewing' || o.status === 'processing' || o.status === 'pending'; }).length;
  const inStockProducts = products.filter(function (p) { return (p.stock || 0) > 0; }).length;

  const todayPersian = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderRight}>
          <button
            type="button"
            onClick={function () { navigate('/'); }}
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
          onClick={function () { setIsMobileMenuOpen(!isMobileMenuOpen); }}
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
            <span className={styles.brandBadge}>سامانه مدیریت جامع</span>
          </div>
        </div>

        <nav className={styles.navList}>
          <div className={styles.navLabel}>بخش‌های مدیریتی</div>
          {navItems.map(function (item) {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={function () {
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

        {/* Sidebar Footer with Admin Profile & Store Link */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfoCard}>
            <div className={styles.userAvatar}>
              {(currentUser?.name || 'م')[0]}
            </div>
            <div>
              <p className={styles.userName}>{currentUser?.name || 'مدیر سیستم'}</p>
              <p className={styles.userRole}>مدیر ارشد طلا رایس</p>
            </div>
          </div>

          <button
            type="button"
            onClick={function () { navigate('/'); }}
            className={styles.backButton}
          >
            <ArrowRight size={17} />
            <span>بازگشت به فروشگاه</span>
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
                <span>سلام، {currentUser?.name || 'مدیریت گرامی'}</span>
                <span style={{ fontSize: '1.1rem' }}>👋</span>
              </h1>
              <p className={styles.topBarDate}>
                <span>امروز: </span>
                <strong>{todayPersian}</strong>
                <span style={{ marginRight: '0.75rem', opacity: 0.8 }}>| شالیزارهای کامفیروز، مرودشت فارس</span>
              </p>
            </div>

            <div className={styles.topBarActions}>
              <HealthStatusIndicator health={serverHealth} onRetry={checkHealth} />
              <a href="/" className={styles.liveStoreBtn}>
                <ExternalLink size={16} />
                <span>مشاهده سایت فروشگاه</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrap} ${styles.statIconGold}`}>
                <TrendingUp size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>گردش مالی سفارشات</span>
                <span className={styles.statValue}>
                  {(totalSales ?? 0).toLocaleString('fa-IR')} <small style={{ fontSize: '0.7rem', color: '#64748b' }}>تومان</small>
                </span>
                <span className={styles.statSubtitle}>درگاه فعال و متصل</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrap} ${styles.statIconBlue}`}>
                <Clock size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>سفارشات در پردازش</span>
                <span className={styles.statValue}>{pendingOrders} سفارش</span>
                <span className={styles.statSubtitle} style={{ color: pendingOrders > 0 ? '#b45309' : '#059669' }}>
                  {pendingOrders > 0 ? 'نیاز به بسته‌بندی و ارسال' : 'کلیه سفارشات ارسال شده'}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrap} ${styles.statIconGreen}`}>
                <Package size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>محصولات فعال انبار</span>
                <span className={styles.statValue}>{inStockProducts} از {products.length} کالا</span>
                <span className={styles.statSubtitle}>موجودی کیسه‌های نخی اعلا</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrap} ${styles.statIconPurple}`}>
                <Award size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>شاخص رضایت مشتریان</span>
                <span className={styles.statValue}>۵.۰ از ۵.۰</span>
                <span className={styles.statSubtitle}>بر اساس نظرات ثبت‌شده</span>
              </div>
            </div>
          </div>

          {/* Tab Views */}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'sliders' && <SlidersTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={function () { setIsMobileMenuOpen(false); }}
        />
      )}
    </div>
  );
}

export default AdminPage;
