import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const AmazingDeals = () => {
  const { products, addToCart, setSelectedProduct } = useApp();
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
          <div
            key={product.id}
            className="bg-white rounded-2xl p-3 text-[#073822] shadow-md flex flex-col justify-between border-2 border-[#d4af37]/40 relative group"
          >
            <div>
              <div
                className="relative h-32 rounded-xl overflow-hidden mb-2 bg-[#f8fafc] cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPercent && (
                  <span className="absolute top-1.5 right-1.5 bg-[#b45309] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
                    {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
                  </span>
                )}
                <span className="absolute bottom-1.5 right-1.5 bg-[#073822] text-[#fef08a] text-[9px] font-black px-2 py-0.5 rounded-md border border-[#d4af37]">
                  گونی سفید {product.weight}k
                </span>
              </div>

              <h4
                onClick={() => setSelectedProduct(product)}
                className="font-black text-xs text-[#073822] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-2 leading-snug min-h-[32px]"
              >
                {product.name}
              </h4>

              <div className="space-y-0.5 mb-2">
                {product.oldPrice && (
                  <div className="text-[10px] text-gray-400 line-through text-left font-bold">
                    {product.oldPrice.toLocaleString('fa-IR')}
                  </div>
                )}
                <div className="text-xs font-black text-[#073822] text-left flex items-center justify-end gap-1">
                  <span>{product.price.toLocaleString('fa-IR')}</span>
                  <span className="text-[10px] text-gray-500 font-normal">تومان</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-[9px] text-gray-500 font-bold mb-1">
                  <span>موجودی شالیزار</span>
                  {product.soldPercent && (
                    <span className="text-[#b45309]">
                      {product.soldPercent.toLocaleString('fa-IR')}٪ رزرو شد
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#073822] h-full rounded-full"
                    style={{ width: `${product.soldPercent || 60}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-[#073822] hover:bg-[#0a4d30] text-[#fef08a] text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border border-[#d4af37]"
            >
              <i className="fa-solid fa-cart-plus text-xs" />
              <span>خرید کیسه سفید</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
