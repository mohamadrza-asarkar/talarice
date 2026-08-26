import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context';

export function BottomNav() {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#042a1b]/95 backdrop-blur-md border-t border-[#d4af37]/20 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
            path === '/' ? 'text-[#d4af37] font-bold' : 'text-gray-400'
          }`}
        >
          <i className="fa-solid fa-house text-base" />
          <span>خانه</span>
        </Link>

        <Link
          to="/catalog"
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
            path === '/catalog' ? 'text-[#d4af37] font-bold' : 'text-gray-400'
          }`}
        >
          <i className="fa-solid fa-table-cells-large text-base" />
          <span>محصولات</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-xs text-gray-400 relative"
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-base" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span>سبد خرید</span>
        </button>

        <Link
          to="/blog"
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
            path === '/blog' ? 'text-[#d4af37] font-bold' : 'text-gray-400'
          }`}
        >
          <i className="fa-solid fa-book-open text-base" />
          <span>وبلاگ</span>
        </Link>

        <Link
          to={isAuthenticated ? '/profile' : '/auth'}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
            path === '/profile' || path === '/auth' ? 'text-[#d4af37] font-bold' : 'text-gray-400'
          }`}
        >
          <i className="fa-solid fa-user text-base" />
          <span>پروفایل</span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomNav;
