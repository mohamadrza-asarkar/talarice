import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Search = () => {
  const { searchQuery, setSearchQuery, setActiveTab } = useApp();

  const handleFocus = () => {
    setActiveTab('catalog');
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={`relative w-full ${styles.searchWrapper}`}>
      <div className="relative flex items-center">
        <span className="absolute right-3.5 text-[#073b27] pointer-events-none">
          <i className="fa-solid fa-magnifying-glass text-sm" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="جستجوی کیسه برنج ممتاز، نیم‌دانه، ۱۰ کیلویی..."
          className="w-full bg-[#f0fdf4] hover:bg-white focus:bg-white text-xs font-bold text-[#073b27] pr-10 pl-9 py-2.5 rounded-xl border border-[#d4af37]/40 focus:border-[#073b27] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all placeholder:text-[#073b27]/50 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute left-3 text-[#073b27]/60 hover:text-[#073b27] p-1"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};
