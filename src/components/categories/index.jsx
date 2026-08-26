import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function Categories() {
  const { categories } = useApp();
  if (!categories || categories.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
          <i className="fa-solid fa-wheat-awn" />
          <span>دسته‌بندی‌ها</span>
        </h3>
        <span className="text-[10px] text-gray-400">۱۰۰٪ کامفیروز ناب</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => (
            <Link
              key={cat.id}
              to="/catalog"
              className="bg-[#073b27] border border-[#d4af37]/20 rounded-xl p-2.5 flex flex-col items-center gap-1.5 text-center hover:border-[#d4af37]/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                <i className={cat.iconClass} />
              </div>
              <span className="text-[10px] font-bold text-white line-clamp-1">{cat.name}</span>
            </Link>
          ))}
      </div>
    </section>
  );
}

export default Categories;
