import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Package, ShoppingBag, Users, Image as ImageIcon, BookOpen, ArrowRight, Store, Search, LayoutGrid } from 'lucide-react';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { UsersTab } from './UsersTab';
import { SlidersTab } from './SlidersTab';
import { BlogTab } from './BlogTab';

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Store size={20} />
          </div>
          <span className="font-black text-slate-800 text-lg">مدیریت</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
          <LayoutGrid size={24} />
        </button>
      </div>

      {/* Elegant Sidebar */}
      <aside className={`
        fixed md:sticky top-0 right-0 z-30
        w-72 h-screen bg-white/90 backdrop-blur-2xl border-l border-slate-200/50
        transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
        flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0 md:shadow-none'}
      `}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 transform rotate-3 hover:rotate-6 transition-transform">
            <Store size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-800 tracking-tight">طلا رایس</h2>
            <p className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">پنل مدیریت یکپارچه</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 px-4 mb-4 mt-2">منوی اصلی</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[15px] group
                  ${isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <a href="/" className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm transition-all border border-slate-200/60 hover:border-slate-300 group">
            <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
            بازگشت به فروشگاه
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
        
        <div className="p-4 md:p-10 max-w-7xl mx-auto relative z-10 min-h-full animate-in fade-in duration-700 slide-in-from-bottom-8">
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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
