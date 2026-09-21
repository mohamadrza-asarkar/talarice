import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit, X, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../../api/client';
import styles from '../admin.module.css';

const defaultSlideForm = {
  title: '',
  subtitle: '',
  description: '',
  ctaText: 'مشاهده و خرید',
  category: 'all',
  image: ''
};

export function AdminSlides({
  sliders = [],
  onAddSlide,
  onUpdateSlide,
  onDeleteSlide
}) {
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeSlide, setActiveSlide] = useState(null);
  const [form, setForm] = useState(defaultSlideForm);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setForm(defaultSlideForm);
    setModalMode('add');
  };

  const openEditModal = (slide) => {
    setActiveSlide(slide);
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      ctaText: slide.ctaText || 'مشاهده و خرید',
      category: slide.category || 'all',
      image: slide.image || ''
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveSlide(null);
  };

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleFieldChange('image', event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setIsSubmitting(true);
    try {
      if (modalMode === 'add' && onAddSlide) {
        await onAddSlide(form);
      } else if (modalMode === 'edit' && onUpdateSlide && activeSlide) {
        const id = activeSlide.id || activeSlide._id;
        await onUpdateSlide(id, form);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>مدیریت اسلایدر و بنرهای تبلیغاتی</h2>
          <p className={styles.subtitle}>اسلایدهای صفحه اصلی سایت را ویرایش، حذف یا ایجاد کنید</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>افزودن اسلاید جدید</span>
        </button>
      </div>

      <div className={styles.itemsList}>
        {sliders.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={32} />
            <p>هیچ اسلایدی یافت نشد.</p>
          </div>
        ) : (
          sliders.map((s) => {
            const sid = s.id || s._id;
            return (
              <div key={sid} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <img
                    src={getImageUrl(s.image)}
                    alt={s.title}
                    className={styles.thumbnail}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
                    }}
                  />
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{s.title}</h3>
                    <p className={styles.itemMeta}>
                      <span>{s.subtitle || 'بدون زیرعنوان'}</span>
                      <span>|</span>
                      <span>دکمه: {s.ctaText || 'مشاهده'}</span>
                    </p>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => openEditModal(s)}
                  >
                    <Edit size={14} />
                    <span>ویرایش</span>
                  </button>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setSlideToDelete(s)}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete confirmation modal */}
      {slideToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأیید حذف اسلاید</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSlideToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className={styles.confirmText}>
              آیا از حذف اسلاید «{slideToDelete.title}» اطمینان دارید؟
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setSlideToDelete(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => {
                  const sid = slideToDelete.id || slideToDelete._id;
                  setSlideToDelete(null);
                  if (onDeleteSlide) onDeleteSlide(sid);
                }}
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {modalMode && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalMode === 'add' ? 'افزودن اسلاید جدید' : 'ویرایش اسلاید'}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>عنوان اصلی اسلاید</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: برنج معطر کامفیروز اصل"
                  value={form.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>زیرعنوان / شعار</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: برداشت تازه سال از بهترین شالیزارها"
                  value={form.subtitle}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات کوتاه</label>
                <textarea
                  className={styles.textarea}
                  placeholder="متن کوتاه معرفی اسلاید..."
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>متن دکمه (CTA)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مشاهده و خرید"
                  value={form.ctaText}
                  onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تصویر اسلاید</label>
                <div className={styles.rowUpload}>
                  {form.image && (
                    <img
                      src={getImageUrl(form.image)}
                      alt="پیش‌نمایش"
                      className={styles.previewThumb}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={closeModal}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ذخیره اسلاید'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminSlides;
