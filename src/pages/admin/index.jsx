import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { 
  Package, ShoppingBag, Users, Image as ImageIcon, BookOpen, 
  ArrowRight, Store, Search, LayoutGrid, BarChart3, 
  LogOut, Bell, ShieldCheck, RefreshCw, Trash2, PlusCircle,
  ExternalLink, Sparkles, CheckCircle2
} from 'lucide-react';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { UsersTab } from './UsersTab';
import { SlidersTab } from './SlidersTab';
import { BlogTab } from './BlogTab';
import { AdminLogin } from './AdminLogin';
import API from '../../api/client';

export const AdminPage = () => {
  const { isAdmin, user, logout, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSliders: 0,
    pendingOrders: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const res = await API.get('/admin/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin, activeTab]);

  const handleResetData = async () => {
    if (!window.confirm('آیا از پاکسازی تمام محصولات، سفارشات و مقالات اطمینان دارید؟ داده‌ها کاملاً خالی خواهند شد.')) {
      return;
    }
    try {
      const res = await API.post('/admin/reset-data', {});
      if (res.success) {
        showToast('تمامی داده‌ها با موفقیت پاکسازی شدند');
        fetchDashboardStats();
        if (refreshData) refreshData();
      }
    } catch (e) {
      alert('خطا در پاکسازی داده‌ها');
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await API.post('/admin/seed-data', {});
      if (res.success) {
        showToast('دیتای نمونه اولیه با موفقیت ثبت شد');
        fetchDashboardStats();
        if (refreshData) refreshData();
      }
    } catch (e) {
      alert('خطا در ثبت دیتای نمونه');
    }
  };

  if (!isAdmin) return <AdminLogin />;

  const navItems = [
    { id: 'products', label: 'مدیریت محصولات', icon: Package, badge: stats.totalProducts },
    { id: 'orders', label: 'سفارش‌ها و مرسولات', icon: ShoppingBag, badge: stats.pendingOrders ? `${stats.pendingOrders} جدید` : stats.totalSales },
    { id: 'sliders', label: 'اسلایدر و بنرها', icon: ImageIcon, badge: stats.totalSliders },
    { id: 'blog', label: 'وبلاگ و آموزش', icon: BookOpen },
    { id: 'users', label: 'مشتریان و کاربران', icon: Users, badge: stats.totalUsers },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#042a1b] text-[#d4af37] border border-[#d4af37]/40 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-[#d4af37]" />
          <span className="text-sm font-bold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Navigation */}
      <header className="md:hidden bg-[#042a1b] border-b border-[#d4af37]/20 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center text-[#042a1b] font-black text-lg">
            🌾
          </div>
          <div>
            <span className="font-black text-white text-base tracking-tight block">پنل مدیریت طلا رایس</span>
            <span className="text-[10px] text-[#d4af37] font-semibold">سامانه کنترل یکپارچه</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[#d4af37] transition-colors"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      {/* Sleek Dark Emerald Sidebar */}
      <aside className={`
        fixed md:sticky top-0 right-0 z-40
        w-80 h-screen bg-[#042a1b] border-l border-[#d4af37]/15
        transition-all duration-300 ease-out
        flex flex-col justify-between
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0 md:shadow-none'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-amber-200 flex items-center justify-center text-[#042a1b] shadow-inner font-black text-2xl">
                🌾
              </div>
              <div>
                <h1 className="font-black text-xl text-white tracking-tight">طلا رایس</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-[#d4af37]">پنل مدیریت فروشگاه</span>
                </div>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white/60 hover:text-white p-2"
            >
              ✕
            </button>
          </div>

          {/* Quick Actions in Sidebar */}
          <div className="px-5 pt-4 pb-2">
            <div className="p-3.5 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
              <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-2">
                <span>تست و مدیریت دیتا:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetData}
                  className="px-2.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  title="پاکسازی کامل داده‌ها برای شروع از صفر"
                >
                  <Trash2 size={13} />
                  پاکسازی کل
                </button>
                <button
                  onClick={handleSeedData}
                  className="px-2.5 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-[#d4af37] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  title="بارگذاری دیتای تستی"
                >
                  <Sparkles size={13} />
                  دیتای نمونه
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-white/40 px-3 pb-2 uppercase tracking-wider">
              بخش‌های اصلی پنل
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm group
                    ${isActive 
                      ? 'bg-gradient-to-l from-[#d4af37] to-amber-400 text-[#042a1b] font-black shadow-md' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={19} className={isActive ? 'text-[#042a1b]' : 'text-white/50 group-hover:text-[#d4af37] transition-colors'} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black
                      ${isActive ? 'bg-[#042a1b] text-[#d4af37]' : 'bg-white/10 text-white/80 group-hover:bg-[#d4af37]/20 group-hover:text-[#d4af37]'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile & Store Link */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37] text-[#042a1b] font-bold flex items-center justify-center text-sm">
                {user?.name ? user.name[0] : 'م'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-white truncate">{user?.name || 'مدیر کل فروشگاه'}</div>
                <div className="text-[10px] text-[#d4af37] font-semibold">دسترسی ادمین</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="خروج از حساب مدیریت"
            >
              <LogOut size={16} />
            </button>
          </div>

          <a 
            href="/" 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#d4af37] text-xs font-bold transition-all border border-white/5"
          >
            <span>مشاهده ویترین فروشگاه</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-4 justify-between items-center sticky top-0 z-30 shadow-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>وضعیت سرور: فعال و آنلاین</span>
            </div>
            <button
              onClick={fetchDashboardStats}
              className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              title="بروزرسانی آمار"
            >
              <RefreshCw size={15} className={loadingStats ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Trash2 size={14} />
              پاکسازی دیتا
            </button>
            <button
              onClick={handleSeedData}
              className="px-3.5 py-2 bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles size={14} />
              افزودن دیتای تستی
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200/60"
            >
              <span>مشاهده سایت</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {activeTab === 'products' && <ProductsTab onUpdate={fetchDashboardStats} showToast={showToast} />}
          {activeTab === 'orders' && <OrdersTab onUpdate={fetchDashboardStats} showToast={showToast} />}
          {activeTab === 'sliders' && <SlidersTab onUpdate={fetchDashboardStats} showToast={showToast} />}
          {activeTab === 'blog' && <BlogTab onUpdate={fetchDashboardStats} showToast={showToast} />}
          {activeTab === 'users' && <UsersTab onUpdate={fetchDashboardStats} showToast={showToast} />}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
