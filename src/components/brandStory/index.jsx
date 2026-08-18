import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BrandStory = () => {
  const { brandStory } = useApp();

  if (!brandStory || !brandStory.title) return null;

  return (
    <section className="px-4 mb-6">
      <div className={`bg-gradient-to-br from-[#073b27] via-[#0b4f35] to-[#073b27] rounded-2xl p-4 shadow-xl border-2 border-[#d4af37] relative overflow-hidden text-white ${styles.storyCard}`}>
        <i className="fa-solid fa-wheat-awn absolute -left-6 -bottom-6 text-[130px] text-[#d4af37]/10 rotate-12 pointer-events-none select-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-circle-check text-lg text-[#fef08a]" />
            <h3 className="text-base font-black text-[#fef08a]">
              {brandStory.title}
            </h3>
          </div>
          <p className="text-xs text-[#d1fae5] leading-relaxed text-justify mb-3 font-medium">
            {brandStory.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {brandStory.badges &&
              brandStory.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-black/30 border border-[#d4af37]/50 text-[#fef08a] text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1"
                >
                  <i className="fa-solid fa-star text-[9px] text-[#d4af37]" />
                  <span>{badge}</span>
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
