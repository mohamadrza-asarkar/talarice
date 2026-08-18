import React from 'react';
import { Logo } from '../logo';
import { Search } from '../search';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Header = () => {
  const { cartCount, setIsCartOpen, setActiveTab } = useApp();

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#d4af37]/30 px-4 py-3 shadow-sm ${styles.headerContainer}`}>
      <div className="max-w-md mx-auto space-y-2.5">
        <div className="flex justify-between items-center">
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer"
          >
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('recipes')}
              className="flex items-center gap-1 bg-[#f0fdf4] hover:bg-[#d4af37]/20 text-[#073b27] px-2.5 py-1.5 rounded-xl border border-[#d4af37]/40 text-xs font-black transition-all"
            >
              <i className="fa-solid fa-book-open text-xs text-[#d4af37]" />
              <span className="hidden sm:inline">راهنمای پخت</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-[#073b27] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] text-white hover:text-[#073b27] p-2 rounded-xl transition-all shadow-md flex items-center justify-center w-10 h-10 border border-[#d4af37]"
              aria-label="سبد خرید"
            >
              <i className="fa-solid fa-cart-shopping text-base" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#073b27] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {cartCount.toLocaleString('fa-IR')}
                </span>
              )}
            </button>
          </div>
        </div>

        <Search />
      </div>
    </header>
  );
};
