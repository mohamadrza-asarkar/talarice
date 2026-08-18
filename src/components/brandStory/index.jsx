import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BrandStory = () => {
  const { brandStory } = useApp();

  return (
    <section className="px-4 my-3">
      <div className={`bg-[#063822] rounded-3xl p-5 shadow-xl border-2 border-[#d4af37]/60 text-white relative overflow-hidden ${styles.storyCard}`}>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm sm:text-base font-black text-[#fef08a] leading-tight">
            {brandStory?.title || 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس'}
          </h3>
          <i className="fa-solid fa-circle-check text-lg text-[#fef08a] shrink-0" />
        </div>

        <p className="text-xs text-[#d1fae5] leading-relaxed text-justify mb-4 font-normal">
          {brandStory?.description ||
            'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند. عطر تازگی، پخت نرم و قد کشیدن عالی، تضمین همیشگی طلا رایس است.'}
        </p>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#d4af37]/30 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-[#fef08a]">۱۰۰٪</span>
            <span className="text-[10px] text-[#a7f3d0] font-medium mt-0.5">
              ارگانیک و تازه
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#d4af37]/30 px-1">
            <span className="text-xs font-black text-[#fef08a]">گونی سفید</span>
            <span className="text-[10px] text-[#a7f3d0] font-medium mt-0.5">
              بسته‌بندی نخی ممتاز
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-[#fef08a]">۷ روز</span>
            <span className="text-[10px] text-[#a7f3d0] font-medium mt-0.5">
              ضمانت برگشت
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
