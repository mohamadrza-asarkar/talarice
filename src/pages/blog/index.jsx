import React, { useState } from 'react';
import { useApp } from '../../context';

export function BlogPage() {
  const { articles } = useApp();
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <div className="p-4 flex flex-col gap-4 text-white">
      <div className="bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-4 text-center">
        <h2 className="text-sm font-black text-[#d4af37]">وبلاگ و دانشنامه برنج کامفیروز</h2>
        <p className="text-xs text-gray-300 mt-1">آموزش‌ها و نکات پخت برنج اصیل ایرانی</p>
      </div>

      <div className="flex flex-col gap-3">
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-10 text-xs text-gray-400">مقاله‌ای یافت نشد.</div>
        ) : (
          articles.map((art) => (
            <div
              key={art._id || art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-[#073b27] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#d4af37]/40 transition-colors flex"
            >
              <img src={art.image} alt={art.title} className="w-24 h-24 object-cover" />
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-[#d4af37] font-bold">{art.category || 'آموزش'}</span>
                  <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{art.title}</h3>
                </div>
                <span className="text-[10px] text-gray-400">{art.date || 'طلا رایس'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveArticle(null)} />
          <div className="relative w-full max-w-lg bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-5 z-10 text-white max-h-[85vh] overflow-y-auto flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-[#d4af37]">{activeArticle.title}</h3>
              <button onClick={() => setActiveArticle(null)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>
            <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-44 object-cover rounded-xl" />
            <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
              {Array.isArray(activeArticle.content)
                ? activeArticle.content.join('\n\n')
                : activeArticle.content || activeArticle.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
