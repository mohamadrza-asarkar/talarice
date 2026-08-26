import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CustomerReviews = () => {
  const { reviews } = useApp();

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.reviewsContainer}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <i className="fa-solid fa-star" style={{ color: '#d4af37', fontSize: '1rem' }} />
            <h3 className={styles.title}>
              نظرات خریداران واقعی
            </h3>
          </div>
          <span className={styles.ratingBadge}>
            ۴.۹ از ۵
          </span>
        </div>

        <div className={styles.reviewsList}>
          {reviews.map((rev, index) => (
            <div key={rev.id || index} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <h4 className={styles.userName}>
                  {rev.userName}
                </h4>
              </div>

              <div>
                <span className={styles.productTag}>
                  {rev.productName || 'خریدار برنج کامفیروزی ممتاز'}
                </span>
                <p className={styles.commentText}>
                  {rev.comment}
                </p>
              </div>

              {index < reviews.length - 1 && (
                <div className={styles.divider} />
              )}
            </div>
          ))}
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
* .bg-\[#f0fdf4\] {
*   // Add pure CSS for bg-[#f0fdf4] here
* }
* 
* .bg-\[#fef08a\] {
*   // Add pure CSS for bg-[#fef08a] here
* }
* 
* .border {
*   // Add pure CSS for border here
* }
* 
* .border-\[#d4af37\]\/40 {
*   // Add pure CSS for border-[#d4af37]/40 here
* }
* 
* .border-b {
*   // Add pure CSS for border-b here
* }
* 
* .border-gray-100 {
*   // Add pure CSS for border-gray-100 here
* }
* 
* .fa-solid {
*   // Add pure CSS for fa-solid here
* }
* 
* .fa-star {
*   // Add pure CSS for fa-star here
* }
* 
* .flex {
*   // Add pure CSS for flex here
* }
* 
* .font-black {
*   // Add pure CSS for font-black here
* }
* 
* .font-bold {
*   // Add pure CSS for font-bold here
* }
* 
* .font-medium {
*   // Add pure CSS for font-medium here
* }
* 
* .gap-1 {
*   // Add pure CSS for gap-1 here
* }
* 
* .gap-1\.5 {
*   // Add pure CSS for gap-1.5 here
* }
* 
* .inline-block {
*   // Add pure CSS for inline-block here
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
* .mb-1\.5 {
*   // Add pure CSS for mb-1.5 here
* }
* 
* .mb-4 {
*   // Add pure CSS for mb-4 here
* }
* 
* .my-3 {
*   // Add pure CSS for my-3 here
* }
* 
* .pb-3 {
*   // Add pure CSS for pb-3 here
* }
* 
* .pt-2 {
*   // Add pure CSS for pt-2 here
* }
* 
* .px-2 {
*   // Add pure CSS for px-2 here
* }
* 
* .px-2\.5 {
*   // Add pure CSS for px-2.5 here
* }
* 
* .px-4 {
*   // Add pure CSS for px-4 here
* }
* 
* .py-0\.5 {
*   // Add pure CSS for py-0.5 here
* }
* 
* .py-1 {
*   // Add pure CSS for py-1 here
* }
* 
* .rounded-full {
*   // Add pure CSS for rounded-full here
* }
* 
* .sm\:text-base {
*   // Add pure CSS for sm:text-base here
* }
* 
* .space-y-2 {
*   // Add pure CSS for space-y-2 here
* }
* 
* .space-y-4 {
*   // Add pure CSS for space-y-4 here
* }
* 
* .text-\[#073822\] {
*   // Add pure CSS for text-[#073822] here
* }
* 
* .text-\[#1e3a29\] {
*   // Add pure CSS for text-[#1e3a29] here
* }
* 
* .text-\[#d4af37\] {
*   // Add pure CSS for text-[#d4af37] here
* }
* 
* .text-\[10px\] {
*   // Add pure CSS for text-[10px] here
* }
* 
* .text-base {
*   // Add pure CSS for text-base here
* }
* 
* .text-justify {
*   // Add pure CSS for text-justify here
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
