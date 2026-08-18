import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveTab } = useApp();

  const handleSelect = (id) => {
    setSelectedCategory(id);
    setActiveTab('catalog');
  };

  return (
    <section className="px-4 my-3">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
          <i className="fa-solid fa-wheat-awn text-[#d4af37]" />
          <span>دسته‌بندی کیسه‌های طلا رایس</span>
        </h3>
        <span className="text-xs font-bold text-[#fef08a]">
          ۱۰۰٪ خالص کامفیروزی
        </span>
      </div>

      <div className={`grid grid-cols-4 gap-2.5 ${styles.categoryGrid}`}>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fef08a] border-[#d4af37] shadow-lg scale-105'
                    : 'bg-white border-[#d4af37]/40 hover:border-[#d4af37] shadow-sm'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#d4af37]/30 flex items-center justify-center mb-1 text-[#073822]">
                  <i className={`${cat.iconClass} text-xl`} />
                </div>
                <span className="text-[11px] font-black text-[#073822] mt-1 text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
      </div>
    </section>
  );
};
