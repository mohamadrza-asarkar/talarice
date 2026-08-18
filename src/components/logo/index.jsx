import React from 'react';
import styles from './style.module.css';

export const Logo = ({ size = 'md', showText = true }) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`flex items-center gap-2.5 ${styles.logoContainer}`}>
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#073b27] via-[#0b4f35] to-[#136f46] text-[#fef08a] shadow-md border-2 border-[#d4af37] ${
          isLg ? 'w-16 h-16' : isSm ? 'w-9 h-9' : 'w-11 h-11'
        } ${styles.badge}`}
      >
        <div className="absolute inset-0.5 rounded-xl border border-[#d4af37]/40 pointer-events-none" />
        <i
          className={`fa-solid fa-wheat-awn ${
            isLg ? 'text-2xl' : isSm ? 'text-sm' : 'text-lg'
          } text-[#fef08a] drop-shadow-md`}
        />
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#d4af37] rounded-full border border-white flex items-center justify-center">
          <i className="fa-solid fa-star text-[7px] text-[#073b27]" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black text-[#073b27] tracking-tight ${
                isLg ? 'text-xl' : isSm ? 'text-sm' : 'text-base'
              }`}
            >
              طلا رایس
            </span>
            <span className="bg-[#f0fdf4] text-[#073b27] text-[10px] font-black px-1.5 py-0.2 rounded border border-[#d4af37]/60">
              کامفیروز
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#b45309] -mt-0.5 tracking-wider">
            TALA RICE
          </span>
        </div>
      )}
    </div>
  );
};
