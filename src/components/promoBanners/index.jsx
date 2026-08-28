import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.css';

export function PromoBanners() {
  return (
    <section className={styles.section}>
      <Link to="/profile" className={`${styles.bannerCard} ${styles.bannerDark}`}>
        <span className={styles.badgeDark}>فروش ویژه سازمانی</span>
        <h4 className={styles.titleDark}>خرید عمده تناژ بالا</h4>
        <p className={styles.subtitleDark}>تخفیف ویژه رستوران‌ها و هیئت‌ها</p>
        <footer className={styles.actionRow}>
          <span className={styles.actionTextDark}>استعلام قیمت عمده</span>
          <i className="fa-solid fa-arrow-left" />
        </footer>
      </Link>

      <Link to="/blog" className={`${styles.bannerCard} ${styles.bannerLight}`}>
        <span className={styles.badgeLight}>دانشنامه شالیکاری</span>
        <h4 className={styles.titleLight}>مراحل کشت برنج کامفیروز</h4>
        <p className={styles.subtitleLight}>از خزانه‌گیری بذر تا برداشت دانه‌های طلایی</p>
        <footer className={styles.actionRow}>
          <span className={styles.actionTextLight}>مطالعه مقاله کامل</span>
          <i className="fa-solid fa-arrow-left" />
        </footer>
      </Link>
    </section>
  );
};

