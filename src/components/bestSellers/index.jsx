import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BestSellers = () => {
  const { products, addToCart, setSelectedProduct, setActiveTab } = useApp();

  return (
    <section className="mb-6 pr-4">
      <div className="flex justify-between items-center pl-4 mb-3">
        <h3 className="text-base font-black text-[#073b27] flex items-center gap-1.5">
          <i className="fa-solid fa-wheat-awn text-[#d4af37]" />
          پرفروش‌ترین گونی‌های برنج
        </h3>
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-[#0b4f35] hover:text-[#d4af37] text-xs font-black flex items-center gap-1 transition-colors"
        >
          <span>مشاهده همه</span>
          <i className="fa-solid fa-arrow-left text-xs" />
        </button>
      </div>

      <div className={`flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x ${styles.scrollContainer}`}>
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-3 min-w-[190px] max-w-[190px] shrink-0 border-2 border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm hover:shadow-md transition-all flex flex-col justify-between snap-start group"
          >
            <div>
              <div
                className="relative h-32 rounded-xl overflow-hidden mb-2 bg-[#f0fdf4] cursor-pointer border border-[#d4af37]/20"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-[#073b27] text-[#fef08a] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#d4af37]">
                  {product.weight.toLocaleString('fa-IR')} کیلو
                </span>
                <span className="absolute top-2 left-2 bg-[#22c55e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                  <i className="fa-solid fa-seedling text-[9px]" /> معطر
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-2 left-2 bg-gradient-to-r from-[#0b4f35] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] hover:text-[#073b27] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-[#d4af37]/60"
                  title="افزودن کیسه به سبد"
                >
                  <i className="fa-solid fa-plus text-xs text-[#fef08a] hover:text-[#073b27]" />
                </button>
              </div>

              <h4
                onClick={() => setSelectedProduct(product)}
                className="font-black text-xs text-[#073b27] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-1.5 leading-snug"
              >
                {product.name}
              </h4>

              <div className="flex items-center gap-1 mb-2">
                <i className="fa-solid fa-star text-[#d4af37] text-xs" />
                <span className="text-xs font-extrabold text-[#073b27]">
                  {product.rating.toLocaleString('fa-IR')}
                </span>
                <span className="text-[10px] text-gray-400">
                  ({product.reviewCount.toLocaleString('fa-IR')})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-[#d4af37]/20">
              <span className="text-sm font-black text-[#073b27]">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] font-bold text-[#b45309]">تومان</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
