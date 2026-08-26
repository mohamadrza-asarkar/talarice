import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { ProductCard } from '../../components/productCard';

export function CatalogPage() {
  const { products } = useApp();

  return (
    <div className="p-4 flex flex-col gap-5">
      <div className="bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-5 text-center flex flex-col items-center gap-2">
        <span className="bg-[#d4af37]/20 text-[#d4af37] text-xs px-3 py-1 rounded-full font-bold">
          شالیزارهای کامفیروز فارس
        </span>
        <h2 className="text-xl font-black text-white">فهرست برنج‌های اصیل کامفیروز</h2>
        <p className="text-xs text-gray-300">عرضه مستقیم و بدون واسطه با ضمانت ۱۰۰٪ پخت و عطر</p>
      </div>

      <div className="flex justify-center">
        <Link
          to="/search"
          className="w-full flex items-center justify-center gap-2 bg-[#062f1f] border border-[#d4af37]/30 text-gray-300 py-3 rounded-xl text-sm"
        >
          <i className="fa-solid fa-magnifying-glass text-[#d4af37]" />
          <span>جستجو در محصولات...</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <i className="fa-solid fa-wheat-awn-circle-exclamation text-3xl text-[#d4af37] mb-2" />
          <p className="text-sm">محصولی برای نمایش یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
