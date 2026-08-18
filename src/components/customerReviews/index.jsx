import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CustomerReviews = () => {
  const { reviews } = useApp();

  return (
    <section className="px-4 my-3">
      <div className={`bg-white rounded-3xl p-5 shadow-lg border-2 border-[#d4af37]/50 ${styles.reviewsContainer}`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-star text-[#d4af37] text-base" />
            <h3 className="text-sm sm:text-base font-black text-[#073822]">
              نظرات خریداران واقعی
            </h3>
          </div>
          <span className="bg-[#fef08a] text-[#073822] text-xs font-black px-2.5 py-1 rounded-full border border-[#d4af37]/40">
            ۴.۹ از ۵
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((rev, index) => (
            <div key={rev.id || index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#d4af37] text-xs">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <h4 className="text-xs font-black text-[#073822]">
                  {rev.userName}
                </h4>
              </div>

              <div>
                <span className="inline-block bg-[#f0fdf4] text-[#073822] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/40 mb-1.5">
                  {rev.productName || 'خریدار برنج کامفیروزی ممتاز'}
                </span>
                <p className="text-xs text-[#1e3a29] leading-relaxed text-justify font-medium">
                  {rev.comment}
                </p>
              </div>

              {index < reviews.length - 1 && (
                <div className="border-b border-gray-100 pt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
