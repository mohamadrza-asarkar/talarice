import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BlogPage = () => {
  const { articles, testTips } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'راهنمای خرید', label: 'راهنمای خرید' },
    { id: 'رازهای پخت', label: 'رازهای پخت' },
    { id: 'نگهداری برنج', label: 'نگهداری برنج' },
    { id: 'داستان و فرهنگ', label: 'داستان و فرهنگ' }
  ];

  const filteredArticles = (articles || []).filter((art) => {
    const matchCategory =
      selectedCategory === 'all' || art.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      art.title.includes(searchQuery) ||
      art.summary.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const featuredArticle = articles && articles.length > 0 ? articles[0] : null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentSubmitted(true);
    setTimeout(() => {
      setCommentSubmitted(false);
      setCommentText('');
      setCommentName('');
    }, 3000);
  };

  return (
    <div className={`px-4 py-3 pb-24 space-y-5 animate-fade-in ${styles.blogWrapper}`}>
      <div className="bg-gradient-to-r from-[#073b27] via-[#0b4f35] to-[#136f46] text-white p-4 rounded-2xl shadow-md border-2 border-[#d4af37]">
        <div className="flex items-center justify-between mb-1">
          <span className="bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white">
            مجله تخصصی طلا رایس
          </span>
          <span className="text-[11px] text-[#fef08a] font-bold flex items-center gap-1">
            <i className="fa-solid fa-feather-pointed" />
            <span>دانشنامه برنج کامفیروز</span>
          </span>
        </div>
        <h2 className="text-lg font-black text-[#fef08a]">
          مقالات، آموزش‌ها و اخبار شالیزار
        </h2>
        <p className="text-xs text-[#d1fae5] mt-1 leading-relaxed font-medium">
          هر آنچه باید درباره روش‌های اصیل پخت، تشخیص برنج ناب، و نگهداری بدانید.
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در مقالات و آموزش‌ها..."
          className="w-full bg-white border-2 border-[#d4af37]/40 rounded-xl px-9 py-2.5 text-xs text-[#073b27] placeholder-[#073b27]/50 focus:outline-none focus:border-[#073b27] shadow-sm font-bold"
        />
        <i className="fa-solid fa-magnifying-glass absolute right-3 top-3.5 text-[#d4af37] text-xs" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-3 text-gray-400 hover:text-gray-600 text-xs"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#073b27] text-[#fef08a] border-[#d4af37] shadow-sm'
                : 'bg-white text-[#073b27] border-[#d4af37]/30 hover:bg-[#f0fdf4]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {featuredArticle && selectedCategory === 'all' && !searchQuery && (
        <div
          onClick={() => setActiveArticle(featuredArticle)}
          className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-[#d4af37]/40 cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#073b27] via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2 py-0.5 rounded-full w-max mb-1 border border-white">
                ویژه و پربازدید
              </span>
              <h3 className="text-sm font-black text-[#fef08a] leading-snug">
                {featuredArticle.title}
              </h3>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-[#1e3a29] leading-relaxed line-clamp-2 font-medium">
              {featuredArticle.summary}
            </p>
            <div className="flex items-center justify-between text-[11px] text-[#073b27]/80 pt-2 border-t border-[#d4af37]/20 font-bold">
              <span className="flex items-center gap-1">
                <i className="fa-regular fa-clock text-[#d4af37]" />
                {featuredArticle.readTime}
              </span>
              <span className="flex items-center gap-1">
                <i className="fa-regular fa-calendar text-[#d4af37]" />
                {featuredArticle.date}
              </span>
              <span className="text-[#073b27] font-black text-xs flex items-center gap-1">
                ادامه مطلب
                <i className="fa-solid fa-arrow-left text-[10px]" />
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#073b27] flex items-center gap-1.5">
          <i className="fa-solid fa-newspaper text-[#d4af37]" />
          <span>فهرست مقالات و راهنماها ({filteredArticles.length})</span>
        </h3>

        {filteredArticles.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-[#073b27] border-2 border-[#d4af37]/30 space-y-2">
            <i className="fa-solid fa-magnifying-glass text-3xl text-[#d4af37]" />
            <p className="text-xs font-bold">مقاله‌ای با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white p-3 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 group"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#d4af37]/30 relative">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-[#073b27]/90 text-[#fef08a] text-[9px] font-black px-1.5 py-0.5 rounded">
                  {art.readTime}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#f0fdf4] text-[#073b27] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#d4af37]/40">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {art.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#073b27] leading-snug group-hover:text-[#136f46] transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 font-bold">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-user-pen text-[#d4af37]" />
                    {art.author}
                  </span>
                  <span className="flex items-center gap-1 text-[#073b27] font-black">
                    مطالعه
                    <i className="fa-solid fa-chevron-left text-[9px]" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#d4af37]/40">
        <h3 className="text-sm font-black text-[#073b27] mb-3 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-check text-[#d4af37]" />
          <span>توصیه‌های کلیدی کارشناسان طلا رایس</span>
        </h3>

        <div className="space-y-2.5">
          {testTips.map((tip, i) => (
            <div
              key={i}
              className="p-3 bg-[#f0fdf4] rounded-xl border border-[#d4af37]/30 flex gap-3 items-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#073b27] text-[#fef08a] flex items-center justify-center shadow-sm shrink-0 border border-[#d4af37]">
                <i className={`${tip.iconClass} text-sm`} />
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

      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl border-2 border-[#d4af37]">
            <div className="relative h-48 shrink-0">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4 text-white">
                <div>
                  <span className="bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1 inline-block border border-white">
                    {activeArticle.category}
                  </span>
                  <h3 className="text-sm font-black text-[#fef08a] leading-snug">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-3 left-3 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center border border-white/40"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between text-[11px] bg-[#f0fdf4] p-2.5 rounded-xl border border-[#d4af37]/30 text-[#073b27] font-black">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-pen text-[#d4af37]" />
                  {activeArticle.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-clock text-[#d4af37]" />
                  زمان مطالعه: {activeArticle.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-[#d4af37]" />
                  {activeArticle.date}
                </span>
              </div>

              <div className="space-y-3 text-[#1e3a29] leading-relaxed text-justify font-medium">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {paragraph}
                  </p>
                ))}
              </div>

              {activeArticle.proTips && activeArticle.proTips.length > 0 && (
                <div className="bg-[#fef08a]/60 p-3.5 rounded-2xl border-2 border-[#d4af37] space-y-2">
                  <h4 className="text-xs font-black text-[#073b27] flex items-center gap-1.5">
                    <i className="fa-solid fa-lightbulb text-[#b45309]" />
                    <span>نکات طلایی و توصیه‌های شالیکاران:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#073b27] font-bold">
                    {activeArticle.proTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#b45309] font-black">●</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-[#d4af37]/20 space-y-2.5">
                <h4 className="text-xs font-black text-[#073b27] flex items-center gap-1">
                  <i className="fa-regular fa-comments text-[#d4af37]" />
                  <span>دیدگاه یا سوال شما درباره این مقاله:</span>
                </h4>

                {commentSubmitted ? (
                  <div className="bg-[#f0fdf4] text-[#073b27] border border-[#d4af37] p-3 rounded-xl text-center font-black">
                    دیدگاه شما ثبت شد و پس از تایید نمایش داده می‌شود.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-xs text-[#073b27] font-bold focus:outline-none"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="متن نظر، سوال یا تجربه خود..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl p-2.5 text-xs text-[#073b27] font-bold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] font-black py-2.5 rounded-xl border border-[#d4af37]"
                    >
                      ثبت دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="bg-[#073b27] text-white px-5 py-2 rounded-xl text-xs font-black border border-[#d4af37]"
              >
                بستن مقاله
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
