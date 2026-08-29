import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { SEO } from '../../components/SEO';
import styles from './style.module.css';

export function SearchPage() {
  const { searchQuery, setSearchQuery, products, goBack } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(function () {
    inputRef.current?.focus();
  }, []);

  function handleBack(e) {
    e?.preventDefault();
    e?.stopPropagation();
    goBack('/');
  }

  const query = searchQuery?.trim() ?? '';
  const filtered = query
    ? (products ?? []).filter(function (p) { return p.name?.includes(query) || p.description?.includes(query); })
    : [];

  return (
    <div className={styles.wrapper}>
      <SEO
        title={query ? `جستجوی "${query}" در محصولات` : 'جستجوی انواع برنج کامفیروز'}
        description="جستجو و مقایسه انواع برنج‌های اعلای کامفیروز، طارم، دودی و نیم‌دانه در فروشگاه طلا رایس."
      />
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
            placeholder="جستجوی برنج کامفیروزی ممتاز..."
            value={searchQuery}
            onChange={function (e) { setSearchQuery(e.target.value); }}
            onKeyDown={function (e) {
              if (e.key === 'Escape') handleBack(e);
            }}
          />
          {searchQuery && (
            <button onClick={function () { setSearchQuery(''); }} className={styles.clearBtn}>
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
            <p>نام برنج مورد نظر خود را تایپ کنید.</p>
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
            {filtered.map(function (product) {
              return (
                <div
                  key={product.id}
                  onClick={function () { navigate(`/product/${product.id}`); }}
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
