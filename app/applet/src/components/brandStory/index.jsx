import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BrandStory = () => {
  const { brandStory } = useApp();

  return (
    <section className={styles.section}>
      <div className={styles.storyCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {brandStory?.title || 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس'}
          </h3>
          <i className={`fa-solid fa-circle-check ${styles.checkIcon}`} />
        </div>
        
        <p className={styles.description}>
          {brandStory?.description ||
            'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند. عطر تازگی، پخت نرم و قد کشیدن عالی، تضمین همیشگی طلا رایس است.'}
        </p>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <span className={styles.featureValue}>۱۰۰٪</span>
            <span className={styles.featureLabel}>
              ارگانیک و تازه
            </span>
          </div>
          <div className={`${styles.featureItem} ${styles.featureBordered}`}>
            <span className={styles.featureValue}>گونی سفید</span>
            <span className={styles.featureLabel}>
              بسته‌بندی نخی ممتاز
            </span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureValue}>۷ روز</span>
            <span className={styles.featureLabel}>
              ضمانت برگشت
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
