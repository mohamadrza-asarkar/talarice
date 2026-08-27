import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from './style.module.css';

export const SlidersTab = () => {
  const { heroSlides: sliders, setHeroSlides: setSliders } = useApp();
  const [formData, setFormData] = useState({ title: '', image: '', isActive: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSlider = {
      _id: `slide_${Math.random().toString(36).substr(2, 9)}`,
      id: `slide_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      image: formData.image || '/images/slides/slide-1.jpg',
      link: '/products'
    };
    setSliders([newSlider, ...sliders]);
    setIsModalOpen(false);
    setFormData({ title: '', image: '', isActive: true });
  };

  const handleDelete = (id) => {
    if (!window.confirm('حذف شود؟')) return;
    setSliders(sliders.filter(s => s._id !== id && s.id !== id));
  };

  return (
    <div>
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>ویترین و اسلایدرها</h1>
          <p className={styles.tabSubtitle}>مدیریت بنرهای نمایشی در صفحه اصلی سایت</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={20} strokeWidth={2.5} /> افزودن بنر جدید
        </button>
      </div>

      {sliders.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
             <ImageIcon size={64} className={styles.emptyIcon} />
             <p className={styles.emptyText}>هیچ بنری تنظیم نشده است</p>
          </div>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {sliders.map(s => (
            <div key={s._id} className={styles.gridCard}>
              <div className={styles.cardImageWrap}>
                {s.image ? (
                  <img src={s.image.startsWith('http') ? s.image : `http://localhost:3000${s.image}`} alt={s.title} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><ImageIcon size={40}/></div>
                )}
                <div className={styles.cardOverlay}>
                  <button onClick={() => handleDelete(s._id)} className={styles.overlayActionBtn}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{s.title || 'بنر بدون عنوان'}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>ثبت بنر جدید</h3>
              <p className={styles.modalDesc}>آدرس تصویر را وارد کنید.</p>
            </div>
            
            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان بنر</label>
                  <input required type="text" placeholder="مثال: جشنواره پاییزه" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={styles.input} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک تصویر (URL)</label>
                  <input required type="text" placeholder="https://..." dir="ltr" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={styles.input} />
                </div>
                
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>انصراف</button>
                  <button type="submit" className={styles.submitBtn}>ثبت بنر</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
