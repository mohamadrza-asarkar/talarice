import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Search = () => {
  const { searchQuery, setIsSearchOpen } = useApp();

  const handleOpenModal = () => {
    setIsSearchOpen(true);
  };

  return (
    <div className={`relative w-full ${styles.searchWrapper}`}>
      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full bg-white text-xs font-bold text-[#073822] pr-4 pl-10 py-3 rounded-full border-2 border-[#d4af37] shadow-md flex items-center justify-between text-right cursor-pointer hover:border-[#b45309] transition-all"
      >
        <span className={searchQuery ? 'text-[#073822]' : 'text-gray-400'}>
          {searchQuery || 'جستجو در برنج‌های طلا رایس...'}
        </span>
        <div className="absolute left-3.5 text-[#073822] flex items-center gap-1.5">
          <i className="fa-solid fa-magnifying-glass text-base text-[#073822]" />
        </div>
      </button>
    </div>
  );
};
