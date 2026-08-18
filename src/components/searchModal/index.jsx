import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const SearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    addToCart,
    setSelectedProduct,
    setActiveTab,
    setSelectedCategory
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularTags = [
    'برنج کامفیروز ممتاز',
    'گونی ۱۰ کیلویی',
    'برنج نیم‌دانه معطر',
    'پک خانواده',
    'شگفت‌انگیز'
  ];

  const filteredResults = products.filter((item) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || item.category === activeCategoryFilter;

    if (!searchQuery.trim()) {
      return matchesCategory;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesText =
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.farmer && item.farmer.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    return matchesCategory && matchesText;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsSearchOpen(false);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3.5 bg-[#042a1b] border-b border-[#d4af37]/40 text-white flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در برنج‌های طلا رایس..."
              className="w-full bg-white text-xs font-bold text-[#073822] pr-9 pl-8 py-2.5 rounded-full border-2 border-[#d4af37] focus:outline-none placeholder:text-gray-400 shadow-inner"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-3 text-[#073822] text-sm" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="پاک کردن"
              >
                <i className="fa-solid fa-circle-xmark text-sm" />
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#073822] hover:bg-[#0d5336] text-[#fef08a] border border-[#d4af37] flex items-center justify-center text-sm transition-all active:scale-95 shrink-0"
            aria-label="بستن"
          >
            <i className="fa-solid fa-xmark text-base" />
          </button>
        </div>

        <div className="px-3.5 py-2.5 bg-[#f0fdf4] border-b border-[#d4af37]/20 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-black text-[#073822] whitespace-nowrap pl-1">
            دسته‌بندی:
          </span>
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all whitespace-nowrap border ${
              activeCategoryFilter === 'all'
                ? 'bg-[#073822] text-[#fef08a] border-[#d4af37] shadow-sm'
                : 'bg-white text-[#073822] border-gray-200 hover:border-[#d4af37]'
            }`}
          >
            همه
          </button>
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[#073822] text-[#fef08a] border-[#d4af37] shadow-sm'
                    : 'bg-white text-[#073822] border-gray-200 hover:border-[#d4af37]'
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {!searchQuery.trim() && (
          <div className="px-3.5 py-2.5 bg-white border-b border-gray-100">
            <div className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
              <i className="fa-solid fa-fire text-[#b45309] text-xs" />
              <span>جستجوهای پرطرفدار:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="bg-[#f8fafc] hover:bg-[#fef08a]/40 text-[#073822] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#d4af37] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`p-3 flex-1 overflow-y-auto space-y-2.5 ${styles.resultsList}`}>
          <div className="flex items-center justify-between px-1 text-[11px] text-gray-500 font-bold">
            <span>
              {searchQuery ? `نتایج جستجو برای «${searchQuery}»` : 'محصولات منتخب طلا رایس'}
            </span>
            <span className="text-[#073822] font-black">
              {filteredResults.length.toLocaleString('fa-IR')} محصول
            </span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-[#fef08a]/30 border-2 border-[#d4af37] flex items-center justify-center text-[#073822] text-2xl mb-3 shadow-inner">
                <i className="fa-solid fa-wheat-awn-circle-exclamation text-[#b45309]" />
              </div>
              <h4 className="text-xs font-black text-[#073822] mb-1">
                محصولی با این مشخصات یافت نشد
              </h4>
              <p className="text-[11px] text-gray-500 max-w-xs mb-3">
                می‌توانید نام محصول، وزن کیسه یا دسته‌بندی دیگری را جستجو فرمایید.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('all');
                }}
                className="bg-[#073822] text-[#fef08a] text-xs font-black px-4 py-2 rounded-xl border border-[#d4af37] shadow-sm hover:bg-[#0d5336] transition-colors"
              >
                مشاهده همه محصولات
              </button>
            </div>
          ) : (
            filteredResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-[#f8fafc] hover:bg-[#f0fdf4] p-2.5 rounded-2xl border border-gray-200 hover:border-[#d4af37] shadow-sm flex items-center gap-3 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 relative shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-[#073822] text-[#fef08a] text-[8px] font-black px-1 rounded">
                    {product.weight}k
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-[#073822] truncate group-hover:text-[#136f46] mb-0.5">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                    <span className="bg-[#e2e8f0] text-gray-700 font-bold px-1.5 py-0.2 rounded">
                      گونی سفید
                    </span>
                    <span className="text-[#b45309] font-black flex items-center gap-0.5">
                      <i className="fa-solid fa-star text-[9px]" /> {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-[#073822]">
                    <span>{product.price.toLocaleString('fa-IR')}</span>
                    <span className="text-[9px] text-gray-500 font-normal">تومان</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleQuickAdd(e, product)}
                  className="w-8 h-8 rounded-full bg-[#073822] hover:bg-[#0d5336] text-[#fef08a] border border-[#d4af37] flex items-center justify-center text-xs shadow transition-transform active:scale-90 shrink-0"
                  title="افزودن به سبد خرید"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-[#f8fafc] border-t border-gray-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setActiveTab('catalog');
              if (activeCategoryFilter !== 'all') {
                setSelectedCategory(activeCategoryFilter);
              }
            }}
            className="w-full bg-[#073822] text-[#fef08a] font-black py-2.5 rounded-xl border border-[#d4af37] shadow-sm flex items-center justify-center gap-2 hover:bg-[#0d5336] transition-all"
          >
            <span>مشاهده همه محصولات در کاتالوگ</span>
            <i className="fa-solid fa-arrow-left text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};
