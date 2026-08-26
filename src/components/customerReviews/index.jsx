import React from 'react';
import { useApp } from '../../context';

export function CustomerReviews() {
  const { reviews } = useApp();
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
          <i className="fa-solid fa-star text-yellow-400" />
          <span>نظرات مشتریان</span>
        </h3>
        <span className="text-[10px] text-gray-300">امتیاز ۴.۹ از ۵</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {reviews.slice(0, 3).map((rev, index) => (
          <div key={rev.id || index} className="border-b border-white/10 pb-2 last:border-none last:pb-0 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">{rev.userName}</span>
              <div className="flex text-yellow-400 text-[10px] gap-0.5">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-300">{rev.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CustomerReviews;
