import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const AmazingDeals = () => {
  const { products } = useApp();
  const dealProducts = products.filter((p) => p.isDeal);

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 59,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 59, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0) return null;

  return (
    <section className={`mx-4 my-3 bg-[#063822] rounded-3xl p-4 shadow-xl border-2 border-[#d4af37]/60 text-white ${styles.dealsSection}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-fire-flame-curved text-[#fef08a] text-base" />
          <h3 className="text-sm sm:text-base font-black text-[#fef08a]">
            پیشنهاد شگفت‌انگیز طلا رایس
          </h3>
        </div>

        <div className="flex items-center gap-1 dir-ltr">
          <span className="bg-[#fef08a] text-[#073822] font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[#fef08a] font-bold text-xs">:</span>
          <span className="bg-[#fef08a] text-[#073822] font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[#fef08a] font-bold text-xs">:</span>
          <span className="bg-[#fef08a] text-[#073822] font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dealProducts.slice(0, 2).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
