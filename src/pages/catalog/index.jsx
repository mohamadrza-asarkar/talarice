import React, { useMemo } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CatalogPage = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedWeightFilter,
    setSelectedWeightFilter,
    sortBy,
    setSortBy,
    searchQuery,
    addToCart,
    setSelectedProduct,
    setIsSearchOpen
  } = useApp();

  const weightOptions = [
    { label: 'همه وزن‌ها', value: 'all' },
    { label: '۵ کیلو', value: '5' },
    { label: '۱۰ کیلو', value: '10' },
    { label: '۲۰ کیلو', value: '20' },
    { label: '۵۰ کیلو', value: '50' }
  ];

  const sortOptions = [
    { label: 'پرفروش‌ترین', value: 'popular' },
    { label: 'ارزان‌ترین', value: 'price-low' },
    { label: 'گران‌ترین', value: 'price-high' },
    { label: 'بالاترین امتیاز', value: 'rating' }
  ];

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedWeightFilter !== 'all') {
      const weightNum = Number(selectedWeightFilter);
      result = result.filter(
        (p) => p.weight === weightNum || (p.weightOptions && p.weightOptions.includes(weightNum))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.farmer && p.farmer.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, selectedWeightFilter, searchQuery, sortBy]);

  return (
    <div className={`px-4 py-3 pb-24 space-y-3.5 animate-fade-in ${styles.catalogWrapper}`}>
      <div className="bg-[#063822] text-white p-4 rounded-3xl shadow-xl border-2 border-[#d4af37]/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="bg-[#fef08a] text-[#073822] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            شالیزارهای کامفیروز فارس
          </span>
          <span className="text-[11px] text-[#fef08a] font-black">
            {filtered.length.toLocaleString('fa-IR')} گونی برنج
          </span>
        </div>
        <h2 className="text-base font-black text-white">
          فهرست گونی‌های برنج معطر کامفیروزی
        </h2>
        <p className="text-xs text-[#a7f3d0] mt-1 font-normal">
          عرضه مستقیم در کیسه‌های پارچه‌ای نخی سفید با گارانتی اصالت و عطر
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-black transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#fef08a] text-[#073822] border-[#d4af37] shadow-md scale-102'
                  : 'bg-[#063822] text-[#d1fae5] border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#0a4d30]'
              }`}
            >
              {cat.iconClass && <i className={`${cat.iconClass} text-[11px]`} />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {weightOptions.map((opt) => {
          const isSelected = selectedWeightFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedWeightFilter(opt.value)}
              className={`whitespace-nowrap px-3 py-1 rounded-xl text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#d4af37] text-[#042a1b] border-[#fef08a] font-black shadow-sm'
                  : 'bg-[#042a1b] text-[#a7f3d0] border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {sortOptions.map((opt) => {
            const isSelected = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#fef08a] text-[#073822] font-black'
                    : 'text-[#d1fae5] hover:text-[#fef08a]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-[#fef08a] hover:text-[#d4af37] text-xs font-bold flex items-center gap-1 shrink-0 p-1 cursor-pointer"
        >
          <i className="fa-solid fa-magnifying-glass text-xs" />
          <span>جستجو</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#063822] rounded-3xl p-8 text-center border-2 border-[#d4af37]/40 text-white my-6">
          <div className="w-14 h-14 rounded-full bg-[#042a1b] border-2 border-[#d4af37] flex items-center justify-center mx-auto mb-3 text-[#fef08a] text-xl">
            <i className="fa-solid fa-wheat-awn-circle-exclamation" />
          </div>
          <h4 className="text-sm font-black text-[#fef08a] mb-1">
            موردی با این فیلترها یافت نشد
          </h4>
          <p className="text-xs text-[#a7f3d0] mb-4">
            می‌توانید فیلتر وزن یا دسته‌بندی را تغییر دهید تا تمام محصولات نمایش داده شوند.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWeightFilter('all');
            }}
            className="bg-[#fef08a] text-[#073822] text-xs font-black px-4 py-2 rounded-xl shadow-md hover:bg-[#fde047] transition-all"
          >
            نمایش همه محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-3 shadow-md flex flex-col justify-between border-2 border-[#d4af37]/40 relative group"
            >
              <div>
                <div
                  className="relative h-36 rounded-xl overflow-hidden mb-2 bg-[#f8fafc] cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-[#073822] text-[#fef08a] text-[9px] font-black px-2 py-0.5 rounded-md border border-[#d4af37]">
                    گونی سفید {product.weight}k
                  </span>
                  <span className="absolute top-1.5 left-1.5 bg-[#16a34a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <i className="fa-solid fa-leaf text-[8px]" /> معطر
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-1.5 left-1.5 bg-[#073822] text-[#fef08a] w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-[#d4af37] hover:bg-[#0a4d30]"
                    aria-label="افزودن سریع"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                  </button>
                </div>

                <h4
                  onClick={() => setSelectedProduct(product)}
                  className="font-black text-xs text-[#073822] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-1 leading-snug min-h-[32px]"
                >
                  {product.name}
                </h4>

                <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">
                  {product.description}
                </p>
              </div>

              <div>
                <div className="space-y-0.5 mb-2">
                  {product.oldPrice && (
                    <div className="text-[10px] text-gray-400 line-through text-left font-bold">
                      {product.oldPrice.toLocaleString('fa-IR')}
                    </div>
                  )}
                  <div className="text-xs font-black text-[#073822] text-left flex items-center justify-end gap-1">
                    <span>{product.price.toLocaleString('fa-IR')}</span>
                    <span className="text-[10px] text-gray-500 font-normal">تومان</span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#073822] hover:bg-[#0a4d30] text-[#fef08a] text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all border border-[#d4af37]"
                >
                  <i className="fa-solid fa-cart-plus text-xs" />
                  <span>افزودن به سبد</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
