import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function BestSellers() {
  const { products } = useApp();
  if (!products || products.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#d4af37] flex items-center gap-1.5">
          <i className="fa-solid fa-fire text-amber-500" />
          <span>پرفروش‌ترین برنج‌ها</span>
        </h2>
        <Link to="/catalog" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <span>مشاهده همه</span>
          <i className="fa-solid fa-chevron-left text-[10px]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map((item) => (
          <Link
            key={item._id || item.id}
            to={`/product/${item._id || item.id}`}
            className="bg-[#073b27] border border-[#d4af37]/20 rounded-xl p-2.5 flex flex-col gap-2 group"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform"
            />
            <h3 className="text-xs font-bold text-white line-clamp-1">{item.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#d4af37] font-black">
                {Number(item.price || 0).toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BestSellers;
