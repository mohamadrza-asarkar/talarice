import React, { useMemo } from 'react';
import { useApp } from '../../context';
import { getPromoBanners } from '../../api/promoBanners';
import styles from './style.module.css';

export const PromoBanners = () => {
  const { setActiveTab, setSelectedCategory } = useApp();
  const banners = useMemo(() => getPromoBanners(), []);

  return (
    <section className={styles.section}>
      {banners.map((banner) => (
        <div
          key={banner.id}
          onClick={() => {
            if (banner.categoryId) {
              setSelectedCategory(banner.categoryId);
            }
            setActiveTab('catalog');
          }}
          className={`${styles.bannerCard} ${banner.theme === 'dark' ? styles.bannerDark : styles.bannerLight}`}
        >
          <div className={styles.contentWrapper}>
            <span className={banner.theme === 'dark' ? styles.badgeDark : styles.badgeLight}>
              {banner.badge}
            </span>
            <h4 className={banner.theme === 'dark' ? styles.titleDark : styles.titleLight}>
              {banner.title}
            </h4>
            <p className={banner.theme === 'dark' ? styles.subtitleDark : styles.subtitleLight}>
              {banner.subtitle}
            </p>
          </div>
          <div className={styles.actionRow}>
            <span className={banner.theme === 'dark' ? styles.actionTextDark : styles.actionTextLight}>
              {banner.actionText}
            </span>
            <i 
              className="fa-solid fa-arrow-left" 
              style={{ fontSize: '10px', color: banner.theme === 'dark' ? '#fef08a' : '#073b27' }} 
            />
          </div>
        </div>
      ))}
    </section>
  );
};

