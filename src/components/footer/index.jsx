import React from 'react';
import { Logo } from '../logo';
import styles from './style.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.brandingSection}>
        <div className={styles.logoWrapper}>
          <Logo variant="circle" />
        </div>
        <h3 className={styles.brandTitle}>
          فروشگاه آنلاین برنج طلا رایس
        </h3>
        <p className={styles.brandDescription}>
          عرضه‌کننده مستقیم برنج ۱۰۰٪ اصل و معطر کامفیروز شیراز در گونی‌های نخی سفید سفارشی
        </p>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <i className={`fa-solid fa-truck-fast ${styles.featureIcon}`} />
          <div>
            <div className={styles.featureTitle}>ارسال سریع کشوری</div>
            <div className={styles.featureSub}>پست پیشتاز و باربری</div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <i className={`fa-solid fa-shield-halved ${styles.featureIcon}`} />
          <div>
            <div className={styles.featureTitle}>ضمانت اصالت و عطر</div>
            <div className={styles.featureSub}>۷ روز بازگشت وجه</div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <i className={`fa-solid fa-seedling ${styles.featureIcon}`} />
          <div>
            <div className={styles.featureTitle}>برنج تازه شالیزار</div>
            <div className={styles.featureSub}>کامفیروز استان فارس</div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <i className={`fa-solid fa-headset ${styles.featureIcon}`} />
          <div>
            <div className={styles.featureTitle}>پشتیبانی مشتریان</div>
            <div className={styles.featureSub}>مشاوره آنلاین خرید</div>
          </div>
        </div>
      </div>

      <div className={styles.contactSection}>
        <div className={styles.contactRow}>
          <div className={styles.contactLabel}>
            <i className="fa-solid fa-phone" />
            <span>شماره پشتیبانی و ثبت تلفنی:</span>
          </div>
          <span className={styles.phoneNumber}>۰۹۱۷۰۰۰۰۰۰۰</span>
        </div>

        <div className={styles.addressRow}>
          <i className="fa-solid fa-location-dot" />
          <span>آدرس شالیزار: استان فارس، مرودشت، منطقه کامفیروز</span>
        </div>
      </div>

      <div className={styles.socialSection}>
        <a href="https://t.me" target="_blank" rel="noreferrer" className={styles.socialLink}>
          <i className="fa-brands fa-telegram" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
          <i className="fa-brands fa-instagram" />
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
          <i className="fa-brands fa-whatsapp" />
        </a>
      </div>

      <div className={styles.copyright}>
        تمامی حقوق برای برند طلا رایس (Tala Rice) محفوظ است.
      </div>
    </footer>
  );
};
