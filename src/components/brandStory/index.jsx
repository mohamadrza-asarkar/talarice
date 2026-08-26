import React from 'react';
import { useApp } from '../../context';

export function BrandStory() {
  const { brandStory } = useApp();

  return (
    <section className="bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#d4af37]">
          {brandStory?.title || 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس'}
        </h3>
        <i className="fa-solid fa-circle-check text-[#d4af37]" />
      </div>

      <p className="text-xs text-gray-200 leading-relaxed text-justify">
        {brandStory?.description ||
          'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های نخی سفید مستقیماً به سفره‌های شما می‌رساند.'}
      </p>

      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
        <div>
          <span className="text-xs font-black text-[#d4af37] block">۱۰۰٪</span>
          <span className="text-[10px] text-gray-300">ارگانیک و تازه</span>
        </div>
        <div className="border-x border-white/10">
          <span className="text-xs font-black text-[#d4af37] block">گونی سفید</span>
          <span className="text-[10px] text-gray-300">بسته‌بندی نخی</span>
        </div>
        <div>
          <span className="text-xs font-black text-[#d4af37] block">۷ روز</span>
          <span className="text-[10px] text-gray-300">ضمانت برگشت</span>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
