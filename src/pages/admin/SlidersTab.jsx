import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Image as ImageIcon, ExternalLink, X, Sparkles } from 'lucide-react';
import styles from './style.module.css';

export function SlidersTab() {
  const { heroSlides: sliders, setHeroSlides: setSliders } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    title: '',
    subtitle: 'پیشنهاد ویژه فصل جدید',
    description: 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار در گونی‌های نخی سفید سفارشی',
    ctaText: 'مشاهده تخفیف‌های امروز',
    link: '/products',
    image: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const sampleImages = [
    { label: 'شالیزار و برداشت', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200' },
    { label: 'دانه‌های برنج معطر', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1200' },
    { label: 'کیسه نخی و پخت', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1200' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    const newId = `slide_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newSlider = {
      _id: newId,
      id: newId,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      ctaText: formData.ctaText || 'مشاهده محصولات',
      image: formData.image || sampleImages[0].url,
      link: formData.link || '/products'
    };

    setSliders([newSlider, ...sliders]);
    setIsModalOpen(false);
    setFormData(initialForm);
  }

  function handleDelete(id) {
    if (!window.confirm('آیا از حذف این بنر نمایشی اطمینان دارید؟')) return;
    setSliders(sliders.filter(function (s) { return s._id !== id && s.id !== id; }));
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت ویترین و اسلایدرها</span>
          </h1>
          <p className={styles.tabSubtitle}>
            تنظیم بنرهای تبلیغاتی، جشنواره‌های تخفیف و اسلایدر صفحه نخست طلا رایس
          </p>
        </div>
        <button onClick={function () { setIsModalOpen(true); }} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>افزودن بنر جدید</span>
        </button>
      </div>

      {/* Grid */}
      {sliders.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <ImageIcon size={56} className={styles.emptyIcon} />
            <p className={styles.emptyText}>هیچ بنری برای صفحه نخست تعریف نشده است</p>
          </div>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {sliders.map(function (s) {
            const id = s._id || s.id;
            return (
              <div key={id} className={styles.gridCard}>
                <div className={styles.cardImageWrap}>
                  <img
                    src={s.image || sampleImages[0].url}
                    alt={s.title}
                    onError={function (e) {
                      e.target.onerror = null;
                      e.target.src = sampleImages[0].url;
                    }}
                  />
                  <div className={styles.cardOverlay}>
                    <button
                      onClick={function () { handleDelete(id); }}
                      className={styles.overlayActionBtn}
                      title="حذف بنر"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardMetaBadge}>
                      {s.subtitle || 'پیشنهاد طلا رایس'}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{s.title || 'بنر تبلیغاتی'}</h3>
                  <p className={styles.cardExcerpt}>{s.description || 'توضیحات اسلایدر...'}</p>

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
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800 }}>
                      دکمه: {s.ctaText || 'مشاهده'}
                    </span>
                    <a
                      href={s.link || '/products'}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <span>لینک مقصد</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={function () { setIsModalOpen(false); }}>
          <div className={styles.modalBox} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>افزودن بنر جدید به ویترین</h3>
                <p className={styles.modalDesc}>مشخصات بنر و تصویر مورد نظر را وارد کنید.</p>
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
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>عنوان اصلی بنر</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: جشنواره پاییزه برنج اصل کامفیروز"
                      value={formData.title}
                      onChange={function (e) { setFormData({ ...formData, title: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>زیرعنوان / برچسب کوچک</label>
                    <input
                      type="text"
                      placeholder="مثال: فروش ویژه فصل جدید"
                      value={formData.subtitle}
                      onChange={function (e) { setFormData({ ...formData, subtitle: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>متن روی دکمه (CTA)</label>
                    <input
                      type="text"
                      placeholder="مثال: خرید کیسه ۱۰ کیلویی"
                      value={formData.ctaText}
                      onChange={function (e) { setFormData({ ...formData, ctaText: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>توضیحات کوتاه زیر عنوان</label>
                    <input
                      type="text"
                      placeholder="مثال: تضمین پخت عالی، عطر نوستالژیک و ارسال سریع در گونی نخی"
                      value={formData.description}
                      onChange={function (e) { setFormData({ ...formData, description: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>آدرس تصویر بنر (URL)</label>
                    <input
                      required
                      type="text"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={function (e) { setFormData({ ...formData, image: e.target.value }); }}
                      dir="ltr"
                      className={styles.input}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                        تصاویر آماده:
                      </span>
                      {sampleImages.map(function (img, idx) {
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={function () { setFormData({ ...formData, image: img.url }); }}
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
                        );
                      })}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>لینک مقصد هنگام کلیک</label>
                    <input
                      type="text"
                      placeholder="/products"
                      value={formData.link}
                      onChange={function (e) { setFormData({ ...formData, link: e.target.value }); }}
                      dir="ltr"
                      className={styles.input}
                    />
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
                    افزودن و فعال‌سازی بنر
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
