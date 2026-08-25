import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const HeroSlider = () => {
  const { heroSlides } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // If there are no slides fetched from backend/created by admin, do not render any mock slides
  if (!heroSlides || heroSlides.length === 0) {
    return null;
  }

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className={styles.sliderWrapper} aria-label="اسلایدر ویژه">
      <div className={styles.sliderContainer}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id || slide._id || index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title || 'اسلاید'}
                className={styles.slideImage}
              />
            )}
            <div className={styles.overlay} />
            <div className={styles.slideContent}>
              <div className={styles.badge}>
                <Sparkles size={14} />
                <span>پیشنهاد برتر</span>
              </div>
              {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
              {slide.subtitle && <p className={styles.subtitle}>{slide.subtitle}</p>}
              {slide.link && (
                <Link to={slide.link} className={styles.ctaBtn}>
                  <span>مشاهده و خرید</span>
                  <ArrowLeft size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}

        {heroSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`${styles.navBtn} ${styles.prevBtn}`}
              aria-label="اسلاید قبلی"
            >
              <ChevronRight size={22} />
            </button>
            <button
              onClick={handleNext}
              className={`${styles.navBtn} ${styles.nextBtn}`}
              aria-label="اسلاید بعدی"
            >
              <ChevronLeft size={22} />
            </button>
            <div className={styles.dots}>
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                  aria-label={`رفتن به اسلاید ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSlider;
