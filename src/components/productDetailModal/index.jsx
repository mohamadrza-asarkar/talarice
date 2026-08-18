import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp();
  const [selectedWeight, setSelectedWeight] = useState(
    selectedProduct ? selectedProduct.weight : 10
  );
  const [activeTab, setActiveTab] = useState('desc');

  if (!selectedProduct) return null;

  const currentPrice =
    selectedWeight === selectedProduct.weight
      ? selectedProduct.price
      : Math.round(
          (selectedProduct.price / selectedProduct.weight) * selectedWeight
        );

  const currentOldPrice = selectedProduct.oldPrice
    ? selectedWeight === selectedProduct.weight
      ? selectedProduct.oldPrice
      : Math.round(
          (selectedProduct.oldPrice / selectedProduct.weight) * selectedWeight
        )
    : null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 ${styles.modalOverlay}`}>
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#d4af37] animate-fade-in relative text-[#073b27]">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 left-3 bg-[#073b27]/80 hover:bg-[#073b27] text-[#fef08a] rounded-full p-2 z-20 shadow-md backdrop-blur-md transition-all border border-[#d4af37]"
          aria-label="بستن"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="relative h-64 bg-[#f0fdf4] border-b-2 border-[#d4af37]/30">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="bg-[#d4af37] text-[#073b27] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 inline-block border border-white">
                برنج ۱۰۰٪ خالص کامفیروزی
              </span>
              <h3 className="text-base font-black text-[#fef08a] leading-snug">
                {selectedProduct.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 bg-[#fef08a] px-2.5 py-1 rounded-lg text-[#073b27] font-black border border-[#d4af37]">
              <i className="fa-solid fa-star text-xs text-[#b45309]" />
              <span>{selectedProduct.rating.toLocaleString('fa-IR')}</span>
              <span className="text-[10px] text-[#073b27]">
                ({selectedProduct.reviewCount} نظر مشتریان)
              </span>
            </div>
            <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-lg font-bold border border-green-200">
              موجود در انبار شالیزار
            </span>
          </div>

          <div>
            <label className="block text-xs font-black text-[#073b27] mb-2">
              انتخاب وزن گونی پارچه‌ای:
            </label>
            <div className="flex gap-2">
              {selectedProduct.weightOptions.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all border-2 flex items-center justify-center gap-1.5 ${
                    selectedWeight === w
                      ? 'bg-[#073b27] text-[#fef08a] border-[#d4af37] shadow-md'
                      : 'bg-[#f0fdf4] text-[#073b27] border-[#d4af37]/30 hover:border-[#d4af37]'
                  }`}
                >
                  <i className="fa-solid fa-weight-hanging text-xs" />
                  <span>{w.toLocaleString('fa-IR')} کیلوگرم</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex bg-[#f0fdf4] p-1 rounded-xl border border-[#d4af37]/30 text-xs font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'desc'
                  ? 'bg-[#073b27] text-[#fef08a] shadow-xs'
                  : 'text-[#073b27]'
              }`}
            >
              مشخصات و پخت
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'features'
                  ? 'bg-[#073b27] text-[#fef08a] shadow-xs'
                  : 'text-[#073b27]'
              }`}
            >
              ویژگی‌های گونی
            </button>
          </div>

          {activeTab === 'desc' ? (
            <div className="space-y-3 text-xs text-[#1e3a29] font-medium leading-relaxed text-justify">
              <p>{selectedProduct.description}</p>
              <div className="bg-[#f0fdf4] p-3 rounded-xl border border-[#d4af37]/30 space-y-1.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-[#b45309]">شالیکار و مزرعه:</span>
                  <span className="text-[#073b27]">{selectedProduct.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b45309]">محل برداشت:</span>
                  <span className="text-[#073b27]">{selectedProduct.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b45309]">میزان قد کشیدن (ری):</span>
                  <span className="text-[#073b27]">{selectedProduct.elongation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b45309]">فرمول آب به برنج:</span>
                  <span className="text-[#073b27]">{selectedProduct.cookingRatio}</span>
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-2 text-xs font-bold text-[#073b27]">
              {selectedProduct.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-[#f0fdf4] p-2 rounded-xl border border-[#d4af37]/30"
                >
                  <i className="fa-solid fa-circle-check text-[#d4af37] text-sm" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t-2 border-[#d4af37]/30 bg-[#f0fdf4] flex items-center justify-between">
          <div className="flex flex-col">
            {currentOldPrice && (
              <span className="text-xs text-gray-400 line-through font-bold">
                {currentOldPrice.toLocaleString('fa-IR')} تومان
              </span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-[#073b27]">
                {currentPrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs font-bold text-[#b45309]">تومان</span>
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(selectedProduct, selectedWeight);
              setSelectedProduct(null);
            }}
            className="bg-gradient-to-r from-[#073b27] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] hover:text-[#073b27] text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 border border-[#d4af37]"
          >
            <i className="fa-solid fa-cart-plus text-sm" />
            <span>خرید کیسه سفید</span>
          </button>
        </div>
      </div>
    </div>
  );
};
