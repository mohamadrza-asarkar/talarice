import React from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const BestSellers = () => {
  const { products, setActiveTab } = useApp();

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
