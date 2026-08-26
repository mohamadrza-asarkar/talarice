import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useApp();
  if (!product) return null;

  const id = product._id || product.id;

  return (
    <div className="bg-[#073b27] border border-[#d4af37]/20 rounded-2xl overflow-hidden flex flex-col justify-between group">
      <Link to={`/product/${id}`} className="block relative">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'}
          alt={product.name}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isAvailable === false && (
          <span className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            ناموجود
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <Link to={`/product/${id}`}>
            <h3 className="text-xs font-bold text-white line-clamp-2 hover:text-[#d4af37]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#d4af37]">
              {Number(product.price || 0).toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-gray-400">تومان</span>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              setIsCartOpen(true);
            }}
            disabled={product.isAvailable === false}
            className="bg-[#d4af37] text-[#042a1b] p-2 rounded-xl text-xs font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            title="افزودن به سبد خرید"
          >
            <i className="fa-solid fa-cart-plus" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
