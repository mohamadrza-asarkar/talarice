import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const HeroSlider = () => {
  const { heroSlides, setActiveTab, setSelectedCategory } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) return null;
  const slide = heroSlides[currentSlide];

  const handleCta = () => {
    if (slide.category) {
      setSelectedCategory(slide.category);
    }
    setActiveTab('catalog');
  };

  return (
    <section className="px-4 mb-4">
      <div className={`relative bg-gradient-to-br from-[#073b27] via-[#0b4f35] to-[#136f46] rounded-3xl overflow-hidden shadow-xl border-2 border-[#d4af37] text-white p-5 min-h-[220px] flex flex-col justify-between ${styles.heroContainer}`}>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-[#fef08a]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2.5 py-1 rounded-full mb-2 shadow-sm border border-white">
            <i className="fa-solid fa-certificate text-[9px]" />
            <span>{slide.tag}</span>
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#fef08a] leading-tight mb-2">
            {slide.title}
          </h2>
          <p className="text-xs text-[#d1fae5] leading-relaxed max-w-[280px] font-medium">
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-4 pt-2 border-t border-[#d4af37]/30">
          <button
            onClick={handleCta}
            className="bg-gradient-to-r from-[#d4af37] to-[#fef08a] hover:from-[#fef08a] hover:to-[#d4af37] text-[#073b27] font-black text-xs px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 border border-[#073b27]/30"
          >
            <span>{slide.ctaText}</span>
            <i className="fa-solid fa-arrow-left text-xs" />
          </button>

          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-6 bg-[#fef08a] border border-[#073b27]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`اسلاید ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? heroSlides.length - 1 : prev - 1
            )
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-[#fef08a] rounded-full p-2 backdrop-blur-sm transition-all text-xs"
          aria-label="اسلاید قبلی"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-[#fef08a] rounded-full p-2 backdrop-blur-sm transition-all text-xs"
          aria-label="اسلاید بعدی"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
      </div>
    </section>
  );
};
