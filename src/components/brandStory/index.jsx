import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BrandStory = () => {
  const { brandStory } = useApp();

  return (
    <section className={styles.storyCard}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          {brandStory?.title ?? 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس'}
        </h3>
        <i className="fa-solid fa-circle-check" />
      </header>

      <p className={styles.description}>
        {brandStory?.description ??
          'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند.'}
      </p>

      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <strong>۱۰۰٪</strong>
          <span>ارگانیک و تازه</span>
        </div>
        <div className={`${styles.featureItem} ${styles.featureBorder}`}>
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

