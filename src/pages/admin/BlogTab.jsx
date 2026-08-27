import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import styles from './style.module.css';

export const BlogTab = () => {
  const { articles: posts, setArticles: setPosts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', excerpt: '', image: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      _id: `post_${Math.random().toString(36).substr(2, 9)}`,
      id: `post_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image || '/images/blog/blog-1.jpg',
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      author: 'مدیر سایت',
      category: 'مقالات'
    };
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setFormData({ title: '', excerpt: '', image: '', content: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('پست حذف شود؟')) return;
    setPosts(posts.filter(p => p._id !== id && p.id !== id));
  };

  return (
    <div>
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>مدیریت وبلاگ</h1>
          <p className={styles.tabSubtitle}>انتشار و ویرایش مقالات در سایت</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={20} strokeWidth={2.5} /> مقاله جدید
        </button>
      </div>

      {posts.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
             <BookOpen size={64} className={styles.emptyIcon} />
             <p className={styles.emptyText}>هیچ مقاله‌ای یافت نشد</p>
          </div>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {posts.map(post => (
            <div key={post._id} className={styles.gridCard}>
              <div className={styles.cardImageWrap}>
                {post.image ? (
                  <img src={post.image.startsWith('http') ? post.image : `http://localhost:3000${post.image}`} alt={post.title} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><BookOpen size={40}/></div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleDelete(post._id)} className={styles.deleteBtn}>
                    <Trash2 size={18} strokeWidth={2.5}/>
                  </button>
                </div>
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
              <h3 className={styles.modalTitle}>نوشتن مقاله جدید</h3>
              <p className={styles.modalDesc}>اطلاعات محتوا را با دقت وارد کنید.</p>
            </div>
            
            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان مقاله</label>
                  <input required type="text" placeholder="عنوان جذاب مقاله..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک تصویر (URL)</label>
                  <input required type="text" placeholder="https://..." dir="ltr" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={styles.input} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>خلاصه مقاله</label>
                  <textarea required placeholder="یک یا دو خط توضیح برای نمایش در کارت..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows="2" className={styles.textarea}></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>متن اصلی مقاله</label>
                  <textarea required placeholder="شروع به نوشتن کنید..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="6" className={styles.textarea}></textarea>
                </div>
                
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>انصراف</button>
                  <button type="submit" className={styles.submitBtn}>انتشار مقاله</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
