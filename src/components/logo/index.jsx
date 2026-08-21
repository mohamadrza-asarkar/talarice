import React from 'react';
import styles from './style.module.css';
import logoImg from '../../assets/logo.png';

export const Logo = ({ variant = 'circle', size = 'md', className = '' }) => {
  if (variant === 'circle') {
    return (
      <div className={`relative flex items-center justify-center ${styles.circleWrapper} ${className}`}>
        <div className="absolute w-24 h-24 rounded-full bg-[#fde047]/20 blur-xl pointer-events-none" />
        <div className="relative w-20 h-20 rounded-full bg-white border-[3px] border-[#d4af37] shadow-xl p-0.5 flex flex-col items-center justify-center overflow-hidden">
          <img 
            src={logoImg} 
            alt="Tala Rice" 
            className="w-full h-full object-contain rounded-full scale-[1.15]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${styles.logoContainer} ${className}`}>
      <div className="relative w-10 h-10 rounded-full bg-white border-2 border-[#d4af37] shadow-md flex items-center justify-center overflow-hidden p-0.5">
        <img 
          src={logoImg} 
          alt="Tala Rice Logo" 
          className="w-full h-full object-contain rounded-full scale-[1.15]"
        />
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
