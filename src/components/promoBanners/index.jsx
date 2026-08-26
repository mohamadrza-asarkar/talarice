import React from 'react';
import { Link } from 'react-router-dom';
import { getPromoBanners } from '../../api/promoBanners';

export function PromoBanners() {
  const banners = getPromoBanners();

  return (
    <section className="grid grid-cols-2 gap-2">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          to="/catalog"
          className="bg-[#073b27] border border-[#d4af37]/20 rounded-xl p-3 flex flex-col justify-between gap-2 hover:border-[#d4af37]/40 transition-colors"
        >
          <div>
            <span className="text-[10px] text-[#d4af37] font-bold block">{banner.badge}</span>
            <h4 className="text-xs font-bold text-white mt-1">{banner.title}</h4>
            <p className="text-[11px] text-gray-300 mt-0.5">{banner.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#d4af37] font-bold">
            <span>{banner.actionText}</span>
            <i className="fa-solid fa-arrow-left text-[9px]" />
          </div>
        </Link>
      ))}
    </section>
  );
}

export default PromoBanners;
