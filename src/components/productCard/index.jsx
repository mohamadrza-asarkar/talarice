import React, { useState } from 'react';
import { useApp } from '../../context';

export const ProductCard = ({ product }) => {
  const { addToCart, setSelectedProduct } = useApp();
  
  // Initialize with the default product weight
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  
  // Safely get weight options or default to [product.weight]
  const weightOptions = product.weightOptions && product.weightOptions.length > 0 
    ? product.weightOptions 
    : [product.weight];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
  };

  const handleWeightSelect = (e, w) => {
    e.stopPropagation();
    setSelectedWeight(w);
  };

  const currentPrice = product.price * (selectedWeight / product.weight);
  const currentOldPrice = product.oldPrice ? product.oldPrice * (selectedWeight / product.weight) : null;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-md flex flex-col justify-between border-2 border-[#d4af37]/40 relative group h-full">
      <div className="flex-1 cursor-pointer flex flex-col" onClick={() => setSelectedProduct(product)}>
        <div className="relative h-36 rounded-xl overflow-hidden mb-2 bg-[#f8fafc]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && (
            <span className="absolute top-1.5 right-1.5 bg-[#b45309] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow z-10">
              {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
            </span>
          )}
        </div>

        <h4 className="font-black text-xs text-[#073822] line-clamp-2 hover:text-[#136f46] mb-1.5 leading-snug">
          {product.name}
        </h4>
        
        {product.description && (
          <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">
            {product.description}
          </p>
        )}
      </div>

      <div className="mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
        {/* Weight Selector */}
        <div className="flex flex-wrap gap-1.5 mb-2.5 justify-start">
          {weightOptions.map((w) => (
            <button
              key={w}
              onClick={(e) => handleWeightSelect(e, w)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors border ${
                selectedWeight === w
                  ? 'bg-[#073822] text-[#fef08a] border-[#073822]'
                  : 'bg-[#f8fafc] text-gray-600 border-gray-200 hover:border-[#d4af37]'
              }`}
            >
              {w} کیلو
            </button>
          ))}
        </div>

        <div className="space-y-0.5 mb-2">
          {currentOldPrice && (
            <div className="text-[10px] text-gray-400 line-through text-left font-bold h-3">
              {currentOldPrice.toLocaleString('fa-IR')}
            </div>
          )}
          <div className="text-xs font-black text-[#073822] text-left flex items-center justify-end gap-1 h-4">
            <span>{currentPrice.toLocaleString('fa-IR')}</span>
            <span className="text-[10px] text-gray-500 font-normal">تومان</span>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-full bg-[#073822] hover:bg-[#0a4d30] text-[#fef08a] text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all border border-[#d4af37]"
        >
          <i className="fa-solid fa-cart-plus text-xs" />
          <span>افزودن به سبد</span>
        </button>
      </div>
    </div>
  );
};
