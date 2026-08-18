import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BestSellers = () => {
  const { products, addToCart, setSelectedProduct, setActiveTab } = useApp();

  return (
    <section className="px-4 my-3">
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
          <i className="fa-solid fa-wheat-awn text-[#d4af37]" />
          <span>پرفروش‌ترین گونی‌های برنج</span>
        </h3>
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-[#fef08a] hover:text-[#d4af37] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>مشاهده همه</span>
          <i className="fa-solid fa-arrow-left text-[11px]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 2).map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-3 shadow-md flex flex-col justify-between border-2 border-[#d4af37]/40 relative group"
          >
            <div>
              <div
                className="relative h-36 rounded-xl overflow-hidden mb-2 bg-[#f8fafc] cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 right-1.5 bg-[#073822] text-[#fef08a] text-[9px] font-black px-2 py-0.5 rounded-md border border-[#d4af37]">
                  گونی سفید {product.weight}k
                </span>
                <span className="absolute top-1.5 left-1.5 bg-[#16a34a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <i className="fa-solid fa-leaf text-[8px]" /> معطر
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-1.5 left-1.5 bg-[#073822] text-[#fef08a] w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-[#d4af37] hover:bg-[#0a4d30]"
                >
                  <i className="fa-solid fa-plus text-xs" />
                </button>
              </div>

              <h4
                onClick={() => setSelectedProduct(product)}
                className="font-black text-xs text-[#073822] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-1.5 leading-snug min-h-[32px]"
              >
                {product.name}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-bold border-t border-gray-100">
              <span className="flex items-center gap-1 text-[#b45309]">
                <i className="fa-solid fa-star text-[10px]" />
                <span className="font-black">{product.rating}</span>
                <span>({product.reviewCount} نظر)</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
