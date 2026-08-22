import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BlogPage = () => {
  const { blogArticles } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const categories = [
    { id: 'all', name: 'همه مقالات' },
    { id: 'cooking', name: 'آموزش پخت' },
    { id: 'maintenance', name: 'نگهداری و آفت' },
    { id: 'health', name: 'خواص و سلامت' },
    { id: 'recognition', name: 'تشخیص برنج اصل' }
  ];

  const testTips = [
    { title: 'شناخت برنج کهنه', desc: 'برنجی که حداقل ۶ ماه از برداشت آن گذشته باشد، پخت و قد کشیدن بسیار بهتری دارد و عطر آن تثبیت شده است.', iconClass: 'fa-solid fa-wheat-awn' },
    { title: 'جلوگیری از شپشک', desc: 'قرار دادن چند حبه سیر خشک یا برگ گردو در لابه‌لای گونی‌های نخی، بهترین راه طبیعی برای دفع حشرات است.', iconClass: 'fa-solid fa-bug-slash' }
  ];

  const filteredArticles = blogArticles.filter(art => {
    const matchesCat = activeCategory === 'all' || art.categoryId === activeCategory;
    const matchesSearch = art.title.includes(searchQuery) || art.content[0].includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if(commentName && commentText) {
      setCommentSubmitted(true);
      setTimeout(() => {
        setCommentSubmitted(false);
        setCommentName('');
        setCommentText('');
      }, 3000);
    }
  };

  return (
    <div className={styles.blogWrapper}>
      
      <div className={styles.heroBox}>
        <div className={styles.heroHeader}>
          <span className={styles.badge}>مجله آموزشی</span>
        </div>
        <h2 className={styles.heroTitle}>
          بلاگ و دانستنی‌های طلا رایس
        </h2>
        <p className={styles.heroDesc}>
          از ترفندهای رستورانی پخت تا روش‌های نگهداری اصولی و تشخیص برنج اصل کامفیروز در منزل
        </p>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
            <input
              type="text"
              placeholder="جستجو در مقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.categoriesScroll}>
        <div className={styles.categoriesFlex}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`${styles.categoryBtn} ${
                activeCategory === cat.id ? styles.categoryBtnActive : styles.categoryBtnInactive
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.articlesGrid}>
        {filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>
            مقاله ای یافت نشد.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div 
              key={art.id} 
              className={styles.articleCard}
              onClick={() => setActiveArticle(art)}
            >
              <div className={styles.articleImageContainer}>
                <img src={art.image} alt={art.title} className={styles.articleImage} />
                <div className={styles.articleImageOverlay}>
                  <div className={styles.readBadge}>
                    <i className="fa-solid fa-feather-pointed" />
                    <span>مطالعه مقاله</span>
                  </div>
                </div>
              </div>
              <div className={styles.articleContent}>
                <div className={styles.articleContentTop}>
                  <div className={styles.articleMetaRow}>
                    <span className={styles.articleCategoryBadge}>
                      {art.category}
                    </span>
                    <span className={styles.articleDate}>
                      {art.date}
                    </span>
                  </div>
                  <h4 className={styles.articleTitle}>
                    {art.title}
                  </h4>
                </div>
                <div className={styles.articleAuthorRow}>
                  <span className={styles.authorName}>
                    <i className="fa-solid fa-user-pen" />
                    {art.author}
                  </span>
                  <span className={styles.readMoreText}>
                    مطالعه
                    <i className="fa-solid fa-chevron-left" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.tipsBox}>
        <h3 className={styles.tipsTitle}>
          <i className="fa-solid fa-circle-check" />
          <span>توصیه‌های کلیدی کارشناسان طلا رایس</span>
        </h3>
        <div className={styles.tipsList}>
          {testTips.map((tip, i) => (
            <div key={i} className={styles.tipItem}>
              <div className={styles.tipIconWrapper}>
                <i className={`${tip.iconClass}`} />
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
          <div className={styles.modalContainer}>
            
            <div className={styles.modalHero}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className={styles.modalHeroImage}
              />
              <div className={styles.modalHeroOverlay}>
                <div>
                  <span className={styles.modalBadge}>
                    {activeArticle.category}
                  </span>
                  <h3 className={styles.modalTitle}>
                    {activeArticle.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className={styles.modalCloseBtn}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className={styles.modalContentArea}>
              <div className={styles.modalMetaBar}>
                <span className={styles.modalMetaItem}>
                  <i className="fa-solid fa-user-pen" />
                  {activeArticle.author}
                </span>
                <span className={styles.modalMetaItem}>
                  <i className="fa-regular fa-clock" />
                  زمان مطالعه: {activeArticle.readTime}
                </span>
                <span className={styles.modalMetaItem}>
                  <i className="fa-regular fa-calendar" />
                  {activeArticle.date}
                </span>
              </div>

              <div className={styles.modalParagraphs}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className={styles.modalParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {activeArticle.proTips && activeArticle.proTips.length > 0 && (
                <div className={styles.proTipsBox}>
                  <h4 className={styles.proTipsTitle}>
                    <i className="fa-solid fa-lightbulb" />
                    <span>نکات طلایی و توصیه‌های شالیکاران:</span>
                  </h4>
                  <ul className={styles.proTipsList}>
                    {activeArticle.proTips.map((tip, i) => (
                      <li key={i} className={styles.proTipItem}>
                        <span className={styles.proTipDot}>●</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.commentsSection}>
                <h4 className={styles.commentsTitle}>
                  <i className="fa-regular fa-comments" />
                  <span>دیدگاه یا سوال شما درباره این مقاله:</span>
                </h4>
                
                {commentSubmitted ? (
                  <div className={styles.commentSuccess}>
                    دیدگاه شما ثبت شد و پس از تایید نمایش داده می‌شود.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className={styles.commentInput}
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="متن نظر، سوال یا تجربه خود..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className={styles.commentTextarea}
                    />
                    <button
                      type="submit"
                      className={styles.commentSubmitBtn}
                    >
                      ثبت دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setActiveArticle(null)}
                className={styles.modalFooterBtn}
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
