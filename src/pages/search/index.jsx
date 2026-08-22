import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const SearchPage = () => {
  const { searchQuery, setSearchQuery, products } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => p.name.includes(searchQuery) || p.description.includes(searchQuery));

  return (
    <div className={styles.searchPageWrapper}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          <i className="fa-solid fa-arrow-right" />
        </button>
        <div className={styles.searchInputContainer}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="کیسه ۱۰ کیلویی..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={styles.clearBtn}
            >
              <i className="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.resultsContainer}>
        {!searchQuery.trim() ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <i className="fa-solid fa-magnifying-glass" />
            </div>
            <h4 className={styles.emptyTitle}>
              جستجوی محصولات طلا رایس
            </h4>
            <p className={styles.emptyDesc}>
              نام محصول یا وزن مورد نظر خود را تایپ کنید.
            </p>
          </div>
        ) : (
          <div className={styles.resultsWrapper}>
            <div className={styles.resultsCount}>
              نتایج برای «{searchQuery}» ({filteredResults.length} مورد)
            </div>

            {filteredResults.length === 0 ? (
              <div className={styles.noResultsState}>
                <div className={styles.noResultsIconWrapper}>
                  <i className="fa-solid fa-wheat-awn-circle-exclamation" />
                </div>
                <h4 className={styles.noResultsTitle}>
                  محصولی یافت نشد
                </h4>
                <p className={styles.noResultsDesc}>
                  متأسفانه برای جستجوی شما نتیجه‌ای پیدا نشد.
                </p>
              </div>
            ) : (
              <div className={styles.resultsList}>
                {filteredResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className={styles.resultItem}
                  >
                    <div className={styles.resultImageWrapper}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.resultImage}
                      />
                    </div>
                    <div className={styles.resultDetails}>
                      <h4 className={styles.resultTitle}>
                        {product.name}
                      </h4>
                      <div className={styles.resultPriceRow}>
                        <span className={styles.resultPrice}>
                          {product.price.toLocaleString('fa-IR')}
                        </span>
                        <span className={styles.resultCurrency}>تومان</span>
                      </div>
                    </div>
                    <div className={styles.resultActionIcon}>
                      <i className="fa-solid fa-chevron-left" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
