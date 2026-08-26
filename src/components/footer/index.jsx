import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../logo';

export function Footer() {
  return (
    <footer className="mt-8 pt-8 pb-6 border-t border-[#d4af37]/20 flex flex-col items-center text-center gap-4">
      <Logo />
      
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-black text-[#d4af37]">فروشگاه برنج اصیل طلا رایس</h3>
        <p className="text-xs text-gray-300">عرضه مستقیم برنج باکیفیت و معطر کامفیروز از شالیزار به سفره‌های شما</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <Link to="/" className="hover:text-[#d4af37]">خانه</Link>
        <span>•</span>
        <Link to="/catalog" className="hover:text-[#d4af37]">محصولات</Link>
        <span>•</span>
        <Link to="/blog" className="hover:text-[#d4af37]">وبلاگ</Link>
        <span>•</span>
        <Link to="/profile" className="hover:text-[#d4af37]">حساب کاربری</Link>
      </div>

      <p className="text-[10px] text-gray-500 mt-2">
        تمامی حقوق مادی و معنوی متعلق به طلا رایس می‌باشد.
      </p>
    </footer>
  );
}

export default Footer;
