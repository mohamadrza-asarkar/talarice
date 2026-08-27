import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BlogPage = () => {
  const { blogPosts } = useApp();
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'cooking', label: 'رازهای پخت مجلسی' },
    { id: 'origin', label: 'شالیزار و اصالت' },
    { id: 'health', label: 'خواص و سلامت' }
  ];

  const cookingTips = [
    {
      icon: 'fa-solid fa-water',
      title: 'خیساندن مناسب با نمک',
      desc: 'برنج کامفیروز را حداقل ۲ تا ۳ ساعت قبل از پخت در آب ولرم و نمک سنگ خیس کنید.'
    },
    {
      icon: 'fa-solid fa-fire-burner',
      title: 'شعله ملایم و ری‌کشی',
      desc: 'هنگام جوشیدن، از زدن کفگیر زیاد خودداری کنید تا دانه‌ها خرد نشوند.'
    },
    {
      icon: 'fa-solid fa-oil-well',
      title: 'روغن حیوانی یا کرمانشاهی',
      desc: 'پس از دم کشیدن، اضافه کردن روغن محلی عطر شگفت‌انگیز کامفیروز را دوچندان می‌کند.'
    }
  ];

  const filteredPosts = (blogPosts ?? []).filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = !searchQuery.trim() ||
      post.title?.includes(searchQuery) ||
      post.summary?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCommentName('');
      setCommentText('');
    }, 3000);
  };

  return (
    <div className={styles.blogWrapper}>
      <header className={styles.headerCard}>
        <div className={styles.headerTop}>
          <span className={styles.headerBadge}>دانشنامه و مقالات</span>
          <span className={styles.headerSubtitle}>
            <i className="fa-solid fa-book-open-reader" />
            <span>آموزش‌های تخصصی</span>
          </span>
        </div>
        <h2 className={styles.headerTitle}>دانستنی‌های برنج اصیل کامفیروز</h2>
        <p className={styles.headerDesc}>
          مرجع تخصصی آموزش پخت مجلسی، تشخیص برنج اصل از تقلبی و خواص بی‌نظیر شالیزارهای فارس
        </p>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="جستجو در مقالات و آموزش‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={styles.clearButton}>
            <i className="fa-solid fa-circle-xmark" />
          </button>
        )}
      </div>

      <nav className={styles.categoriesScroll}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`${styles.categoryBtn} ${activeCategory === c.id ? styles.categoryActive : styles.categoryInactive}`}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {featuredPost && (
        <article onClick={() => setSelectedPost(featuredPost)} className={styles.featuredCard}>
          <div className={styles.featuredImageWrapper}>
            <img src={featuredPost.image} alt={featuredPost.title} className={styles.featuredImage} />
            <div className={styles.featuredOverlay}>
              <span className={styles.featuredBadge}>مقاله ویژه</span>
              <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
            </div>
          </div>
          <div className={styles.featuredContent}>
            <p className={styles.featuredSummary}>{featuredPost.summary}</p>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <i className="fa-regular fa-clock" />
                <span>{featuredPost.readTime ?? '۵ دقیقه'}</span>
              </div>
              <span className={styles.readMore}>
                مطالعه کامل <i className="fa-solid fa-arrow-left" />
              </span>
            </div>
          </div>
        </article>
      )}

      {otherPosts.length > 0 && (
        <section className={styles.postsList}>
          <h4 className={styles.sectionTitle}>
            <i className="fa-solid fa-newspaper" />
            سایر مقالات و آموزش‌ها
          </h4>
          {otherPosts.map((post) => (
            <article key={post.id} onClick={() => setSelectedPost(post)} className={styles.listCard}>
              <img src={post.image} alt={post.title} className={styles.listImage} />
              <div className={styles.listContent}>
                <span className={styles.listCategory}>{post.categoryName ?? 'آموزش'}</span>
                <h4 className={styles.listTitle}>{post.title}</h4>
                <div className={styles.listMeta}>
                  <span>{post.date ?? 'بهمن ۱۴۰۳'}</span>
                  <span>{post.readTime ?? '۳ دقیقه'}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {!filteredPosts.length && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-magnifying-glass" />
          <p>مقاله‌ای با این مشخصات یافت نشد.</p>
        </div>
      )}

      <aside className={styles.tipsCard}>
        <h4 className={styles.tipsTitle}>
          <i className="fa-solid fa-lightbulb" />
          ۳ راز طلایی پخت برنج کامفیروزی
        </h4>
        <div className={styles.tipsList}>
          {cookingTips.map((tip, idx) => (
            <div key={idx} className={styles.tipItem}>
              <div className={styles.tipIconWrapper}>
                <i className={tip.icon} />
              </div>
              <div>
                <strong className={styles.tipItemTitle}>{tip.title}</strong>
                <p className={styles.tipItemDesc}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {selectedPost && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHero}>
              <img src={selectedPost.image} alt={selectedPost.title} className={styles.modalHeroImage} />
              <div className={styles.modalHeroOverlay}>
                <h3>{selectedPost.title}</h3>
              </div>
              <button onClick={() => setSelectedPost(null)} className={styles.modalCloseBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMetaRow}>
                <span>نویسنده: کارشناس شالیزار طلا رایس</span>
                <span>زمان مطالعه: {selectedPost.readTime ?? '۵ دقیقه'}</span>
              </div>
              <div className={styles.modalText}>
                {selectedPost.content ?? selectedPost.summary}
              </div>

              <div className={styles.commentSection}>
                <h4 className={styles.commentTitle}>
                  <i className="fa-regular fa-comment-dots" />
                  دیدگاه شما درباره این مقاله
                </h4>
                {isSubmitted ? (
                  <div className={styles.commentSuccess}>
                    دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className={styles.commentInputGroup}>
                    <input
                      type="text"
                      placeholder="نام شما..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className={styles.commentInput}
                    />
                    <textarea
                      rows={3}
                      placeholder="دیدگاه یا پرسش شما درباره پخت..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className={styles.commentInput}
                    />
                    <button type="submit" className={styles.commentButton}>
                      ارسال دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
