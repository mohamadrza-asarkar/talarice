import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const SearchPage = () => {
  const { searchQuery, setSearchQuery, products } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBack = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (window.history?.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const query = searchQuery?.trim() ?? '';
  const filtered = query
    ? (products ?? []).filter((p) => p.name?.includes(query) || p.description?.includes(query))
    : [];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button 
          type="button" 
          onClick={handleBack} 
          className={styles.backBtn}
          aria-label="بازگشت"
        >
          <i className="fa-solid fa-arrow-right" />
        </button>
        <div className={styles.inputBox}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="کیسه ۱۰ کیلویی..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>
              <i className="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {!query ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa-solid fa-magnifying-glass" />
            </div>
            <h4>جستجوی محصولات طلا رایس</h4>
            <p>نام محصول یا وزن مورد نظر خود را تایپ کنید.</p>
          </div>
        ) : !filtered.length ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <i className="fa-solid fa-wheat-awn-circle-exclamation" />
            </div>
            <h4>محصولی یافت نشد</h4>
            <p>متأسفانه برای جستجوی شما نتیجه‌ای پیدا نشد.</p>
          </div>
        ) : (
          <div className={styles.resultsList}>
            <span className={styles.resultsCount}>
              نتایج برای «{searchQuery}» ({filtered.length.toLocaleString('fa-IR')} مورد)
            </span>
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className={styles.resultItem}
              >
                <img src={product.image} alt={product.name} className={styles.resultImg} />
                <div className={styles.resultInfo}>
                  <h4>{product.name}</h4>
                  <div className={styles.price}>
                    <strong>{(product.price ?? 0).toLocaleString('fa-IR')}</strong>
                    <small>تومان</small>
                  </div>
                </div>
                <i className={`fa-solid fa-chevron-left ${styles.actionIcon}`} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
