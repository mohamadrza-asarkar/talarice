import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export function BrandStory() {
  const { brandStory } = useApp();

  return (
    <section className={styles.storyCard}>
      <h3 className={styles.title}>
        <span>{brandStory?.title ?? 'داستان و اصالت برنج طلا رایس'}</span>
        <i className="fa-solid fa-circle-check" />
      </h3>

      <p className={styles.description}>
        {brandStory?.description ??
          'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند.'}
      </p>

      <div className={styles.features}>
        <div className={styles.featureItem}>
          <strong>۱۰۰٪</strong>
          <span>ارگانیک و تازه</span>
        </div>
        <div className={`${styles.featureItem} ${styles.border}`}>
          <strong>گونی سفید</strong>
          <span>بسته‌بندی نخی ممتاز</span>
        </div>
        <div className={styles.featureItem}>
          <strong>۷ روز</strong>
          <span>ضمانت برگشت</span>
        </div>
      </div>
    </section>
  );
};



