import React, { useState } from 'react';
import { MessageSquare, Trash2, Star } from 'lucide-react';
import styles from '../admin.module.css';

export function AdminReviews({
  reviews = [],
  onDeleteReview
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      String(r.author || r.userName || '').toLowerCase().includes(q) ||
      String(r.comment || r.text || '').toLowerCase().includes(q)
    );
  });

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>نظرات و بازخوردهای خریداران</h2>
          <p className={styles.subtitle}>بررسی رضایت‌مندی و نظرات ثبت شده کاربران برای محصولات</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجو در متن نظر یا نام نویسنده..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.itemsList}>
        {filteredReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare size={32} />
            <p>هیچ نظری یافت نشد.</p>
          </div>
        ) : (
          filteredReviews.map((r) => {
            const rid = r.id || r._id;
            return (
              <div key={rid} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <div className={styles.rowCenter}>
                    <h3 className={styles.itemName}>{r.author || r.userName || 'خریدار ناشناس'}</h3>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
                      <Star size={11} />
                      <span>{r.rating || 5} از ۵</span>
                    </span>
                  </div>
                  <p className={styles.commentBody}>
                    {r.comment || r.text}
                  </p>
                  <p className={styles.itemMeta}>
                    <span>تاریخ: {r.date || 'اخیر'}</span>
                    {r.productName && <span>| محصول: {r.productName}</span>}
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => onDeleteReview && onDeleteReview(rid)}
                  >
                    <Trash2 size={14} />
                    <span>حذف نظر</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default AdminReviews;
