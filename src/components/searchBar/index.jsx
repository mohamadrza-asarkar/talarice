import React from 'react';
import { Link } from 'react-router-dom';

export function SearchBar() {
  return (
    <Link
      to="/search"
      className="flex items-center justify-between bg-[#062f1f] border border-[#d4af37]/30 text-gray-400 px-4 py-2.5 rounded-xl text-sm"
    >
      <span>جستجوی برنج، نیم‌دانه، سبوس...</span>
      <i className="fa-solid fa-magnifying-glass text-[#d4af37]" />
    </Link>
  );
}

export default SearchBar;
