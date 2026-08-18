import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const AmazingDeals = () => {
  const { products, addToCart, setSelectedProduct, setActiveTab } = useApp();
  const dealProducts = products.filter((p) => p.isDeal);

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
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
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0) return null;

  return (
    <section className={`mx-4 mb-6 bg-gradient-to-br from-[#073b27] via-[#0b4f35] to-[#073b27] rounded-3xl p-4 shadow-xl border-2 border-[#d4af37] text-white relative overflow-hidden ${styles.dealsSection}`}>
      <div className="flex justify-between items-center mb-3.5 relative z-10 px-1">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-fire text-[#fef08a] animate-bounce text-base" />
          <h3 className="text-base font-black text-[#fef08a] flex items-center gap-1">
            پیشنهاد شگفت‌انگیز طلا رایس
          </h3>
        </div>

        <div className="flex items-center gap-1 dir-ltr bg-black/40 px-2.5 py-1 rounded-xl border border-[#d4af37]/60 text-xs font-black text-[#fef08a] font-mono">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
          <span className="text-red-400">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x relative z-10">
        {dealProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-3 min-w-[210px] max-w-[210px] shrink-0 text-[#073b27] shadow-lg flex flex-col justify-between border-2 border-[#d4af37]/60 snap-start group"
          >
            <div>
              <div
                className="relative h-36 rounded-xl overflow-hidden mb-2.5 bg-[#f0fdf4] cursor-pointer border border-[#d4af37]/30"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPercent && (
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
                    {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
                  </span>
                )}
                <span className="absolute top-2 left-2 bg-[#073b27] text-[#fef08a] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#d4af37]">
                  {product.weight.toLocaleString('fa-IR')} کیلو
                </span>
              </div>

              <h4
                onClick={() => setSelectedProduct(product)}
                className="font-black text-xs text-[#073b27] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-1.5 leading-snug"
              >
                {product.name}
              </h4>

              {product.soldPercent && (
                <div className="mb-2">
                  <div className="flex justify-between text-[9px] text-[#1e3a29] font-bold mb-0.5">
                    <span>فروش ویژه:</span>
                    <span>{product.soldPercent.toLocaleString('fa-IR')}٪ رزرو شده</span>
                  </div>
                  <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#d4af37] to-[#22c55e] h-full rounded-full"
                      style={{ width: `${product.soldPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-col items-end mb-2">
                {product.oldPrice && (
                  <span className="text-[11px] text-gray-400 line-through font-bold">
                    {product.oldPrice.toLocaleString('fa-IR')}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-[#073b27]">
                    {product.price.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] font-bold text-[#b45309]">تومان</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="w-full bg-gradient-to-r from-[#0b4f35] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] hover:text-[#073b27] text-white font-black text-xs py-2 rounded-lg shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-1 border border-[#d4af37]/50"
              >
                <i className="fa-solid fa-cart-plus text-xs" />
                <span>خرید کیسه سفید</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setActiveTab('catalog')}
        className="w-full mt-2 text-center text-[#fef08a] text-xs font-black opacity-90 hover:opacity-100 flex items-center justify-center gap-1.5 py-1"
      >
        <span>مشاهده همه تخفیف‌های شگفت‌انگیز</span>
        <i className="fa-solid fa-arrow-left text-xs" />
      </button>
    </section>
  );
};
