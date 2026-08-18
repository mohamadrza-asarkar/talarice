import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const RecipesPage = () => {
  const { recipes, testTips } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState(
    recipes && recipes.length > 0 ? recipes[0] : null
  );

  if (!selectedRecipe) return null;

  return (
    <div className={`px-4 py-3 pb-24 space-y-5 animate-fade-in ${styles.recipesWrapper}`}>
      <div className="bg-gradient-to-r from-[#073b27] via-[#0b4f35] to-[#136f46] text-white p-4 rounded-2xl shadow-md border-2 border-[#d4af37]">
        <span className="bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1 inline-block border border-white">
          راهنمای تخصصی
        </span>
        <h2 className="text-lg font-black text-[#fef08a]">
          طرز پخت و رازهای برنج کامفیروزی
        </h2>
        <p className="text-xs text-[#d1fae5] mt-1 leading-relaxed font-medium">
          چگونه برنج اصیل کامفیروز را به بهترین شکل کته یا آبکش کنیم؟
        </p>
      </div>

      <div className="flex gap-2 bg-[#f0fdf4] p-1 rounded-xl border border-[#d4af37]/40">
        {recipes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRecipe(r)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all border-2 text-center ${
              selectedRecipe.id === r.id
                ? 'bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] border-[#d4af37] shadow-md'
                : 'bg-white text-[#073b27] border-[#d4af37]/30 hover:bg-[#f0fdf4]'
            }`}
          >
            {r.title.split('(')[0]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#d4af37]/40 space-y-4">
        <div className="relative h-44 rounded-xl overflow-hidden border border-[#d4af37]/30">
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#073b27] via-transparent to-transparent flex items-end p-3 text-white">
            <div>
              <h3 className="text-sm font-black text-[#fef08a]">
                {selectedRecipe.title}
              </h3>
              <p className="text-[11px] text-[#d1fae5] font-medium">
                {selectedRecipe.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-[#f0fdf4] p-3 rounded-xl text-center text-xs font-bold border border-[#d4af37]/30">
          <div>
            <span className="text-[#b45309] block text-[10px] font-extrabold">
              زمان پخت:
            </span>
            <span className="text-[#073b27] font-black">
              {selectedRecipe.cookTime}
            </span>
          </div>
          <div className="border-x border-[#d4af37]/30">
            <span className="text-[#b45309] block text-[10px] font-extrabold">
              تعداد نفرات:
            </span>
            <span className="text-[#073b27] font-black">
              {selectedRecipe.servings}
            </span>
          </div>
          <div>
            <span className="text-[#b45309] block text-[10px] font-extrabold">
              سطح دشواری:
            </span>
            <span className="text-[#073b27] font-black">
              {selectedRecipe.difficulty}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#073b27] mb-2 flex items-center gap-1.5">
            <i className="fa-solid fa-list-check text-[#d4af37]" />
            <span>مواد لازم:</span>
          </h4>
          <ul className="space-y-1 bg-[#f0fdf4] p-3 rounded-xl border border-[#d4af37]/30 text-xs text-[#073b27] font-bold">
            {selectedRecipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#073b27] mb-2 flex items-center gap-1.5">
            <i className="fa-solid fa-fire-burner text-[#d4af37]" />
            <span>مراحل پخت گام به گام:</span>
          </h4>
          <div className="space-y-2">
            {selectedRecipe.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex gap-2.5 p-2.5 bg-[#f0fdf4] rounded-xl border border-[#d4af37]/30"
              >
                <span className="w-5 h-5 rounded-full bg-[#073b27] text-[#fef08a] font-black text-xs flex items-center justify-center shrink-0 border border-[#d4af37]">
                  {idx + 1}
                </span>
                <p className="text-xs text-[#1e3a29] leading-relaxed text-justify font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fef08a]/60 p-3 rounded-xl border-2 border-[#d4af37] text-xs text-[#073b27]">
          <h5 className="font-black mb-1 flex items-center gap-1.5">
            <i className="fa-solid fa-lightbulb text-[#b45309]" />
            <span>نکات کلیدی طلایی:</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 font-bold">
            {selectedRecipe.proTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#d4af37]/40">
        <h3 className="text-sm font-black text-[#073b27] mb-3 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-check text-[#d4af37]" />
          <span>راهنمای تشخیص برنج کامفیروزی اصل از تقلبی</span>
        </h3>

        <div className="space-y-2.5">
          {testTips.map((tip, i) => (
            <div
              key={i}
              className="p-3 bg-[#f0fdf4] rounded-xl border border-[#d4af37]/30 flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#073b27] text-[#fef08a] flex items-center justify-center shadow-sm shrink-0 border border-[#d4af37]">
                <i className={`${tip.iconClass} text-base`} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#073b27] mb-0.5">
                  {tip.title}
                </h4>
                <p className="text-[11px] text-[#1e3a29] leading-relaxed text-justify font-medium">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
