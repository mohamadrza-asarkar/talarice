import React from 'react';
import logoImg from '../../assets/logo.png';

export function Logo({ className = '' }) {
  return (
    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-[#d4af37]/40 ${className}`}>
      <img src={logoImg} alt="Tala Rice" className="w-full h-full object-cover" />
    </div>
  );
}

export default Logo;
