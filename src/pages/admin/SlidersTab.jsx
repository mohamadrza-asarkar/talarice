import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Edit3, Image as ImageIcon, ExternalLink, X, Loader2, Sparkles } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import styles from './style.module.css';

export function SlidersTab() {
  const { heroSlides: sliders, setHeroSlides: setSliders, slidersApi, showError, showSuccess } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialForm = {
    title: '',
    subtitle: 'پیشنهاد ویژه فصل جدید',
    description: 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار در گونی‌های نخی سفید سفارشی',
    ctaText: 'مشاهده تخفیف‌های امروز',
    link: '/products',
    image: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const sampleImages = [
    { label: 'شالیزار و برداشت', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200' },
    { label: 'دانه‌های برنج معطر', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1200' },
    { label: 'کیسه نخی و پخت', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1200' },
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

  function openAddModal() {
    setEditingSlide(null);
    setFormData(initialForm);
    setFormErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(slide) {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || 'پیشنهاد طلا رایس',
      description: slide.description || '',
      ctaText: slide.ctaText || 'مشاهده محصولات',
      link: slide.link || '/products',
      image: slide.image || slide.imageUrl || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const title = (formData.title || '').trim();
    const newErrors = {};

    if (!title) {
      newErrors.title = 'لطفاً عنوان اصلی بنر اسلایدر را وارد فرمایید.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const payload = {
      title: title,
      subtitle: formData.subtitle,
      description: formData.description,
      ctaText: formData.ctaText || 'مشاهده محصولات',
      image: formData.image || sampleImages[0].url,
      link: formData.link || '/products'
    };

    try {
      if (editingSlide) {
        const slideId = editingSlide._id || editingSlide.id;
        if (slidersApi?.updateSlider) {
          const res = await slidersApi.updateSlider(slideId, payload);
          const updated = res.data || { ...editingSlide, ...payload };
          setSliders(prev => prev.map(s => (s._id === slideId || s.id === slideId ? { ...s, ...updated } : s)));
        } else {
          setSliders(prev => prev.map(s => (s._id === slideId || s.id === slideId ? { ...s, ...payload } : s)));
        }
        showSuccess('اسلایدر با موفقیت ویرایش و ذخیره گردید.');
      } else {
        const res = await slidersApi.addSlider(payload);
        const created = res.data || {
          _id: `slide_${Date.now()}`,
          id: `slide_${Date.now()}`,
          ...payload
        };
        setSliders(prev => [created, ...prev]);
        showSuccess('اسلایدر جدید با موفقیت ذخیره و در صفحه اصلی فعال گردید.');
      }
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingSlide(null);
    } catch (err) {
      showError(err, editingSlide ? 'ویرایش اسلایدر' : 'افزودن اسلایدر');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await slidersApi.deleteSlider(id);
      setSliders(prev => prev.filter(s => s._id !== id && s.id !== id));
      showSuccess('اسلایدر با موفقیت حذف گردید.');
      setDeleteConfirmId(null);
    } catch (err) {
      showError(err, 'حذف اسلایدر');
    }
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
            افزودن، ویرایش، حذف بنرهای تبلیغاتی و جشنواره‌های تخفیف صفحه نخست
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
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
                    src={s.image || s.imageUrl || sampleImages[0].url}
                    alt={s.title}
                    onError={function (e) {
                      e.target.onerror = null;
                      e.target.src = sampleImages[0].url;
                    }}
                  />
                  <div className={styles.cardOverlay}>
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className={styles.overlayActionBtn}
                      style={{ background: '#042a1b', color: '#fef08a' }}
                      title="ویرایش اسلایدر"
                      aria-label="ویرایش اسلایدر"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(id)}
                      className={styles.overlayActionBtn}
                      title="حذف بنر"
                      aria-label="حذف بنر"
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className={styles.editBtn}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Edit3 size={13} />
                        <span>ویرایش</span>
                      </button>
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
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="تأیید حذف بنر اسلایدر"
        itemType="بنر تبلیغاتی"
        itemName={sliders.find(s => (s.id || s._id) === deleteConfirmId)?.title || 'اسلایدر صفحه نخست'}
        message="آیا از حذف این بنر نمایشی از صفحه نخست فروشگاه اطمینان دارید؟ این عمل بلافاصله در سایت اعمال خواهد شد."
        confirmText="حذف قطعی بنر"
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingSlide ? 'ویرایش مشخصات بنر اسلایدر' : 'افزودن بنر جدید به ویترین'}
                </h3>
                <p className={styles.modalDesc}>مشخصات بنر، عنوان و تصویر مورد نظر را وارد کنید.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>عنوان اصلی بنر *</label>
                    <input
                      type="text"
                      placeholder="مثال: جشنواره پاییزه برنج اصل کامفیروز"
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
                    <label className={styles.label}>زیرعنوان / برچسب کوچک</label>
                    <input
                      type="text"
                      placeholder="مثال: فروش ویژه فصل جدید"
                      value={formData.subtitle}
                      onChange={e => handleFieldChange('subtitle', e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>متن روی دکمه (CTA)</label>
                    <input
                      type="text"
                      placeholder="مثال: خرید کیسه ۱۰ کیلویی"
                      value={formData.ctaText}
                      onChange={e => handleFieldChange('ctaText', e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>توضیحات کوتاه زیر عنوان</label>
                    <input
                      type="text"
                      placeholder="مثال: تضمین پخت عالی، عطر نوستالژیک و ارسال سریع در گونی نخی"
                      value={formData.description}
                      onChange={e => handleFieldChange('description', e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <ImageUploader
                      label="تصویر بنر اسلایدر *"
                      value={formData.image}
                      onChange={url => handleFieldChange('image', url)}
                      sampleImages={sampleImages}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>لینک مقصد هنگام کلیک</label>
                    <input
                      type="text"
                      placeholder="/products"
                      value={formData.link}
                      onChange={e => handleFieldChange('link', e.target.value)}
                      dir="ltr"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.cancelBtn}
                    disabled={isSubmitting}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span>در حال ذخیره...</span>
                      </span>
                    ) : (
                      <span>{editingSlide ? 'ذخیره تغییرات بنر' : 'افزودن و فعال‌سازی بنر'}</span>
                    )}
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

export default SlidersTab;
