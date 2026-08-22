import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

const slideImages = [
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800"
];

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
  const bgImage = slide.image || slideImages[currentSlide % slideImages.length];

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
    <section className={styles.sliderSection}>
      <div className={styles.sliderContainer}>
        {/* The background image */}
        <img
          key={currentSlide}
          src={bgImage}
          alt={slide.title}
          className={styles.backgroundImage}
        />
        
        {/* Gradient overlay to ensure text readability */}
        <div className={styles.overlay} />

        <div className={styles.contentTop}>
          <span className={styles.badge}>
            فروش ویژه طلا رایس
          </span>
          <h2 className={styles.title}>
            {slide.title}
          </h2>
          <p className={styles.description}>
            {slide.description}
          </p>
        </div>

        <div className={styles.contentBottom}>
          <button
            onClick={handleCta}
            className={styles.ctaButton}
          >
            <span>{slide.ctaText || 'مشاهده تخفیف‌های امروز'}</span>
            <i className={`fa-solid fa-arrow-left ${styles.ctaIcon}`} />
          </button>

          <div className={styles.controls}>
            <button onClick={handlePrev} className={styles.navButton}>
              <i className={`fa-solid fa-chevron-right ${styles.navIcon}`} />
            </button>
            
            <div className={styles.pagination}>
              {heroSlides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`${styles.dot} ${
                    currentSlide === idx ? styles.dotActive : styles.dotInactive
                  }`}
                />
              ))}
            </div>
            
            <button onClick={handleNext} className={styles.navButton}>
              <i className={`fa-solid fa-chevron-left ${styles.navIcon}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
