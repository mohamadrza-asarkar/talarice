import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { activeTab, setActiveTab, cartCount, setIsCartOpen } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'خانه',
      iconClass: 'fa-solid fa-house'
    },
    {
      id: 'catalog',
      label: 'محصولات',
      iconClass: 'fa-solid fa-wheat-awn'
    },
    {
      id: 'recipes',
      label: 'طرز پخت',
      iconClass: 'fa-solid fa-book-open'
    },
    {
      id: 'profile',
      label: 'پروفایل',
      iconClass: 'fa-solid fa-user'
    }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#d4af37]/30 shadow-lg ${styles.bottomNav}`}>
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#073b27] font-black scale-105'
                  : 'text-gray-400 hover:text-[#073b27]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-[#073b27] to-[#136f46] text-[#fef08a] shadow-md border border-[#d4af37]'
                    : 'text-gray-500'
                }`}
              >
                <i className={`${item.iconClass} text-sm`} />
              </div>
              <span className="text-[10px] mt-1 font-bold">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-16 py-1 text-gray-500 hover:text-[#073b27] transition-all"
        >
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-[#f0fdf4] text-[#073b27] border border-[#d4af37]/40 shadow-sm">
            <i className="fa-solid fa-cart-shopping text-sm" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#073b27] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold">سبد خرید</span>
        </button>
      </div>
    </nav>
  );
};
