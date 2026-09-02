import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, BookOpen, Clock, Calendar, X, Eye } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import styles from './style.module.css';

export function BlogTab() {
  const { articles: posts, setArticles: setPosts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
  const [formErrors, setFormErrors] = useState({});

  const sampleBlogImages = [
    { label: 'پخت و قد کشیدن', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
    { label: 'تشخیص برنج اصل', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800' },
    { label: 'نگهداری کیسه نخی', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800' }
  ];

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = (formData.title || '').trim();
    const excerpt = (formData.excerpt || '').trim();
    const content = (formData.content || '').trim();
    const newErrors = {};

    if (!title) {
      newErrors.title = 'لطفاً عنوان مقاله را وارد فرمایید.';
    }
    if (!excerpt) {
      newErrors.excerpt = 'لطفاً خلاصه کوتاهی از مقاله را بنویسید.';
    }
    if (!content) {
      newErrors.content = 'لطفاً متن کامل مقاله را وارد فرمایید.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});

    const newId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newPost = {
      _id: newId,
      id: newId,
      title: title,
      category: formData.category || 'آموزش پخت',
      readTime: formData.readTime || '۵ دقیقه',
      author: formData.author || 'تیم طلا رایس',
      excerpt: excerpt,
      summary: excerpt,
      content: content.split('\n').filter(function (p) { return p.trim(); }),
      image: formData.image || sampleBlogImages[0].url,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      proTips: ['نکات مهم پخت و نگهداری این مقاله را در آشپزی خانگی به کار بگیرید.']
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setFormData(initialForm);
  }

  function handleDelete(id) {
    setPosts(posts.filter(function (p) { return p._id !== id && p.id !== id; }));
    setDeleteConfirmId(null);
  }

  return (
    <div>
      {/* Tab Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>دانشنامه و مقالات آموزشی</span>
          </h1>
          <p className={styles.tabSubtitle}>
            انتشار راهنماهای پخت مجلسی، ترفندهای نگهداری و معرفی شالیزارهای کامفیروز
          </p>
        </div>
        <button onClick={function () { setIsModalOpen(true); }} className={styles.addBtn}>
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
          {posts.map(function (post) {
            const id = post._id || post.id;
            return (
              <div key={id} className={styles.gridCard}>
                <div className={styles.cardImageWrap}>
                  <img
                    src={post.image || sampleBlogImages[0].url}
                    alt={post.title}
                    onError={function (e) {
                      e.target.onerror = null;
                      e.target.src = sampleBlogImages[0].url;
                    }}
                  />
                  <div className={styles.cardOverlay}>
                    <button
                      onClick={function () { setDeleteConfirmId(id); }}
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
                      onClick={function () { setPreviewPost(post); }}
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
        <div className={styles.modalOverlay} onClick={function () { setIsModalOpen(false); }}>
          <div className={styles.modalBox} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>نگارش و انتشار مقاله جدید</h3>
                <p className={styles.modalDesc}>اطلاعات مقاله آموزشی را با دقت وارد کنید.</p>
              </div>
              <button
                type="button"
                onClick={function () { setIsModalOpen(false); }}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>عنوان جذاب مقاله *</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۰ فوت و فن قد کشیدن برنج اصیل کامفیروز در مجالس"
                      value={formData.title}
                      onChange={e => handleFieldChange('title', e.target.value)}
                      className={`${styles.input} ${formErrors.title ? styles.inputError : ''}`}
                      style={formErrors.title ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.title && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.title}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>دسته‌بندی موضوعی</label>
                    <select
                      value={formData.category}
                      onChange={e => handleFieldChange('category', e.target.value)}
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
                      onChange={e => handleFieldChange('readTime', e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <ImageUploader
                      label="تصویر شاخص مقاله *"
                      value={formData.image}
                      onChange={url => handleFieldChange('image', url)}
                      sampleImages={sampleBlogImages}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>خلاصه مقاله (نمایش در کارت‌ها) *</label>
                    <textarea
                      placeholder="یک یا دو خط توضیح مختصر درباره موضوع مقاله..."
                      value={formData.excerpt}
                      onChange={e => handleFieldChange('excerpt', e.target.value)}
                      rows="2"
                      className={`${styles.textarea} ${formErrors.excerpt ? styles.inputError : ''}`}
                      style={formErrors.excerpt ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.excerpt && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.excerpt}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>متن کامل مقاله *</label>
                    <textarea
                      placeholder="متن کامل پاراگراف‌های مقاله را اینجا بنویسید (پاراگراف‌ها را با Enter جدا کنید)..."
                      value={formData.content}
                      onChange={e => handleFieldChange('content', e.target.value)}
                      rows="6"
                      className={`${styles.textarea} ${formErrors.content ? styles.inputError : ''}`}
                      style={formErrors.content ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.content && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.content}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={function () { setIsModalOpen(false); }}
                    className={styles.cancelBtn}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    انتشار مقاله در دانشنامه
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewPost && (
        <div className={styles.modalOverlay} onClick={function () { setPreviewPost(null); }}>
          <div className={styles.modalBox} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{previewPost.title}</h3>
                <p className={styles.modalDesc}>
                  دسته‌بندی: {previewPost.category} | {previewPost.readTime}
                </p>
              </div>
              <button
                type="button"
                onClick={function () { setPreviewPost(null); }}
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
                  previewPost.content.map(function (p, idx) {
                    return (
                      <p key={idx} style={{ marginBottom: '0.75rem' }}>
                        {p}
                      </p>
                    );
                  })
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
                    {previewPost.proTips.map(function (tip, idx) {
                      return <li key={idx}>{tip}</li>;
                    })}
                  </ul>
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={function () { setPreviewPost(null); }}
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
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="تأیید حذف مقاله آموزشی"
        itemType="مقاله"
        itemName={posts.find(p => (p.id || p._id) === deleteConfirmId)?.title || 'این مقاله آموزشی'}
        message="آیا از حذف این مقاله از دانشنامه و وبلاگ فروشگاه اطمینان دارید؟ محتوا به طور کامل پاک خواهد شد."
        confirmText="حذف قطعی مقاله"
      />
    </div>
  );
}
