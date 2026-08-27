import React from 'react';
import { Logo } from '../logo';
import styles from './style.module.css';

export const Footer = () => {
  const features = [
    { icon: 'fa-solid fa-truck-fast', title: 'ارسال سریع کشوری', sub: 'پست پیشتاز و باربری' },
    { icon: 'fa-solid fa-shield-halved', title: 'ضمانت اصالت و عطر', sub: '۷ روز بازگشت وجه' },
    { icon: 'fa-solid fa-seedling', title: 'برنج تازه شالیزار', sub: 'کامفیروز استان فارس' },
    { icon: 'fa-solid fa-headset', title: 'پشتیبانی مشتریان', sub: 'مشاوره آنلاین خرید' }
  ];

  const socials = [
    { icon: 'fa-brands fa-telegram', href: 'https://t.me' },
    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com' },
    { icon: 'fa-brands fa-whatsapp', href: 'https://whatsapp.com' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.branding}>
        <Logo />
        <h3 className={styles.brandTitle}>فروشگاه آنلاین برنج طلا رایس</h3>
        <p className={styles.brandDesc}>
          عرضه‌کننده مستقیم برنج ۱۰۰٪ اصل و معطر کامفیروز شیراز در گونی‌های نخی سفید سفارشی
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureItem}>
            <i className={f.icon} />
            <div>
              <strong>{f.title}</strong>
              <small>{f.sub}</small>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contactInfo}>
        <div className={styles.phoneRow}>
          <span><i className="fa-solid fa-phone" /> شماره پشتیبانی:</span>
          <strong>۰۹۱۷۰۰۰۰۰۰۰</strong>
        </div>
        <p className={styles.addressRow}>
          <i className="fa-solid fa-location-dot" /> استان فارس، مرودشت، منطقه کامفیروز
        </p>
      </div>

      <div className={styles.socials}>
        {socials.map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noreferrer" className={styles.socialLink}>
            <i className={s.icon} />
          </a>
        ))}
      </div>

      <small className={styles.copyright}>
        تمامی حقوق برای برند طلا رایس (Tala Rice) محفوظ است.
      </small>
    </footer>
  );
};
