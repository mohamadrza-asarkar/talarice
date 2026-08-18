import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveTab } =
    useApp();

  const handleSelect = (id) => {
    setSelectedCategory(id);
    setActiveTab('catalog');
  };

  return (
    <section className="px-4 mb-6">
      <h3 className="text-base font-black mb-3 text-[#073b27] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <i className="fa-solid fa-wheat-awn text-[#d4af37]" />
          دسته‌بندی کیسه‌های طلا رایس
        </span>
        <span className="text-xs font-black text-[#b45309]">
          ۱۰۰٪ خالص کامفیروزی
        </span>
      </h3>

      <div className={`grid grid-cols-4 gap-2 ${styles.categoryGrid}`}>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all group ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#073b27] to-[#136f46] border-[#d4af37] shadow-lg scale-[1.02]'
                    : 'bg-white border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 border transition-all ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#073b27] border-white shadow-md'
                      : 'bg-[#f0fdf4] text-[#073b27] border-[#d4af37]/40 group-hover:bg-[#d4af37]/20'
                  }`}
                >
                  <i className={`${cat.iconClass} text-lg`} />
                </div>
                <span
                  className={`text-xs font-black leading-tight ${
                    isSelected ? 'text-[#fef08a]' : 'text-[#073b27]'
                  }`}
                >
                  {cat.name}
                </span>
                {cat.badge && (
                  <span
                    className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f0fdf4] text-[#b45309] border border-[#d4af37]/30'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </section>
  );
};
