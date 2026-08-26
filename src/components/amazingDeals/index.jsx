import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function AmazingDeals() {
  const { products } = useApp();
  const deals = products.filter((p) => p.discountPercent > 0 || p.oldPrice > p.price);
  if (deals.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-red-950/60 to-[#073b27] border border-red-500/30 rounded-2xl p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black animate-pulse">
            شگفت‌انگیز
          </span>
          <h2 className="text-xs font-bold text-white">تخفیف‌های ویژه شالیزار</h2>
        </div>
        <Link to="/catalog" className="text-[11px] text-gray-300 hover:text-white">
          مشاهده همه
        </Link>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {deals.map((item) => (
          <Link
            key={item._id || item.id}
            to={`/product/${item._id || item.id}`}
            className="min-w-[140px] max-w-[140px] bg-[#042a1b] border border-white/10 rounded-xl p-2 flex flex-col gap-1.5 flex-shrink-0"
          >
            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg" />
            <h3 className="text-[11px] font-bold text-white line-clamp-1">{item.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-black text-[#d4af37]">
                {Number(item.price || 0).toLocaleString('fa-IR')}
              </span>
              <span className="text-[9px] text-gray-400">تومان</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default AmazingDeals;
