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
        className={`${styles.bannerCard} ${styles.bannerDark}`}
      >
        <div className={styles.contentWrapper}>
          <span className={styles.badgeDark}>
            ارسال رایگان
          </span>
          <h4 className={styles.titleDark}>
            پک ۲۰ کیلویی اقتصادی
          </h4>
          <p className={styles.subtitleDark}>دو کیسه ۱۰ کیلویی سفید</p>
        </div>
        <div className={styles.actionRow}>
          <span className={styles.actionTextDark}>خرید با تخفیف</span>
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '10px', color: '#fef08a' }} />
        </div>
      </div>

      <div
        onClick={() => {
          setSelectedCategory('half-grain');
          setActiveTab('catalog');
        }}
        className={`${styles.bannerCard} ${styles.bannerLight}`}
      >
        <div className={styles.contentWrapper}>
          <span className={styles.badgeLight}>
            عطر فوق‌العاده
          </span>
          <h4 className={styles.titleLight}>
            نیم‌دانه معطر کامفیروز
          </h4>
          <p className={styles.subtitleLight}>کیسه ۵ کیلویی خوش‌پخت</p>
        </div>
        <div className={styles.actionRow}>
          <span className={styles.actionTextLight}>بررسی و خرید</span>
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '10px', color: '#073b27' }} />
        </div>
      </div>
    </section>
  );
};
