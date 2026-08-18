import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const PromoBanners = () => {
  const { setActiveTab, setSelectedCategory } = useApp();

  return (
    <section className="px-4 mb-6 grid grid-cols-2 gap-3">
      <div
        onClick={() => {
          setSelectedCategory('economic');
          setActiveTab('catalog');
        }}
        className={`bg-gradient-to-br from-[#073b27] via-[#0b4f35] to-[#136f46] text-white p-3.5 rounded-2xl cursor-pointer hover:shadow-lg transition-all border-2 border-[#d4af37] relative overflow-hidden flex flex-col justify-between min-h-[125px] ${styles.bannerCard}`}
      >
        <div className="relative z-10">
          <span className="bg-[#d4af37] text-[#073b27] text-[9px] font-black px-2 py-0.5 rounded-full inline-block mb-1 border border-white">
            ارسال رایگان
          </span>
          <h4 className="text-xs font-black text-[#fef08a] leading-snug">
            پک ۲۰ کیلویی اقتصادی
          </h4>
          <p className="text-[10px] text-[#d1fae5] mt-0.5">دو کیسه ۱۰ کیلویی سفید</p>
        </div>
        <div className="relative z-10 flex items-center justify-between mt-2 pt-1 border-t border-[#d4af37]/30">
          <span className="text-[10px] font-black text-[#fef08a]">خرید با تخفیف</span>
          <i className="fa-solid fa-arrow-left text-[10px] text-[#fef08a]" />
        </div>
      </div>

      <div
        onClick={() => {
          setSelectedCategory('half-grain');
          setActiveTab('catalog');
        }}
        className={`bg-gradient-to-br from-[#fefce8] via-[#f0fdf4] to-[#e2e8f0] text-[#073b27] p-3.5 rounded-2xl cursor-pointer hover:shadow-lg transition-all border-2 border-[#d4af37] relative overflow-hidden flex flex-col justify-between min-h-[125px] ${styles.bannerCard}`}
      >
        <div className="relative z-10">
          <span className="bg-[#073b27] text-[#fef08a] text-[9px] font-black px-2 py-0.5 rounded-full inline-block mb-1 border border-[#d4af37]">
            عطر فوق‌العاده
          </span>
          <h4 className="text-xs font-black text-[#073b27] leading-snug">
            نیم‌دانه معطر کامفیروز
          </h4>
          <p className="text-[10px] text-[#1e3a29] mt-0.5">کیسه ۵ کیلویی خوش‌پخت</p>
        </div>
        <div className="relative z-10 flex items-center justify-between mt-2 pt-1 border-t border-[#d4af37]/30">
          <span className="text-[10px] font-black text-[#073b27]">بررسی و خرید</span>
          <i className="fa-solid fa-arrow-left text-[10px] text-[#073b27]" />
        </div>
      </div>
    </section>
  );
};
