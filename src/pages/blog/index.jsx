import React, { useState } from 'react';
import { useApp } from '../../context';
import { SEO } from '../../components/SEO';
import styles from './style.module.css';

export function BlogPage() {
  const { goBack } = useApp();
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'دانشنامه تخصصی کشت و تاریخچه برنج اصیل کامفیروز فارس',
    'image': ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=1200'],
    'author': {
      '@type': 'Organization',
      'name': 'طلا رایس'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'طلا رایس',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500'
      }
    },
    'datePublished': '2026-08-01',
    'dateModified': '2026-08-29',
    'description': 'مرجع جامع علمی و مستند مراحل چهارگانه کاشت، داشت و برداشت برنج اصیل و معطر کامفیروز در استان فارس.'
  };

  const cultivationSteps = [
    {
      step: '۱',
      title: 'آماده‌سازی بذر و خزانه‌گیری (فروردین)',
      icon: 'fa-solid fa-seedling',
      desc: 'بذرهای اصیل برنج کامفیروز در آب نمک جوانه زده و در خزانه‌های سرپوشیده با خاک غنی کامفیروز کشت می‌شوند تا به نشاهای شاداب تبدیل گردند.'
    },
    {
      step: '۲',
      title: 'نشاکاری و آماده‌سازی شالیزار (اردیبهشت)',
      icon: 'fa-solid fa-water',
      desc: 'زمین اصلی با آب گوارای سرچشمه رودخانه کر شخم زده و گل‌ورز می‌شود. سپس نشاهای سبز توسط شالیکاران باتجربه کامفیروز با دقت نشا می‌شوند.'
    },
    {
      step: '۳',
      title: 'مدیریت آبیاری و تغذیه ارگانیک (تیر تا مرداد)',
      icon: 'fa-solid fa-sun',
      desc: 'آبیاری منظم تناوبی و استفاده از کودهای طبیعی و ارگانیک باعث قد کشیدن ساقه‌ها و ایجاد عطر متراکم بی‌نظیر در دانه‌های برنج می‌گردد.'
    },
    {
      step: '۴',
      title: 'برداشت دانه‌های طلایی و خشک‌سازی (شهریور)',
      icon: 'fa-solid fa-wheat-awn',
      desc: 'پس از رسیدن کامل خوشه‌های طلایی، برنج برداشت شده و در گرمای طبیعی خورشید کامفیروز به آرامش خشک می‌شود تا هنگام پخت خرد نشود.'
    }
  ];

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitted(true);
    setTimeout(function () {
      setIsSubmitted(false);
      setCommentName('');
      setCommentText('');
    }, 3000);
  }

  return (
    <div className={styles.blogWrapper}>
      <SEO
        title="دانشنامه و آموزش کشت برنج اصیل کامفیروز"
        description="راهنمای کامل و مستند مراحل کاشت، داشت و برداشت برنج معطر کامفیروزی در شالیزارهای مرودشت و استان فارس به همراه روش‌های پخت مجلسی."
        keywords="کشت برنج کامفیروز, خواص برنج کامفیروزی, پخت برنج کامفیروز, شالیزارهای کامفیروز"
        schema={articleSchema}
      />
      {/* Top Header */}
      <header className={styles.headerCard}>
        <div className={styles.headerTop}>
          <button
            type="button"
            onClick={function () { goBack('/'); }}
            className={styles.backBtn}
            aria-label="بازگشت به خانه"
          >
            <i className="fa-solid fa-arrow-right" />
            <span>بازگشت به خانه</span>
          </button>
          <div className={styles.headerBadges}>
            <span className={styles.headerBadge}>دانشنامه شالیکاری</span>
            <span className={styles.headerSubtitle}>
              <i className="fa-solid fa-graduation-cap" />
              <span>مستند علمی</span>
            </span>
          </div>
        </div>
        <h1 className={styles.headerTitle}>دانشنامه تخصصی کشت برنج کامفیروز</h1>
        <p className={styles.headerDesc}>
          مرجع اصیل آشنایی با مراحل کاشت، داشت و برداشت برنج معطر کامفیروز در شالیزارهای سرسبز استان فارس
        </p>
      </header>

      {/* Main Single Article Card */}
      <article
        onClick={function () { setIsOpenDetail(true); }}
        className={styles.featuredCard}
        style={{ cursor: 'pointer', border: '2px solid #d4af37' }}
      >
        <div className={styles.featuredImageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1000&q=80"
            alt="کشت برنج کامفیروز"
            className={styles.featuredImage}
          />
          <div className={styles.featuredOverlay}>
            <span className={styles.featuredBadge}>
              <i className="fa-solid fa-star" /> مقاله اختصاصی طلا رایس
            </span>
            <h2 className={styles.featuredTitle}>
              راهنمای جامع سیر تا پیاز کشت و شالیکاری برنج کامفیروز
            </h2>
          </div>
        </div>
        <div className={styles.featuredContent}>
          <p className={styles.featuredSummary}>
            آشنایی کامل با مراحل چهارگانه کاشت تا برداشت برنج کامفیروز، نقش سرچشمه‌های رودخانه کر و آب‌وهوای منحصربه‌فرد منطقه کامفیروز فارس در خلق عطر و طعم فوق‌العاده برنج طلا.
          </p>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <i className="fa-regular fa-clock" />
              <span>زمان مطالعه: ۶ دقیقه</span>
            </div>
            <div className={styles.metaItem}>
              <i className="fa-regular fa-calendar" />
              <span>بهمن ۱۴۰۳</span>
            </div>
            <span className={styles.readMore}>
              مشاهده کامل مقاله <i className="fa-solid fa-arrow-left" />
            </span>
          </div>
        </div>
      </article>

      {/* Quick Overview Section */}
      <aside className={styles.tipsCard}>
        <h3 className={styles.tipsTitle}>
          <i className="fa-solid fa-seedling" style={{ color: '#d4af37' }} />
          خلاصه مراحل ۴ گانه شالیکاری کامفیروز
        </h3>
        <div className={styles.tipsList}>
          {cultivationSteps.map(function (item) {
            return (
              <div key={item.step} className={styles.tipItem}>
                <div className={styles.tipIconWrapper}>
                  <i className={item.icon} />
                </div>
                <div>
                  <strong className={styles.tipItemTitle}>{item.title}</strong>
                  <p className={styles.tipItemDesc}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Article Detail View (Open like Product Page) */}
      {isOpenDetail && (
        <div className={styles.modalOverlay} onClick={function () { setIsOpenDetail(false); }}>
          <div className={styles.modalContent} onClick={function (e) { e.stopPropagation(); }}>
            {/* Modal Hero */}
            <div className={styles.modalHero}>
              <img
                src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1200&q=80"
                alt="شالیزار برنج کامفیروز"
                className={styles.modalHeroImage}
              />
              <div className={styles.modalHeroOverlay}>
                <span className={styles.headerBadge} style={{ marginBottom: '0.35rem', display: 'inline-block' }}>
                  دانشنامه شالیکاری
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a', margin: 0 }}>
                  راهنمای جامع کشت و شالیکاری برنج اصیل کامفیروز
                </h2>
              </div>
              <button
                onClick={function () { setIsOpenDetail(false); }}
                className={styles.modalCloseBtn}
                aria-label="بستن"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div className={styles.modalMetaRow}>
                <span>
                  <i className="fa-solid fa-user-pen" style={{ color: '#d4af37', marginLeft: '4px' }} />
                  نویسنده: مهندس زارعی (کارشناس شالیکاری طلا رایس)
                </span>
                <span>
                  <i className="fa-regular fa-clock" style={{ color: '#d4af37', marginLeft: '4px' }} />
                  ۶ دقیقه مطالعه
                </span>
              </div>

              {/* Rich Article Text */}
              <div className={styles.modalText}>
                <h3 style={{ fontSize: '1.05rem', color: '#073b27', fontWeight: 900, marginBottom: '0.5rem' }}>
                  مقدمه: جادوی خاک و آب کامفیروز
                </h3>
                <p style={{ lineHeight: '1.8', marginBottom: '1.25rem' }}>
                  منطقه کامفیروز در استان فارس، به دلیل عبور رودخانه خروشان کر و خاک جلگه‌ای فوق‌العاده غنی، مستعدترین بستر برای کشت یکی از معطرترین و خوش‌پخت‌ترین برنج‌های ایران است. برنج کامفیروز بر خلاف سایر ارقام، دارای دانه خوش‌فرم، ری‌کشی مجلسی و طبع گرم است که هواداران بی‌شماری دارد.
                </p>

                <h3 style={{ fontSize: '1.05rem', color: '#073b27', fontWeight: 900, margin: '1.25rem 0 0.5rem' }}>
                  مراحل دقیق کاشت تا برداشت برنج کامفیروز
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
                  {cultivationSteps.map(function (st) {
                    return (
                      <div
                        key={st.step}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRight: '4px solid #073b27',
                          padding: '0.875rem 1rem',
                          borderRadius: '0.5rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span
                            style={{
                              backgroundColor: '#073b27',
                              color: '#fef08a',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 900
                            }}
                          >
                            {st.step}
                          </span>
                          <strong style={{ color: '#073b27', fontSize: '0.9rem' }}>{st.title}</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#334155', lineHeight: '1.7' }}>
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: '1.05rem', color: '#073b27', fontWeight: 900, margin: '1.25rem 0 0.5rem' }}>
                  چرا برنج کامفیروز طلا رایس متفاوت است؟
                </h3>
                <ul style={{ paddingRight: '1.25rem', lineHeight: '1.8', color: '#1e293b', fontSize: '0.85rem' }}>
                  <li>کشت ۱۰۰٪ سورت‌شده و خالص بدون اختلاط با دانه‌های خارجی</li>
                  <li>استفاده از آبیاری نوین بدون آلودگی‌های شیمیایی</li>
                  <li>خشک‌سازی کاملاً سنتی جهت حفظ حداکثر عطر و ری‌کشی عالی</li>
                  <li>ارسال مستقیم از شالیزارهای کامفیروز شیراز به سراسر کشور</li>
                </ul>
              </div>

              {/* Comment Section */}
              <div className={styles.commentSection}>
                <h4 className={styles.commentTitle}>
                  <i className="fa-regular fa-comment-dots" />
                  پرسش یا دیدگاه شما درباره کشت برنج
                </h4>
                {isSubmitted ? (
                  <div className={styles.commentSuccess}>
                    <i className="fa-solid fa-circle-check" style={{ marginLeft: '6px' }} />
                    دیدگاه شما با موفقیت ثبت شد و پس از بررسی توسط کارشناسان منتشر خواهد شد.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className={styles.commentInputGroup}>
                    <input
                      type="text"
                      placeholder="نام و نام خانوادگی..."
                      value={commentName}
                      onChange={function (e) { setCommentName(e.target.value); }}
                      className={styles.commentInput}
                    />
                    <textarea
                      rows={3}
                      placeholder="پرسش خود را درباره مراحل کشت یا خرید مستقیم بنویسید..."
                      value={commentText}
                      onChange={function (e) { setCommentText(e.target.value); }}
                      className={styles.commentInput}
                    />
                    <button type="submit" className={styles.commentButton}>
                      ثبت دیدگاه کارشناسی
                    </button>
                  </form>
                )}
              </div>

              <div className={styles.modalBottomAction}>
                <button
                  type="button"
                  onClick={function () { setIsOpenDetail(false); }}
                  className={styles.modalBackBtn}
                >
                  <i className="fa-solid fa-arrow-right" />
                  <span>بازگشت به دانشنامه</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
