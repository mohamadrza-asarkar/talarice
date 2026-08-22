import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen } = useApp();
  
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(10);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedWeight(foundProduct.weight);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <i className="fa-solid fa-arrow-right" />
            بازگشت
          </button>
        </div>
        <div className={styles.notFoundContainer}>
          <h2 className={styles.notFoundTitle}>محصول یافت نشد</h2>
          <button onClick={() => navigate('/catalog')} className={styles.notFoundBtn}>
            مشاهده محصولات
          </button>
        </div>
      </div>
    );
  }

  const weightOptions = product.weightOptions && product.weightOptions.length > 0 
    ? product.weightOptions 
    : [product.weight];

  const currentPrice =
    selectedWeight === product.weight
      ? product.price
      : Math.round((product.price / product.weight) * selectedWeight);

  const currentOldPrice = product.oldPrice
    ? selectedWeight === product.weight
      ? product.oldPrice
      : Math.round((product.oldPrice / product.weight) * selectedWeight)
    : null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-right" />
          بازگشت
        </button>
        
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <i className="fa-regular fa-heart" />
          </button>
          <button className={styles.actionBtn}>
            <i className="fa-solid fa-share-nodes" />
          </button>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.productImage}
        />
        {product.discountPercent && (
          <div className={styles.productBadge}>
            {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
          </div>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.titleRow}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.ratingBox}>
            <i className="fa-solid fa-star" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <div className={styles.tagsContainer}>
          <span className={styles.tag}>برنج اصیل کامفیروز</span>
          <span className={styles.tag}>بوجاری شده</span>
          <span className={styles.tag}>بدون خرده</span>
        </div>
        
        <div className={styles.weightSelector}>
          <h3 className={styles.weightTitle}>وزن کیسه (کیلوگرم):</h3>
          <div className={styles.weightOptions}>
            {weightOptions.map(weight => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`${styles.weightBtn} ${selectedWeight === weight ? styles.weightBtnActive : styles.weightBtnInactive}`}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.priceContainer}>
          {currentOldPrice && (
            <div className={styles.oldPriceRow}>
              <span className={styles.discountBadge}>
                {Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)}٪
              </span>
              <span className={styles.oldPriceValue}>
                {currentOldPrice.toLocaleString('fa-IR')}
              </span>
            </div>
          )}
          <div className={styles.currentPriceRow}>
            <span className={styles.currentPriceValue}>
              {currentPrice.toLocaleString('fa-IR')}
            </span>
            <span className={styles.currency}>تومان</span>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button 
              onClick={() => setActiveTab('desc')}
              className={`${styles.tabBtn} ${activeTab === 'desc' ? styles.tabActive : styles.tabInactive}`}
            >
              معرفی محصول
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.tabActive : styles.tabInactive}`}
            >
              مشخصات پخت
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabActive : styles.tabInactive}`}
            >
              نظرات ({product.reviewCount || 0})
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'desc' && (
              <p className={styles.descText}>
                {product.description || 'برنج کامفیروزی اصل با عطر و طعم بی‌نظیر، مستقیماً از شالیزارهای منطقه کامفیروز فارس. این برنج دارای دانه‌های سالم و یکدست بوده و پس از پخت، ری‌کشی بسیار عالی دارد.'}
              </p>
            )}
            {activeTab === 'specs' && (
              <ul className={styles.specsList}>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>منطقه کشت:</span>
                  <span className={styles.specValue}>{product.origin || 'کامفیروز، استان فارس'}</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>شالیکار:</span>
                  <span className={styles.specValue}>{product.farmer || 'تعاونی شالیکاران'}</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>طریقه پخت پیشنهادی:</span>
                  <span className={styles.specValue}>{product.cookingRatio || '۱ پیمانه برنج به ۱.۳ پیمانه آب'}</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>میزان ری‌کشی:</span>
                  <span className={styles.specValue}>{product.elongation || 'عالی'}</span>
                </li>
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>کاربر سایت</span>
                    <div className={styles.reviewStars}>
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                    </div>
                  </div>
                  <p className={styles.reviewText}>
                    کیفیت محصول بسیار عالی بود. عطر و طعم فوق‌العاده‌ای داشت.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button
          onClick={() => {
            addToCart(product, selectedWeight);
            setIsCartOpen(true);
          }}
          className={styles.addToCartBtn}
        >
          <i className="fa-solid fa-cart-plus" />
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
};
