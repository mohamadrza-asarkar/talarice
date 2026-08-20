import React from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export const CatalogPage = () => {
  const { products, setIsSearchOpen } = useApp();

  return (
    <div className={`px-4 py-3 pb-24 space-y-3.5 animate-fade-in ${styles.catalogWrapper}`}>
      <div className="bg-[#063822] text-white p-4 rounded-3xl shadow-xl border-2 border-[#d4af37]/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="bg-[#fef08a] text-[#073822] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            شالیزارهای کامفیروز فارس
          </span>
          <span className="text-[11px] text-[#fef08a] font-black">
            {products.length.toLocaleString('fa-IR')} گونی برنج
          </span>
        </div>
        <h2 className="text-base font-black text-white">
          فهرست گونی‌های برنج کامفیروزی
        </h2>
        <p className="text-xs text-[#a7f3d0] mt-1 font-normal">
          عرضه مستقیم در کیسه‌های پارچه‌ای نخی سفید با گارانتی اصالت
        </p>
      </div>

      <div className="flex items-center justify-end px-1 text-xs">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-[#fef08a] hover:text-[#d4af37] text-xs font-bold flex items-center gap-1 shrink-0 p-1 cursor-pointer bg-[#063822] px-3 py-1.5 rounded-xl border border-[#d4af37]/40"
        >
          <i className="fa-solid fa-magnifying-glass text-xs" />
          <span>جستجو در محصولات</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#063822] rounded-3xl p-8 text-center border-2 border-[#d4af37]/40 text-white my-6">
          <div className="w-14 h-14 rounded-full bg-[#042a1b] border-2 border-[#d4af37] flex items-center justify-center mx-auto mb-3 text-[#fef08a] text-xl">
            <i className="fa-solid fa-wheat-awn-circle-exclamation" />
          </div>
          <h4 className="text-sm font-black text-[#fef08a] mb-1">
            موردی یافت نشد
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
