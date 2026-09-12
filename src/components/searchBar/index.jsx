import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <div className={styles.searchContainer}>
        <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
        <input
          type="text"
          dir="rtl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی ارقام برنج کامفیروز، طارم، دودی..."
          className={styles.searchInput}
          aria-label="جستجوی محصولات طلا رایس"
        />
        {query ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setQuery('')}
            aria-label="پاک کردن متن جستجو"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        ) : (
          <button type="submit" className={styles.searchSubmitBtn} aria-label="جستجو">
            <span>جستجو</span>
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;


