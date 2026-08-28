import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export function HeroSlider() {
  const { heroSlides, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(function () {
    if (!heroSlides?.length) return;
    const timer = setInterval(function () {
      setCurrentSlide(function (prev) { return (prev + 1) % heroSlides.length; });
    }, 5500);
    return function () { clearInterval(timer); };
  }, [heroSlides?.length]);

  if (!heroSlides?.length) return null;
  const slide = heroSlides[currentSlide];

  function handleCta() {
    if (slide.category) setSelectedCategory(slide.category);
    navigate('/catalog');
  }

  return (
    <section className={styles.sliderCard}>
      <img
        key={currentSlide}
        src={slide.image}
        alt={slide.title}
        className={styles.bgImage}
      />

      <div className={styles.content}>
        <span className={styles.badge}>{slide.subtitle || 'فروش ویژه طلا رایس'}</span>
        <h2 className={styles.title}>{slide.title}</h2>
        <p className={styles.description}>{slide.description}</p>
      </div>

      <footer className={styles.controls}>
        <button type="button" onClick={handleCta} className={styles.ctaButton}>
          <span>{slide.ctaText || 'مشاهده تخفیف‌های امروز'}</span>
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div className={styles.navRow}>
          <button
            type="button"
            onClick={function () { setCurrentSlide(function (prev) { return (prev - 1 + heroSlides.length) % heroSlides.length; }); }}
            className={styles.navBtn}
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
          <div className={styles.dots}>
            {heroSlides.map(function (_, idx) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={function () { setCurrentSlide(idx); }}
                  className={currentSlide === idx ? styles.dotActive : styles.dot}
                  aria-label={`Slide ${idx + 1}`}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={function () { setCurrentSlide(function (prev) { return (prev + 1) % heroSlides.length; }); }}
            className={styles.navBtn}
            aria-label="Next slide"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
        </div>
      </footer>
    </section>
  );
}

