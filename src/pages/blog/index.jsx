import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BlogPage = () => {
  const { articles, testTips } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'راهنمای خرید', label: 'راهنمای خرید' },
    { id: 'رازهای پخت', label: 'رازهای پخت' },
    { id: 'نگهداری برنج', label: 'نگهداری برنج' },
    { id: 'داستان و فرهنگ', label: 'داستان و فرهنگ' }
  ];

  const filteredArticles = (articles || []).filter((art) => {
    const matchCategory =
      selectedCategory === 'all' || art.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      art.title.includes(searchQuery) ||
      art.summary.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const featuredArticle = articles && articles.length > 0 ? articles[0] : null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentSubmitted(true);
    setTimeout(() => {
      setCommentSubmitted(false);
      setCommentText('');
      setCommentName('');
    }, 3000);
  };

  return (
    <div className={styles.blogWrapper}>
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <span className={styles.headerBadge}>
            وبلاگ آموزشی طلا رایس
          </span>
          <span className={styles.headerSubtitle}>
            <i className="fa-solid fa-feather-pointed" />
            <span>دانشنامه برنج کامفیروز</span>
          </span>
        </div>
        <h2 className={styles.headerTitle}>
          مقالات، آموزش‌ها و اخبار شالیزار
        </h2>
        <p className={styles.headerDesc}>
          هر آنچه باید درباره روش‌های اصیل پخت، تشخیص برنج ناب، و نگهداری بدانید.
        </p>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در مقالات و آموزش‌ها..."
          className={styles.searchInput}
        />
        <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={styles.clearButton}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      <div className={styles.categoriesScroll}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${styles.categoryBtn} ${
              selectedCategory === cat.id ? styles.categoryActive : styles.categoryInactive
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {featuredArticle && selectedCategory === 'all' && !searchQuery && (
        <div
          onClick={() => setActiveArticle(featuredArticle)}
          className={styles.featuredCard}
        >
          <div className={styles.featuredImageWrapper}>
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className={styles.featuredImage}
            />
            <div className={styles.featuredOverlay}>
              <span className={styles.featuredBadge}>
                ویژه و پربازدید
              </span>
              <h3 className={styles.featuredTitle}>
                {featuredArticle.title}
              </h3>
            </div>
          </div>
          <div className={styles.featuredContent}>
            <p className={styles.featuredSummary}>
              {featuredArticle.summary}
            </p>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <i className="fa-regular fa-clock" style={{ color: '#d4af37' }} />
                {featuredArticle.readTime}
              </span>
              <span className={styles.metaItem}>
                <i className="fa-regular fa-calendar" style={{ color: '#d4af37' }} />
                {featuredArticle.date}
              </span>
              <span className={styles.readMore}>
                ادامه مطلب
                <i className="fa-solid fa-arrow-left" style={{ fontSize: '10px' }} />
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 className={styles.sectionTitle}>
          <i className="fa-solid fa-newspaper" style={{ color: '#d4af37' }} />
          <span>فهرست مقالات و راهنماها ({filteredArticles.length})</span>
        </h3>

        {filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1.875rem', color: '#d4af37' }} />
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>مقاله‌ای با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className={styles.listCard}
            >
              <div className={styles.listImageWrapper}>
                <img
                  src={art.image}
                  alt={art.title}
                  className={styles.listImage}
                />
                <span className={styles.featuredBadge} style={{ position: 'absolute', bottom: '0.25rem', right: '0.25rem', fontSize: '9px' }}>
                  {art.readTime}
                </span>
              </div>

              <div className={styles.listContent}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={styles.listCategory}>
                      {art.category}
                    </span>
                    <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700 }}>
                      {art.date}
                    </span>
                  </div>
                  <h4 className={styles.listTitle}>
                    {art.title}
                  </h4>
                </div>

                <div className={styles.listMeta}>
                  <span className={styles.metaItem}>
                    <i className="fa-solid fa-user-pen" style={{ color: '#d4af37' }} />
                    {art.author}
                  </span>
                  <span className={styles.metaItem} style={{ color: '#073b27', fontWeight: 900 }}>
                    مطالعه
                    <i className="fa-solid fa-chevron-left" style={{ fontSize: '9px' }} />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.tipsCard}>
        <h3 className={styles.tipsTitle}>
          <i className="fa-solid fa-circle-check" style={{ color: '#d4af37' }} />
          <span>توصیه‌های کلیدی کارشناسان طلا رایس</span>
        </h3>

        <div className={styles.tipsList}>
          {testTips.map((tip, i) => (
            <div
              key={i}
              className={styles.tipItem}
            >
              <div className={styles.tipIconWrapper}>
                <i className={`${tip.iconClass}`} style={{ fontSize: '0.875rem' }} />
              </div>
              <div>
                <h4 className={styles.tipItemTitle}>
                  {tip.title}
                </h4>
                <p className={styles.tipItemDesc}>
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeArticle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHero}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className={styles.modalHeroImage}
              />
              <div className={styles.modalHeroOverlay}>
                <div>
                  <span className={styles.featuredBadge} style={{ marginBottom: '0.25rem' }}>
                    {activeArticle.category}
                  </span>
                  <h3 className={styles.featuredTitle}>
                    {activeArticle.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className={styles.modalCloseBtn}
              >
                <i className="fa-solid fa-xmark" style={{ fontSize: '0.875rem' }} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMetaRow}>
                <span className={styles.metaItem}>
                  <i className="fa-solid fa-user-pen" style={{ color: '#d4af37' }} />
                  {activeArticle.author}
                </span>
                <span className={styles.metaItem}>
                  <i className="fa-regular fa-clock" style={{ color: '#d4af37' }} />
                  {activeArticle.readTime}
                </span>
                <span className={styles.metaItem}>
                  <i className="fa-regular fa-calendar" style={{ color: '#d4af37' }} />
                  {activeArticle.date}
                </span>
              </div>

              <div className={styles.modalText}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9', marginBottom: '0.75rem' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {activeArticle.proTips && activeArticle.proTips.length > 0 && (
                <div style={{ backgroundColor: 'rgba(254, 240, 138, 0.6)', padding: '0.875rem', borderRadius: '1rem', border: '2px solid #d4af37', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#073b27', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-lightbulb" style={{ color: '#b45309' }} />
                    <span>نکات طلایی و توصیه‌های شالیکاران:</span>
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#073b27', fontWeight: 700 }}>
                    {activeArticle.proTips.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: '#b45309', fontWeight: 900 }}>●</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <h4 className={styles.commentTitle} style={{ marginBottom: '0.5rem' }}>
                  <i className="fa-regular fa-comments" style={{ color: '#d4af37' }} />
                  <span>دیدگاه یا سوال شما درباره این مقاله:</span>
                </h4>

                {commentSubmitted ? (
                  <div className={styles.commentSuccess}>
                    دیدگاه شما ثبت شد و پس از تایید نمایش داده می‌شود.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className={styles.commentInputGroup}>
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className={styles.commentInput}
                      style={{ backgroundColor: '#f0fdf4' }}
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="متن نظر، سوال یا تجربه خود..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className={styles.commentInput}
                      style={{ backgroundColor: '#f0fdf4' }}
                    />
                    <button
                      type="submit"
                      className={styles.commentButton}
                    >
                      ثبت دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderTop: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveArticle(null)}
                style={{ backgroundColor: '#073b27', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #d4af37', cursor: 'pointer' }}
              >
                بستن مقاله
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

