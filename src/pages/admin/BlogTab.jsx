import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, BookOpen, Clock, Calendar, X, Eye } from 'lucide-react';
import styles from './style.module.css';

export const BlogTab = () => {
  const { articles: posts, setArticles: setPosts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);

  const initialForm = {
    title: '',
    category: 'رازهای پخت',
    readTime: '۵ دقیقه مطالعه',
    author: 'کارشناس پخت طلا رایس',
    excerpt: '',
    image: '',
    content: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const sampleBlogImages = [
    { label: 'پخت و قد کشیدن', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
    { label: 'تشخیص برنج اصل', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800' },
    { label: 'نگهداری کیسه نخی', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newPost = {
      _id: newId,
      id: newId,
      title: formData.title,
      category: formData.category,
      readTime: formData.readTime,
      author: formData.author || 'تیم طلا رایس',
      excerpt: formData.excerpt,
      summary: formData.excerpt,
      content: formData.content.split('\n').filter((p) => p.trim()),
      image: formData.image || sampleBlogImages[0].url,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      proTips: ['نکات مهم پخت و نگهداری این مقاله را در آشپزی خانگی به کار بگیرید.']
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleDelete = (id) => {
    if (!window.confirm('آیا از حذف این مقاله آموزشی اطمینان دارید؟')) return;
    setPosts(posts.filter((p) => p._id !== id && p.id !== id));
  };

  return (
    <div>
      {/* Tab Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>وبلاگ و مقالات آموزشی</span>
          </h1>
          <p className={styles.tabSubtitle}>
            انتشار راهنماهای پخت مجلسی، ترفندهای نگهداری و معرفی شالیزارهای کامفیروز
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>نگارش مقاله جدید</span>
        </button>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <BookOpen size={56} className={styles.emptyIcon} />
            <p className={styles.emptyText}>هیچ مقاله‌ای در سامانه یافت نشد</p>
          </div>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {posts.map((post) => {
            const id = post._id || post.id;
            return (
              <div key={id} className={styles.gridCard}>
                <div className={styles.cardImageWrap}>
                  <img
                    src={post.image || sampleBlogImages[0].url}
                    alt={post.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = sampleBlogImages[0].url;
                    }}
                  />
                  <div className={styles.cardOverlay}>
                    <button
                      onClick={() => handleDelete(id)}
                      className={styles.overlayActionBtn}
                      title="حذف مقاله"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardMetaBadge}>
                      {post.category || 'آموزش'}
                    </span>
                    <span className={styles.cardMetaDate}>
                      {post.date || 'امروز'}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>
                    {post.excerpt || post.summary || (Array.isArray(post.content) ? post.content[0] : post.content)}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.875rem',
                      paddingTop: '0.625rem',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontWeight: 600
                      }}
                    >
                      <Clock size={12} />
                      {post.readTime || '۴ دقیقه مطالعه'}
                    </span>

                    <button
                      onClick={() => setPreviewPost(post)}
                      className={styles.detailBtn}
                      style={{ padding: '0.25rem 0.625rem', fontSize: '0.72rem' }}
                    >
                      <Eye size={13} />
                      <span>پیش‌نمایش</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Article Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>نگارش و انتشار مقاله جدید</h3>
                <p className={styles.modalDesc}>اطلاعات مقاله آموزشی را با دقت وارد کنید.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>عنوان جذاب مقاله</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: ۱۰ فوت و فن قد کشیدن برنج اصیل کامفیروز در مجالس"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>دسته‌بندی موضوعی</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={styles.select}
                    >
                      <option value="رازهای پخت">رازهای پخت</option>
                      <option value="راهنمای خرید">راهنمای خرید</option>
                      <option value="نگهداری برنج">نگهداری برنج</option>
                      <option value="شالیزار و کشاورزی">شالیزار و کشاورزی</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>زمان تقریبی مطالعه</label>
                    <input
                      type="text"
                      placeholder="مثال: ۵ دقیقه مطالعه"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>لینک تصویر مقاله (URL)</label>
                    <input
                      required
                      type="text"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      dir="ltr"
                      className={styles.input}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                        تصاویر پیشنهادی:
                      </span>
                      {sampleBlogImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img.url })}
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            cursor: 'pointer'
                          }}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>خلاصه مقاله (نمایش در کارت‌ها)</label>
                    <textarea
                      required
                      placeholder="یک یا دو خط توضیح مختصر درباره موضوع مقاله..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows="2"
                      className={styles.textarea}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>متن کامل مقاله</label>
                    <textarea
                      required
                      placeholder="متن کامل پاراگراف‌های مقاله را اینجا بنویسید (پاراگراف‌ها را با Enter جدا کنید)..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows="6"
                      className={styles.textarea}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.cancelBtn}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    انتشار مقاله در وبلاگ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewPost && (
        <div className={styles.modalOverlay} onClick={() => setPreviewPost(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{previewPost.title}</h3>
                <p className={styles.modalDesc}>
                  دسته‌بندی: {previewPost.category} | {previewPost.readTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div style={{ marginBottom: '1rem', borderRadius: '0.75rem', overflow: 'hidden', height: '12rem' }}>
                <img
                  src={previewPost.image || sampleBlogImages[0].url}
                  alt={previewPost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#334155' }}>
                {Array.isArray(previewPost.content) ? (
                  previewPost.content.map((p, idx) => (
                    <p key={idx} style={{ marginBottom: '0.75rem' }}>
                      {p}
                    </p>
                  ))
                ) : (
                  <p>{previewPost.content}</p>
                )}
              </div>

              {previewPost.proTips && previewPost.proTips.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    marginTop: '1rem'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#047857', fontSize: '0.8125rem', fontWeight: 800 }}>
                    💡 نکته طلایی سرآشپز طلا رایس:
                  </h4>
                  <ul style={{ margin: 0, paddingRight: '1.25rem', fontSize: '0.8125rem', color: '#065f46' }}>
                    {previewPost.proTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setPreviewPost(null)}
                  className={styles.cancelBtn}
                  style={{ width: '100%' }}
                >
                  بستن پیش‌نمایش
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
