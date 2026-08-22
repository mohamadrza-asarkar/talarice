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
          <i className="fa-solid fa-circle-check" style={{ fontSize: '1.125rem', color: '#fef08a', flexShrink: 0 }} />
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

          <div className={`${styles.featureItem} ${styles.featureBorder}`}>
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


/* 
* ==========================================
* PURE CSS EQUIVALENT (AUTO-GENERATED SKELETON)
* ==========================================
* 
* .border-\[#d4af37\]\/30 {
*   // Add pure CSS for border-[#d4af37]/30 here
* }
* 
* .border-t {
*   // Add pure CSS for border-t here
* }
* 
* .border-x {
*   // Add pure CSS for border-x here
* }
* 
* .fa-circle-check {
*   // Add pure CSS for fa-circle-check here
* }
* 
* .fa-solid {
*   // Add pure CSS for fa-solid here
* }
* 
* .flex {
*   // Add pure CSS for flex here
* }
* 
* .flex-col {
*   // Add pure CSS for flex-col here
* }
* 
* .font-black {
*   // Add pure CSS for font-black here
* }
* 
* .font-medium {
*   // Add pure CSS for font-medium here
* }
* 
* .font-normal {
*   // Add pure CSS for font-normal here
* }
* 
* .gap-2 {
*   // Add pure CSS for gap-2 here
* }
* 
* .grid {
*   // Add pure CSS for grid here
* }
* 
* .grid-cols-3 {
*   // Add pure CSS for grid-cols-3 here
* }
* 
* .items-center {
*   // Add pure CSS for items-center here
* }
* 
* .justify-between {
*   // Add pure CSS for justify-between here
* }
* 
* .leading-relaxed {
*   // Add pure CSS for leading-relaxed here
* }
* 
* .leading-tight {
*   // Add pure CSS for leading-tight here
* }
* 
* .mb-2\.5 {
*   // Add pure CSS for mb-2.5 here
* }
* 
* .mb-4 {
*   // Add pure CSS for mb-4 here
* }
* 
* .mt-0\.5 {
*   // Add pure CSS for mt-0.5 here
* }
* 
* .my-3 {
*   // Add pure CSS for my-3 here
* }
* 
* .pt-3 {
*   // Add pure CSS for pt-3 here
* }
* 
* .px-1 {
*   // Add pure CSS for px-1 here
* }
* 
* .px-4 {
*   // Add pure CSS for px-4 here
* }
* 
* .shrink-0 {
*   // Add pure CSS for shrink-0 here
* }
* 
* .sm\:text-base {
*   // Add pure CSS for sm:text-base here
* }
* 
* .text-\[#a7f3d0\] {
*   // Add pure CSS for text-[#a7f3d0] here
* }
* 
* .text-\[#d1fae5\] {
*   // Add pure CSS for text-[#d1fae5] here
* }
* 
* .text-\[#fef08a\] {
*   // Add pure CSS for text-[#fef08a] here
* }
* 
* .text-\[10px\] {
*   // Add pure CSS for text-[10px] here
* }
* 
* .text-center {
*   // Add pure CSS for text-center here
* }
* 
* .text-justify {
*   // Add pure CSS for text-justify here
* }
* 
* .text-lg {
*   // Add pure CSS for text-lg here
* }
* 
* .text-sm {
*   // Add pure CSS for text-sm here
* }
* 
* .text-xs {
*   // Add pure CSS for text-xs here
* }
* 
*/
