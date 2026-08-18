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
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) return null;
  const slide = heroSlides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleCta = () => {
    if (slide.category) {
      setSelectedCategory(slide.category);
    }
    setActiveTab('catalog');
  };

  return (
    <section className={`px-4 pt-3 pb-1 ${styles.sliderSection}`}>
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#d4af37]/60 min-h-[190px] flex flex-col justify-between text-white p-5 bg-gradient-to-l from-[#063822]/90 via-[#0a462c]/85 to-[#042a1b]/95">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10 opacity-30 mix-blend-luminosity scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800')`
          }}
        />

        <div className="relative z-10 flex flex-col items-start space-y-1.5">
          <span className="bg-[#fef08a] text-[#073822] text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm">
            فروش ویژه طلا رایس
          </span>
          <h2 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow">
            {slide.title}
          </h2>
          <p className="text-[11px] text-[#e2e8f0] font-medium leading-relaxed drop-shadow max-w-[260px]">
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-3 pt-2">
          <button
            onClick={handleCta}
            className="bg-[#fef08a] hover:bg-[#fde047] text-[#073822] font-black text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>مشاهده تخفیف‌های امروز</span>
            <i className="fa-solid fa-arrow-left text-[11px]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs"
            >
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </button>
            <div className="flex items-center gap-1">
              {heroSlides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`cursor-pointer transition-all ${
                    currentSlide === idx
                      ? 'w-4 h-1.5 bg-[#fef08a] rounded-full'
                      : 'w-1.5 h-1.5 bg-white/50 rounded-full'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs"
            >
              <i className="fa-solid fa-chevron-left text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
