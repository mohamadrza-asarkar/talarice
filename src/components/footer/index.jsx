import React from 'react';
import { Logo } from '../logo';
import styles from './style.module.css';

export const Footer = () => {
  return (
    <footer className={`bg-[#042a1b] text-white pt-6 pb-20 px-4 mt-6 border-t-2 border-[#d4af37]/40 ${styles.footer}`}>
      <div className="flex flex-col items-center text-center mb-5">
        <div className="mb-2">
          <Logo variant="circle" />
        </div>
        <h3 className="text-base font-black text-[#fef08a] mt-2">
          فروشگاه آنلاین برنج طلا رایس
        </h3>
        <p className="text-xs text-[#a7f3d0] mt-1 font-normal max-w-xs leading-relaxed">
          عرضه‌کننده مستقیم برنج ۱۰۰٪ اصل و معطر کامفیروز شیراز در گونی‌های نخی سفید سفارشی
        </p>
      </div>

      <div className="bg-[#063822] p-4 rounded-2xl border-2 border-[#d4af37]/50 shadow-md mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-truck-fast text-[#fef08a] text-lg shrink-0" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">ارسال سریع کشوری</div>
            <div className="text-[10px] text-[#a7f3d0]">پست پیشتاز و باربری</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-shield-halved text-[#fef08a] text-lg shrink-0" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">ضمانت اصالت و عطر</div>
            <div className="text-[10px] text-[#a7f3d0]">۷ روز بازگشت وجه</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-seedling text-[#fef08a] text-lg shrink-0" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">برنج تازه شالیزار</div>
            <div className="text-[10px] text-[#a7f3d0]">کامفیروز استان فارس</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-right">
          <i className="fa-solid fa-headset text-[#fef08a] text-lg shrink-0" />
          <div>
            <div className="text-xs font-black text-[#fef08a]">پشتیبانی مشتریان</div>
            <div className="text-[10px] text-[#a7f3d0]">مشاوره آنلاین خرید</div>
          </div>
        </div>
      </div>

      <div className="bg-[#063822] p-4 rounded-2xl border-2 border-[#d4af37]/50 shadow-md mb-5 space-y-2 text-xs text-right">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#fef08a] font-black">
            <i className="fa-solid fa-phone text-xs" />
            <span>شماره پشتیبانی و ثبت تلفنی:</span>
          </div>
          <span className="text-[#fef08a] font-black dir-ltr">۰۹۱۷۰۰۰۰۰۰۰</span>
        </div>

        <div className="flex items-start gap-2 pt-1 border-t border-[#d4af37]/20 text-[#a7f3d0]">
          <i className="fa-solid fa-location-dot text-[#fef08a] text-xs mt-0.5" />
          <span>آدرس شالیزار: استان فارس، مرودشت، منطقه کامفیروز</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-5">
        <a
          href="https://t.me"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-full bg-[#0d5336] hover:bg-[#136f46] text-[#fef08a] flex items-center justify-center border-2 border-[#d4af37] shadow-md transition-transform active:scale-95"
        >
          <i className="fa-brands fa-telegram text-lg" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-full bg-[#0d5336] hover:bg-[#136f46] text-[#fef08a] flex items-center justify-center border-2 border-[#d4af37] shadow-md transition-transform active:scale-95"
        >
          <i className="fa-brands fa-instagram text-lg" />
        </a>
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-full bg-[#0d5336] hover:bg-[#136f46] text-[#fef08a] flex items-center justify-center border-2 border-[#d4af37] shadow-md transition-transform active:scale-95"
        >
          <i className="fa-brands fa-whatsapp text-lg" />
        </a>
      </div>

      <div className="text-center text-[10px] text-[#a7f3d0] border-t border-[#d4af37]/30 pt-3">
        تمامی حقوق برای برند طلا رایس (Tala Rice) محفوظ است.
      </div>
    </footer>
  );
};
