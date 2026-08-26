import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { useApp } from '../../context';
import { Sparkles } from 'lucide-react';

export function Header() {
  const { isAdmin } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#042a1b]/95 backdrop-blur-md border-b border-[#d4af37]/20 px-4 py-3">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-3 py-1.5 rounded-full text-xs font-bold"
            >
              <Sparkles size={14} />
              <span>پنل ادمین</span>
            </Link>
          )}
        </div>

        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
