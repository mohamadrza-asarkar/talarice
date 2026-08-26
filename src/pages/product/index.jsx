import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen, refreshData } = useApp();
  
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(10);
  const [activeTab, setActiveTab] = useState('desc');
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewerName.trim() || !product) return;
    try {
      setSubmittingReview(true);
      const prodId = product._id || product.id;
      const res = await fetch(`/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: prodId,
          sender: reviewerName, 
          comment: reviewText, 
          rating: 5 
        })
      });
      const data = await res.json();
      if (data.success) {
        const newRev = data.data;
        setProduct(prev => ({
          ...prev,
          reviews: [newRev, ...(prev.reviews || [])],
          reviewCount: (prev.reviews?.length || 0) + 1
        }));
        setReviewText('');
        setReviewerName('');
        alert('نظر ارزشمند شما با موفقیت ثبت شد.');
        if (refreshData) refreshData();
      }
    } catch(err) {
      alert('خطا در ثبت نظر');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find(p => p.id === id || p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedWeight(foundProduct.weight || 10);
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

  const defaultWeight = product.weight || 10;
  const weightOptions = product.weightOptions && product.weightOptions.length > 0 
    ? product.weightOptions 
    : [defaultWeight];

  const basePrice = product.price || 0;
  const currentPrice =
    selectedWeight === defaultWeight
      ? basePrice
      : Math.round((basePrice / defaultWeight) * selectedWeight);

  const currentOldPrice = product.oldPrice
    ? selectedWeight === defaultWeight
      ? product.oldPrice
      : Math.round((product.oldPrice / defaultWeight) * selectedWeight)
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
          src={product.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'} 
          alt={product.name || 'برنج'} 
          className={styles.productImage}
        />
        {product.discountPercent != null && product.discountPercent > 0 && (
          <div className={styles.productBadge}>
            {(product.discountPercent || 0).toLocaleString('fa-IR')}٪ تخفیف
          </div>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.titleRow}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.ratingBox}>
            <i className="fa-solid fa-star" />
            <span>{product.rating || '۵.۰'}</span>
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
          {currentOldPrice != null && currentOldPrice > currentPrice && (
            <div className={styles.oldPriceRow}>
              <span className={styles.discountBadge}>
                {Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)}٪
              </span>
              <span className={styles.oldPriceValue}>
                {(currentOldPrice || 0).toLocaleString('fa-IR')}
              </span>
            </div>
          )}
          <div className={styles.currentPriceRow}>
            <span className={styles.currentPriceValue}>
              {(currentPrice || 0).toLocaleString('fa-IR')}
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
              توضیحات محصول
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabActive : styles.tabInactive}`}
            >
              نظرات کاربران ({product.reviews?.length || 0})
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'desc' && (
              <p className={styles.descText}>
                {product.description || 'برنج اعلا با عطر و طعم عالی، محصول خالص و درجه یک.'}
              </p>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewerName}>{rev.sender || rev.name || 'کاربر گرامی'}</span>
                        <div className={styles.reviewStars}>
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <i key={i} className="fa-solid fa-star" />
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewText}>
                        {rev.comment || rev.text}
                      </p>
                      {rev.date && <span className="text-xs text-gray-400 mt-2 block">{rev.date}</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mb-4">هنوز نظری برای این محصول ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</p>
                )}
                
                <form onSubmit={submitReview} className="mt-8 border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-sm text-[#042a1b] mb-4">ثبت دیدگاه و تجربه مصرف</h4>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="نام و نام خانوادگی شما (مثال: علی رضایی)" 
                      value={reviewerName} 
                      onChange={e => setReviewerName(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 shadow-none rounded-xl text-sm outline-none focus:border-[#d4af37] placeholder:text-slate-400 font-medium"
                      required
                    />
                    <textarea 
                      placeholder="دیدگاه خود را درباره عطر، طعم، پخت، ری‌کشی و کیفیت دانه‌ها بنویسید..." 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 shadow-none rounded-xl text-sm outline-none focus:border-[#d4af37] resize-none placeholder:text-slate-400 font-medium"
                      rows="3"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-2.5 rounded-xl text-sm font-bold shadow-none transition-colors"
                    >
                      {submittingReview ? 'درحال ثبت...' : 'ثبت نظر'}
                    </button>
                  </div>
                </form>
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
