import React from 'react';
import styles from './style.module.css';

export const Logo = ({ variant = 'circle', size = 'md', className = '' }) => {
  if (variant === 'circle') {
    return (
      <div className={`relative flex items-center justify-center ${styles.circleWrapper} ${className}`}>
        <div className="absolute w-24 h-24 rounded-full bg-[#fde047]/20 blur-xl pointer-events-none" />
        <div className="relative w-20 h-20 rounded-full bg-white border-[3px] border-[#d4af37] shadow-xl p-1.5 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-9 h-9 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#073822]">
              <path
                d="M 50,15 A 35,35 0 0 1 85,50 A 35,35 0 0 1 50,85 A 35,35 0 0 1 15,50 A 35,35 0 0 1 50,15"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <circle cx="50" cy="50" r="16" fill="#fef08a" />
              <path
                d="M 50,30 L 50,20 M 64,36 L 72,28 M 70,50 L 80,50 M 64,64 L 72,72 M 36,36 L 28,28 M 30,50 L 20,50 M 36,64 L 28,72"
                stroke="#b45309"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 30,55 Q 50,75 70,55"
                fill="none"
                stroke="#073822"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 35,63 Q 50,80 65,63"
                fill="none"
                stroke="#136f46"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center mt-0.5">
            <span className="block text-[8px] font-black text-[#073822] tracking-tighter leading-none">
              TALA
            </span>
            <span className="block text-[7px] font-bold text-[#b45309] tracking-wider leading-none">
              RICE
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${styles.logoContainer} ${className}`}>
      <div className="relative w-10 h-10 rounded-full bg-white border-2 border-[#d4af37] shadow-md flex items-center justify-center overflow-hidden">
        <i className="fa-solid fa-wheat-awn text-[#073822] text-lg" />
      </div>
      <div className="flex flex-col text-right">
        <span className="font-black text-[#073822] text-sm leading-tight">
          طلا رایس
        </span>
        <span className="text-[9px] font-bold text-[#b45309] tracking-wider">
          TALA RICE
        </span>
      </div>
    </div>
  );
};
