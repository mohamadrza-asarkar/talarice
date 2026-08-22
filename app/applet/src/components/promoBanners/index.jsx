import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const PromoBanners = () => {
  const { setActiveTab, setSelectedCategory } = useApp();

  return (
    <section className={styles.section}>
      <div
        onClick={() => {
          setSelectedCategory('economic');
          setActiveTab('catalog');
        }}
        className={`${styles.bannerCard} ${styles.greenBanner}`}
      >
        <div className={styles.contentWrapper}>
          <span className={`${styles.badge} ${styles.badgeGreen}`}>
            ارسال رایگان
          </span>
          <h4 className={`${styles.title} ${styles.titleGreen}`}>
            پک ۲۰ کیلویی اقتصادی
          </h4>
          <p className={`${styles.description} ${styles.descriptionGreen}`}>دو کیسه ۱۰ کیلویی سفید</p>
        </div>
        
        <div className={styles.footer}>
          <span className={`${styles.footerText} ${styles.footerTextGreen}`}>خرید با تخفیف</span>
          <i className={`fa-solid fa-arrow-left ${styles.icon} ${styles.iconGreen}`} />
        </div>
      </div>

      <div
        onClick={() => {
          setSelectedCategory('half-grain');
          setActiveTab('catalog');
        }}
        className={`${styles.bannerCard} ${styles.lightBanner}`}
      >
        <div className={styles.contentWrapper}>
          <span className={`${styles.badge} ${styles.badgeLight}`}>
            عطر فوق‌العاده
          </span>
          <h4 className={`${styles.title} ${styles.titleLight}`}>
            نیم‌دانه معطر کامفیروز
          </h4>
          <p className={`${styles.description} ${styles.descriptionLight}`}>کیسه ۵ کیلویی خوش‌پخت</p>
        </div>
        
        <div className={styles.footer}>
          <span className={`${styles.footerText} ${styles.footerTextLight}`}>بررسی و خرید</span>
          <i className={`fa-solid fa-arrow-left ${styles.icon} ${styles.iconLight}`} />
        </div>
      </div>
    </section>
  );
};
