import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { activeTab, setActiveTab, cartCount, setIsCartOpen } = useApp();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-[#042a1b] border-t-2 border-[#d4af37]/50 shadow-2xl ${styles.bottomNav}`}>
      <div className="max-w-md mx-auto grid grid-cols-5 items-center py-2 px-1 text-center">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#fef08a] text-[#073822] shadow-md font-black'
              : 'text-[#d1fae5] hover:text-[#fef08a]'
          }`}
        >
          <i className="fa-solid fa-house text-sm" />
          <span className="text-[10px] mt-0.5 font-black">خانه</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#fef08a] text-[#073822] shadow-md font-black'
              : 'text-[#d1fae5] hover:text-[#fef08a]'
          }`}
        >
          <i className="fa-solid fa-table-cells-large text-sm" />
          <span className="text-[10px] mt-0.5 font-bold">دسته‌بندی</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#d1fae5] hover:text-[#fef08a] relative cursor-pointer"
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-sm" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#fef08a] text-[#073822] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#042a1b]">
                {cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">سبد خرید</span>
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'blog'
              ? 'bg-[#fef08a] text-[#073822] shadow-md font-black'
              : 'text-[#d1fae5] hover:text-[#fef08a]'
          }`}
        >
          <i className="fa-solid fa-book-open text-sm" />
          <span className="text-[10px] mt-0.5 font-bold">بلاگ و آموزش</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#fef08a] text-[#073822] shadow-md font-black'
              : 'text-[#d1fae5] hover:text-[#fef08a]'
          }`}
        >
          <i className="fa-solid fa-user text-sm" />
          <span className="text-[10px] mt-0.5 font-bold">پروفایل</span>
        </button>
      </div>
    </nav>
  );
};
