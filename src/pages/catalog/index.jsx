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
    setSearchQuery,
    addToCart,
    setSelectedProduct
  } = useApp();

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedWeightFilter !== 'all') {
      const weightNum = Number(selectedWeightFilter);
      result = result.filter(
        (p) => p.weight === weightNum || p.weightOptions.includes(weightNum)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.farmer.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'weight') {
      result.sort((a, b) => a.weight - b.weight);
    }

    return result;
  }, [products, selectedCategory, selectedWeightFilter, searchQuery, sortBy]);

  return (
    <div className={`px-4 py-3 pb-24 space-y-4 animate-fade-in ${styles.catalogWrapper}`}>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] border-[#d4af37] shadow-md'
                  : 'bg-white text-[#073b27] border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              <i className={`${cat.iconClass} text-xs`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center bg-[#f0fdf4] p-2.5 rounded-2xl border-2 border-[#d4af37]/40 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-arrow-down-short-wide text-[#073b27]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#d4af37]/40 rounded-lg px-2 py-1 text-xs font-black text-[#073b27] outline-none"
          >
            <option value="popular">محبوب‌ترین</option>
            <option value="rating">بیشترین امتیاز</option>
            <option value="price-low">ارزان‌ترین کیسه</option>
            <option value="price-high">گران‌ترین کیسه</option>
            <option value="weight">بر اساس وزن</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-scale-balanced text-[#073b27]" />
          <select
            value={selectedWeightFilter}
            onChange={(e) => setSelectedWeightFilter(e.target.value)}
            className="bg-white border border-[#d4af37]/40 rounded-lg px-2 py-1 text-xs font-black text-[#073b27] outline-none"
          >
            <option value="all">همه وزن‌ها</option>
            <option value="5">۵ کیلویی</option>
            <option value="10">۱۰ کیلویی</option>
            <option value="20">۲۰ کیلویی</option>
            <option value="50">۵۰ کیلویی</option>
          </select>
        </div>
      </div>

      {searchQuery && (
        <div className="flex justify-between items-center bg-[#fefce8] p-2.5 rounded-xl border border-[#d4af37] text-xs">
          <span className="text-[#073b27] font-bold">
            نتایج جستجو برای: <strong className="font-black">«{searchQuery}»</strong>
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-red-600 hover:text-red-800 font-bold"
          >
            حذف فیلتر
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-[#073b27] border-2 border-[#d4af37]/40 shadow-sm">
          <i className="fa-solid fa-magnifying-glass-slash text-5xl text-[#d4af37] mb-3" />
          <h4 className="text-base font-black text-[#073b27] mb-1">
            هیچ گونی برنجی با این مشخصات یافت نشد
          </h4>
          <p className="text-xs text-[#1e3a29] font-medium mb-3">
            فیلترها را تغییر داده یا دسته‌بندی دیگری را امتحان کنید.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWeightFilter('all');
              setSearchQuery('');
            }}
            className="bg-[#073b27] text-[#fef08a] text-xs font-black px-4 py-2 rounded-xl border border-[#d4af37]"
          >
            نمایش همه محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-3 border-2 border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  className="relative h-36 rounded-xl overflow-hidden mb-2 bg-[#f0fdf4] cursor-pointer border border-[#d4af37]/30"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-[#073b27] text-[#fef08a] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#d4af37]">
                    {product.weight.toLocaleString('fa-IR')} کیلو
                  </span>
                  {product.isDeal && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                      تخفیف ویژه
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-2 left-2 bg-gradient-to-r from-[#073b27] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] hover:text-[#073b27] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-[#d4af37]"
                    title="افزودن کیسه به سبد"
                  >
                    <i className="fa-solid fa-plus text-[#fef08a] hover:text-[#073b27]" />
                  </button>
                </div>

                <h4
                  onClick={() => setSelectedProduct(product)}
                  className="font-black text-xs text-[#073b27] line-clamp-2 cursor-pointer hover:text-[#136f46] mb-1.5 leading-snug"
                >
                  {product.name}
                </h4>

                <div className="flex items-center gap-1 mb-2 text-xs">
                  <i className="fa-solid fa-star text-[#d4af37] text-xs" />
                  <span className="font-extrabold text-[#073b27]">
                    {product.rating.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ({product.reviewCount.toLocaleString('fa-IR')})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#d4af37]/20 flex flex-col items-end">
                {product.oldPrice && (
                  <span className="text-[11px] text-gray-400 line-through font-bold">
                    {product.oldPrice.toLocaleString('fa-IR')}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-[#073b27]">
                    {product.price.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] font-bold text-[#b45309]">تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
