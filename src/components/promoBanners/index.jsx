import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const PromoBanners = () => {
  const { setActiveTab } = useApp();

  const banners = [
    {
      id: 'wholesale',
      theme: 'dark',
      badge: 'فروش ویژه سازمانی',
      title: 'خرید عمده تناژ بالا',
      subtitle: 'تخفیف ویژه رستوران‌ها و هیئت‌ها',
      actionText: 'استعلام قیمت عمده',
      onClick: () => setActiveTab('profile')
    },
    {
      id: 'cooking_guide',
      theme: 'light',
      badge: 'دانشنامه پخت',
      title: 'راهنمای پخت مجلسی',
      subtitle: 'چگونه برنج قد بکشد و دان درآید',
      actionText: 'مطالعه آموزش',
      onClick: () => setActiveTab('blog')
    }
  ];

  return (
    <section className={styles.section}>
      {banners.map((b) => {
        const isDark = b.theme === 'dark';
        return (
          <article
            key={b.id}
            onClick={b.onClick}
            className={`${styles.bannerCard} ${isDark ? styles.bannerDark : styles.bannerLight}`}
          >
            <div className={styles.contentWrapper}>
              <span className={isDark ? styles.badgeDark : styles.badgeLight}>{b.badge}</span>
              <h4 className={isDark ? styles.titleDark : styles.titleLight}>{b.title}</h4>
              <p className={isDark ? styles.subtitleDark : styles.subtitleLight}>{b.subtitle}</p>
            </div>

            <div className={styles.actionRow}>
              <span className={isDark ? styles.actionTextDark : styles.actionTextLight}>
                {b.actionText}
              </span>
              <i className="fa-solid fa-arrow-left" />
            </div>
          </article>
        );
      })}
    </section>
  );
};
