import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BrandStory = () => {
  const { brandStory } = useApp();

  const features = [
    { value: '۱۰۰٪', label: 'ارگانیک و تازه' },
    { value: 'گونی سفید', label: 'بسته‌بندی نخی ممتاز', hasBorder: true },
    { value: '۷ روز', label: 'ضمانت برگشت' }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.storyCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {brandStory?.title ?? 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس'}
          </h3>
          <i className="fa-solid fa-circle-check" />
        </div>

        <p className={styles.description}>
          {brandStory?.description ??
            'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند.'}
        </p>

        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={`${styles.featureItem} ${f.hasBorder ? styles.featureBorder : ''}`}>
              <strong className={styles.featureValue}>{f.value}</strong>
              <span className={styles.featureLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
