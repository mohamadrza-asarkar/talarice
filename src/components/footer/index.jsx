import React from 'react';
import { Logo } from '../logo';
import styles from './style.module.css';

export const Footer = () => {
  return (
    <footer className={`bg-gradient-to-b from-[#073b27] to-[#042116] text-white pt-8 pb-10 px-5 border-t-4 border-[#d4af37] mt-8 rounded-t-3xl shadow-2xl relative ${styles.footer}`}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3">
          <Logo size="lg" showText={false} />
        </div>
        <h3 className="text-lg font-black text-[#fef08a] tracking-tight">
          فروشگاه آنلاین برنج طلا رایس
        </h3>
        <p className="text-xs text-[#d1fae5] mt-1 font-medium max-w-xs leading-relaxed">
          عرضه‌کننده مستقیم برنج ۱۰۰٪ اصل و معطر کامفیروز شیراز در گونی‌های نخی سفید سفارشی
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 bg-[#0b4f35]/80 p-4 rounded-2xl border border-[#d4af37]/40 shadow-inner">
        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-truck-fast text-[#d4af37] text-lg" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">ارسال سریع کشوری</div>
            <div className="text-[10px] text-[#d1fae5]">پست پیشتاز و باربری</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-shield-halved text-[#d4af37] text-lg" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">ضمانت اصالت و عطر</div>
            <div className="text-[10px] text-[#d1fae5]">۷ روز بازگشت وجه</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-seedling text-[#d4af37] text-lg" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">برنج تازه شالیزار</div>
            <div className="text-[10px] text-[#d1fae5]">کامفیروز استان فارس</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-headset text-[#d4af37] text-lg" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">پشتیبانی مشتریان</div>
            <div className="text-[10px] text-[#d1fae5]">مشاوره آنلاین خرید</div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 text-xs text-[#d1fae5] bg-black/20 p-4 rounded-2xl border border-[#d4af37]/20 mb-6 text-right">
        <div className="flex items-center gap-2.5">
          <i className="fa-solid fa-phone text-[#d4af37]" />
          <span className="font-bold">شماره پشتیبانی و ثبت تلفنی:</span>
          <span className="font-black text-[#fef08a] dir-ltr mr-auto">۰۹۱۷۰۰۰۰۰۰۰</span>
        </div>
        <div className="flex items-center gap-2.5">
          <i className="fa-solid fa-location-dot text-[#d4af37]" />
          <span className="font-bold">آدرس شالیزار:</span>
          <span>استان فارس، مرودشت، منطقه کامفیروز</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-6">
        <a
          href="https://wa.me/#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#136f46] text-[#fef08a] flex items-center justify-center border border-[#d4af37] hover:bg-[#d4af37] hover:text-[#073b27] transition-all shadow-md"
          title="واتساپ"
        >
          <i className="fa-brands fa-whatsapp text-xl" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#136f46] text-[#fef08a] flex items-center justify-center border border-[#d4af37] hover:bg-[#d4af37] hover:text-[#073b27] transition-all shadow-md"
          title="اینستاگرام"
        >
          <i className="fa-brands fa-instagram text-xl" />
        </a>
        <a
          href="https://t.me/#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#136f46] text-[#fef08a] flex items-center justify-center border border-[#d4af37] hover:bg-[#d4af37] hover:text-[#073b27] transition-all shadow-md"
          title="تلگرام"
        >
          <i className="fa-brands fa-telegram text-xl" />
        </a>
      </div>

      <div className="pt-4 border-t border-[#d4af37]/30 text-center text-[11px] text-[#a7f3d0] font-bold">
        تمامی حقوق برای برند <span className="text-[#fef08a] font-black">طلا رایس (Tala Rice)</span> محفوظ است.
      </div>
    </footer>
  );
};
