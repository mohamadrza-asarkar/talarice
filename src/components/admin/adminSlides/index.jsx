import React from 'react';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';
import styles from '../../../pages/pages.module.css';

export function AdminSlides({
  sliders,
  showAddSlideForm,
  setShowAddSlideForm,
  handleAddSlide,
  newSlideTitle,
  setNewSlideTitle,
  newSlideSubtitle,
  setNewSlideSubtitle,
  newSlideDesc,
  setNewSlideDesc,
  newSlideCta,
  setNewSlideCta,
  newSlideCategory,
  setNewSlideCategory,
  newSlideImageBase64,
  setNewSlideImageBase64,
  isSubmittingSlide,
  openEditSlideModal,
  handleDeleteSlide
}) {
  return (
    <section className={styles.card}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت اسلایدرها و بنرهای صفحه اصلی</h2>
          <p className={styles.pageSubtitle}>کنترل بنرهای تبلیغاتی، عنوان‌های متحرک و تصاویر اسلایدر بالا</p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          style={{ backgroundColor: '#1C3A27', color: '#fff', borderColor: '#1C3A27' }}
          onClick={() => setShowAddSlideForm(!showAddSlideForm)}
        >
          <Plus size={16} />
          {showAddSlideForm ? 'بستن فرم' : 'افزودن اسلاید جدید'}
        </button>
      </div>

      {showAddSlideForm && (
        <form onSubmit={handleAddSlide} className={styles.cardHighlight} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1C3A27' }}>افزودن بنر اسلایدر جدید</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className={styles.label}>عنوان اصلی اسلاید</label>
              <input
                type="text"
                className={styles.input}
                placeholder="مثلا: برنج اصیل کامفیروز فارس"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={styles.label}>عنوان فرعی / تگ‌لاین</label>
              <input
                type="text"
                className={styles.input}
                placeholder="برداشت تازه شالیزار"
                value={newSlideSubtitle}
                onChange={(e) => setNewSlideSubtitle(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>متن دکمه (CTA)</label>
              <input
                type="text"
                className={styles.input}
                value={newSlideCta}
                onChange={(e) => setNewSlideCta(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>دسته‌بندی مرتبط</label>
              <select
                className={styles.select}
                value={newSlideCategory}
                onChange={(e) => setNewSlideCategory(e.target.value)}
              >
                <option value="all">همه محصولات</option>
                <option value="kamfirouz">کامفیروزی</option>
                <option value="hashemi">هاشمی</option>
                <option value="doudi">دودی</option>
              </select>
            </div>
          </div>
          <div>
            <label className={styles.label}>توضیحات اسلاید</label>
            <textarea
              className={styles.input}
              rows={2}
              value={newSlideDesc}
              onChange={(e) => setNewSlideDesc(e.target.value)}
              placeholder="توضیحات کوتاه..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmittingSlide}
            >
              {isSubmittingSlide ? 'در حال ثبت...' : 'ذخیره و انتشار اسلاید'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {(sliders || []).map((slide) => {
          const sid = slide._id || slide.id;
          return (
            <div key={sid} className={styles.statBox} style={{ border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <img src={slide.image} alt={slide.title} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.15rem 0', color: '#111827' }}>{slide.title}</h4>
                    <span className={styles.badge} style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>{slide.subtitle || 'بنر ویژه'}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>{slide.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  className={styles.backButton}
                  style={{ flex: 1, padding: '0.35rem', fontSize: '0.8rem' }}
                  onClick={() => openEditSlideModal(slide)}
                >
                  <Edit size={14} />
                  ویرایش
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => handleDeleteSlide(sid)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
