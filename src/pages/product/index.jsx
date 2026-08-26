import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen } = useApp();

  const product = products.find((p) => (p._id || p.id) === id);

  if (!product) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <p className="text-gray-400 text-sm">محصول مورد نظر یافت نشد.</p>
        <Link to="/catalog" className="bg-[#d4af37] text-[#042a1b] px-4 py-2 rounded-xl text-xs font-bold">
          بازگشت به کاتالوگ
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-xs text-gray-300 flex items-center gap-1.5 hover:text-white">
          <i className="fa-solid fa-arrow-right" />
          <span>بازگشت</span>
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#073b27]">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      </div>

      <div className="bg-[#073b27] border border-[#d4af37]/20 rounded-2xl p-4 flex flex-col gap-3">
        <h1 className="text-base font-black text-white">{product.name}</h1>
        <p className="text-xs text-gray-300 leading-relaxed">{product.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">قیمت (کیسه ۱۰ کیلویی):</span>
            <span className="text-base font-black text-[#d4af37]">
              {Number(product.price || 0).toLocaleString('fa-IR')} تومان
            </span>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              setIsCartOpen(true);
            }}
            className="bg-[#d4af37] text-[#042a1b] px-5 py-2.5 rounded-xl text-xs font-black hover:bg-yellow-400 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-cart-plus" />
            <span>افزودن به سبد</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
