import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function HeroSlider() {
  const { heroSlides } = useApp();
  if (!heroSlides || heroSlides.length === 0) return null;

  const slide = heroSlides[0];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 h-44 shadow-lg group">
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
        <h2 className="text-sm font-black text-white">{slide.title}</h2>
        <p className="text-[11px] text-gray-200 mt-0.5">{slide.subtitle}</p>
        <Link
          to={slide.link || '/catalog'}
          className="mt-2.5 inline-flex items-center gap-1 bg-[#d4af37] text-[#042a1b] text-xs font-bold px-3 py-1.5 rounded-lg w-max"
        >
          <span>مشاهده و خرید</span>
          <i className="fa-solid fa-arrow-left text-[10px]" />
        </Link>
      </div>
    </div>
  );
}

export default HeroSlider;
