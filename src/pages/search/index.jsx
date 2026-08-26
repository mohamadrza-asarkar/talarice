import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context';

export function SearchPage() {
  const { products } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = !query.trim()
    ? []
    : products.filter((p) => p.name?.includes(query) || p.description?.includes(query));

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white p-2">
          <i className="fa-solid fa-arrow-right text-sm" />
        </button>

        <div className="flex-1 flex items-center bg-[#073b27] border border-[#d4af37]/30 rounded-xl px-3 py-2 text-xs">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام برنج..."
            className="w-full bg-transparent text-white outline-none placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {!query.trim() ? (
          <p className="text-xs text-gray-400 text-center py-10">نام محصول مورد نظر خود را وارد کنید.</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">محصولی با این مشخصات یافت نشد.</p>
        ) : (
          filtered.map((item) => (
            <Link
              key={item._id || item.id}
              to={`/product/${item._id || item.id}`}
              className="bg-[#073b27] border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-[#d4af37]/40 transition-colors"
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                <span className="text-[11px] text-[#d4af37] font-bold">
                  {Number(item.price || 0).toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <i className="fa-solid fa-chevron-left text-xs text-gray-400" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchPage;
