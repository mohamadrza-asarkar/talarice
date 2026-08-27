import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Package, ShoppingBag, Users, Image as ImageIcon, BookOpen, ArrowRight, Store, LayoutGrid } from 'lucide-react';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { UsersTab } from './UsersTab';
import { SlidersTab } from './SlidersTab';
import { BlogTab } from './BlogTab';
import styles from './style.module.css';

export const AdminPage = () => {
  const { isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/" replace />;

  const navItems = [
    { id: 'products', label: 'محصولات', icon: Package },
    { id: 'orders', label: 'سفارشات', icon: ShoppingBag },
    { id: 'sliders', label: 'اسلایدرها', icon: ImageIcon },
    { id: 'blog', label: 'وبلاگ', icon: BookOpen },
    { id: 'users', label: 'مشتریان', icon: Users },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderBrand}>
          <div className={styles.mobileIcon}>
            <Store size={20} />
          </div>
          <span className={styles.mobileTitle}>مدیریت</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuBtn}>
          <LayoutGrid size={24} />
        </button>
      </div>

      {/* Elegant Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.brandArea}>
          <div className={styles.brandIcon}>
            <Store size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className={styles.brandTitle}>طلا رایس</h2>
            <p className={styles.brandBadge}>پنل مدیریت یکپارچه</p>
          </div>
        </div>

        <nav className={styles.navList}>
          <div className={styles.navLabel}>منوی اصلی</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.backButton}>
            <ArrowRight size={18} />
            بازگشت به فروشگاه
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'sliders' && <SlidersTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className={styles.backdrop}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
