import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, X, Star } from 'lucide-react';
import { getImageUrl } from '../../../api/client';
import styles from '../admin.module.css';

const defaultDealForm = {
  productId: '',
  discountPercent: '15',
  dealPrice: '',
  dealDurationHours: '24'
};

export function AdminDeals({
  amazingProducts = [],
  allProducts = [],
  onAddDeal,
  onRemoveDeal
}) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultDealForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductSelect = (productId) => {
    const selected = allProducts.find((p) => (p.id || p._id) === productId);
    const regPrice = Number(selected?.price || 0);
    const disc = Number(form.discountPercent || 15);
    const computedDeal = regPrice > 0 ? Math.round(regPrice * (1 - disc / 100)) : '';

    setForm((prev) => ({
      ...prev,
      productId,
      dealPrice: String(computedDeal)
    }));
  };

  const handleDiscountChange = (discVal) => {
    const disc = Number(discVal);
    const selected = allProducts.find((p) => (p.id || p._id) === form.productId);
    const regPrice = Number(selected?.price || 0);
    const computedDeal = regPrice > 0 && disc >= 0 ? Math.round(regPrice * (1 - disc / 100)) : '';

    setForm((prev) => ({
      ...prev,
      discountPercent: discVal,
      dealPrice: String(computedDeal)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) return;
    setIsSubmitting(true);
    try {
      if (onAddDeal) {
        await onAddDeal(form);
      }
      setForm(defaultDealForm);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>مدیریت پیشنهادهای شگفت‌انگیز</h2>
          <p className={styles.subtitle}>محصولات منتخب با تخفیف ویژه در بخش شگفت‌انگیز صفحه نخست</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>افزودن محصول شگفت‌انگیز</span>
        </button>
      </div>

      <div className={styles.itemsList}>
        {amazingProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <Sparkles size={32} />
            <p>در حال حاضر هیچ محصولی در پیشنهاد شگفت‌انگیز قرار ندارد.</p>
          </div>
        ) : (
          amazingProducts.map((p) => {
            const pid = p.id || p._id;
            const regPrice = Number(p.price || 0);
            const dealPrice = Number(p.dealPrice || Math.round(regPrice * (1 - (p.discountPercent || 15) / 100)));
            return (
              <div key={pid} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <img
                    src={getImageUrl(p.image)}
                    alt={p.name}
                    className={styles.thumbnail}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
                    }}
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.rowCenter}>
                      <h3 className={styles.itemName}>{p.name}</h3>
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>
                        <Star size={11} />
                        <span>{p.discountPercent || 15}٪ تخفیف</span>
                      </span>
                    </div>
                    <p className={styles.itemMeta}>
                      <span>قیمت شگفت‌انگیز: {dealPrice.toLocaleString('fa-IR')} تومان</span>
                      <span>(قیمت قبل: {regPrice.toLocaleString('fa-IR')})</span>
                    </p>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => onRemoveDeal && onRemoveDeal(pid)}
                  >
                    <Trash2 size={14} />
                    <span>حذف از شگفت‌انگیز</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Deal Modal */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>افزودن به پیشنهادهای شگفت‌انگیز</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>انتخاب محصول</label>
                <select
                  className={styles.select}
                  value={form.productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  required
                >
                  <option value="">-- یک محصول انتخاب کنید --</option>
                  {allProducts.map((p) => {
                    const id = p.id || p._id;
                    return (
                      <option key={id} value={id}>
                        {p.name} ({Number(p.price || 0).toLocaleString('fa-IR')} تومان)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid2}`}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>درصد تخفیف</label>
                  <input
                    type="number"
                    className={styles.input}
                    min="1"
                    max="90"
                    value={form.discountPercent}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت نهایی شگفت‌انگیز (تومان)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={form.dealPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, dealPrice: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>مدت زمان اعتبار (ساعت)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={form.dealDurationHours}
                  onChange={(e) => setForm((prev) => ({ ...prev, dealDurationHours: e.target.value }))}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setShowModal(false)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت در شگفت‌انگیز'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDeals;
