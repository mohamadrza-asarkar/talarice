import React from 'react';
import { Logo } from '../logo';
import styles from './style.module.css';

export function Footer() {
  const features = [
    { icon: 'fa-solid fa-truck-fast', title: 'ارسال سریع کشوری', sub: 'پست پیشتاز و باربری' },
    { icon: 'fa-solid fa-shield-halved', title: 'ضمانت اصالت و عطر', sub: '۷ روز بازگشت وجه' },
    { icon: 'fa-solid fa-seedling', title: 'برنج تازه شالیزار', sub: 'کامفیروز استان فارس' },
    { icon: 'fa-solid fa-headset', title: 'پشتیبانی مشتریان', sub: 'مشاوره آنلاین خرید' }
  ];

  const socials = [
    { icon: 'fa-brands fa-telegram', href: 'https://t.me', label: 'Telegram' },
    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'fa-brands fa-whatsapp', href: 'https://whatsapp.com', label: 'WhatsApp' }
  ];

  return (
    <footer className={styles.footer}>
      <header className={styles.branding}>
        <Logo />
        <h3 className={styles.brandTitle}>فروشگاه آنلاین برنج طلا رایس</h3>
        <p className={styles.brandDesc}>
          عرضه‌کننده مستقیم برنج ۱۰۰٪ اصل و معطر کامفیروز شیراز در گونی‌های نخی سفید سفارشی
        </p>
      </header>

      <div className={styles.featuresGrid}>
        {features.map(function (f, i) {
          return (
            <div key={i} className={styles.featureItem}>
              <i className={f.icon} />
              <div>
                <strong>{f.title}</strong>
                <small>{f.sub}</small>
              </div>
            </div>
          );
        })}
      </div>

      <address className={styles.contactInfo}>
        <div className={styles.phoneRow}>
          <span><i className="fa-solid fa-phone" /> شماره پشتیبانی:</span>
          <strong>۰۹۱۷۰۰۰۰۰۰۰</strong>
        </div>
        <p className={styles.addressRow}>
          <i className="fa-solid fa-location-dot" /> استان فارس، مرودشت، منطقه کامفیروز
        </p>
      </address>

      <nav className={styles.socials} aria-label="شبکه‌های اجتماعی">
        {socials.map(function (s, i) {
          return (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label={s.label}
            >
              <i className={s.icon} />
            </a>
          );
        })}
      </nav>

      <small className={styles.copyright}>
        تمامی حقوق برای برند طلا رایس (Tala Rice) محفوظ است.
      </small>
    </footer>
  );
}

