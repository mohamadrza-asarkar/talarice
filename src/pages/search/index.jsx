import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const SearchPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct
  } = useApp();
  
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const filteredResults = products.filter((item) => {
    if (!searchQuery.trim()) {
      return false; // Don't match anything if no query
    }

    const q = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.farmer && item.farmer.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className={`flex flex-col h-full bg-[#f8fafc] animate-slide-up overflow-hidden ${styles.searchPage}`}>
      <div className="p-3.5 bg-[#042a1b] border-b border-[#d4af37]/40 text-white flex items-center gap-2 shrink-0">
        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full bg-[#073822] hover:bg-[#0d5336] text-[#fef08a] border border-[#d4af37] flex items-center justify-center text-sm transition-all active:scale-95 shrink-0"
          aria-label="بازگشت"
        >
          <i className="fa-solid fa-arrow-right text-base" />
        </button>
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
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {!searchQuery.trim() ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-[#f8fafc] border border-gray-100 flex items-center justify-center text-gray-300 text-3xl mb-4 shadow-sm">
              <i className="fa-solid fa-magnifying-glass" />
            </div>
            <h4 className="text-sm font-black text-gray-400 mb-2">
              جستجو در محصولات طلا رایس
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[250px]">
              عبارت مورد نظر خود را برای یافتن برنج یا محصول دلخواه وارد کنید.
            </p>
          </div>
        ) : (
          <div className={`p-4 ${styles.resultsList}`}>
            <div className="flex items-center justify-between px-1 text-[11px] text-gray-500 font-bold mb-3">
              <span>نتایج جستجو برای «{searchQuery}»</span>
              <span className="text-[#073822] font-black bg-[#fef08a] px-2 py-0.5 rounded-md border border-[#d4af37]">
                {filteredResults.length.toLocaleString('fa-IR')} نتیجه
              </span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                <div className="w-16 h-16 rounded-full bg-[#fef08a]/30 border-2 border-[#d4af37] flex items-center justify-center text-[#073822] text-2xl mb-3 shadow-inner">
                  <i className="fa-solid fa-wheat-awn-circle-exclamation text-[#b45309]" />
                </div>
                <h4 className="text-xs font-black text-[#073822] mb-1">
                  محصولی یافت نشد
                </h4>
                <p className="text-[11px] text-gray-500 max-w-xs mb-4">
                  متأسفانه برای جستجوی شما نتیجه‌ای پیدا نشد.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:border-[#d4af37] transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f8fafc] shrink-0 border border-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-[#073822] truncate mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-black text-[#073822]">
                          {product.price.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">تومان</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#16a34a] shrink-0">
                      <i className="fa-solid fa-chevron-left text-xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
