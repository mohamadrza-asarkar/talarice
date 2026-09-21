import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { getImageUrl } from '../../../api/client';
import styles from '../admin.module.css';

const defaultProductForm = {
  name: '',
  price: '',
  originalPrice: '',
  discount: '0',
  category: 'kamfirouz',
  weight: '۱۰ کیلوگرم',
  stock: '30',
  description: '',
  isAmazing: false,
  image: ''
};

export function AdminProducts({
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeProduct, setActiveProduct] = useState(null);
  const [form, setForm] = useState(defaultProductForm);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return String(p.name || '').toLowerCase().includes(q);
  });

  const openAddModal = () => {
    setForm(defaultProductForm);
    setModalMode('add');
  };

  const openEditModal = (product) => {
    setActiveProduct(product);
    setForm({
      name: product.name || '',
      price: String(product.price || ''),
      originalPrice: String(product.originalPrice || product.price || ''),
      discount: String(product.discount || '0'),
      category: product.category || 'kamfirouz',
      weight: product.weight || '۱۰ کیلوگرم',
      stock: String(product.stock ?? '30'),
      description: product.description || '',
      isAmazing: Boolean(product.isAmazing),
      image: product.image || ''
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveProduct(null);
  };

  const handleFieldChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto compute discount when original price and current price change
      if (key === 'originalPrice' || key === 'price') {
        const orig = Number(key === 'originalPrice' ? value : updated.originalPrice);
        const cur = Number(key === 'price' ? value : updated.price);
        if (orig > 0 && cur > 0 && orig > cur) {
          updated.discount = String(Math.round(((orig - cur) / orig) * 100));
        }
      }
      return updated;
    });
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
    if (!form.name.trim() || !form.price) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        discount: Number(form.discount || 0),
        stock: Number(form.stock || 30)
      };

      if (modalMode === 'add' && onAddProduct) {
        await onAddProduct(payload);
      } else if (modalMode === 'edit' && onUpdateProduct && activeProduct) {
        const id = activeProduct.id || activeProduct._id;
        await onUpdateProduct(id, payload);
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
          <h2 className={styles.title}>مدیریت محصولات فروشگاه</h2>
          <p className={styles.subtitle}>افزودن محصول جدید، قیمت‌گذاری و مدیریت موجودی</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجوی محصول با نام..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.itemsList}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={32} />
            <p>محصولی یافت نشد.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const pid = p.id || p._id;
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
                      {p.isAmazing && (
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>
                          <Star size={11} />
                          <span>شگفت‌انگیز</span>
                        </span>
                      )}
                    </div>
                    <p className={styles.itemMeta}>
                      <span>{Number(p.price || 0).toLocaleString('fa-IR')} تومان</span>
                      <span>|</span>
                      <span>وزن: {p.weight || '۱۰ کیلو'}</span>
                      <span>|</span>
                      <span>موجودی: {p.stock ?? 30} کیسه</span>
                    </p>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => openEditModal(p)}
                  >
                    <Edit size={14} />
                    <span>ویرایش</span>
                  </button>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setProductToDelete(p)}
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
      {productToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأیید حذف محصول</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setProductToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className={styles.confirmText}>
              آیا از حذف محصول «{productToDelete.name}» اطمینان دارید؟
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setProductToDelete(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => {
                  const pid = productToDelete.id || productToDelete._id;
                  setProductToDelete(null);
                  if (onDeleteProduct) onDeleteProduct(pid);
                }}
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalMode && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalMode === 'add' ? 'افزودن محصول جدید' : 'ویرایش محصول'}
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
                <label className={styles.label}>نام محصول</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: برنج معطر کامفیروز اصل"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  required
                />
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid2}`}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت اصلی (تومان)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۴۸۰۰۰۰"
                    value={form.originalPrice}
                    onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت با تخفیف / فروش (تومان)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۴۳۰۰۰۰"
                    value={form.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid2}`}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>درصد تخفیف</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۱۰"
                    value={form.discount}
                    onChange={(e) => handleFieldChange('discount', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>موجودی (کیسه)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۵۰"
                    value={form.stock}
                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid2}`}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>دسته‌بندی</label>
                  <select
                    className={styles.select}
                    value={form.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                  >
                    <option value="kamfirouz">برنج کامفیروز</option>
                    <option value="tarom">برنج طارم</option>
                    <option value="hashemi">برنج هاشمی</option>
                    <option value="doudi">برنج دودی</option>
                    <option value="nimdane">نیم دانه</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>وزن بسته</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: ۱۰ کیلوگرم"
                    value={form.weight}
                    onChange={(e) => handleFieldChange('weight', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات محصول</label>
                <textarea
                  className={styles.textarea}
                  placeholder="مشخصات عطر، پخت و ری‌دهی..."
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تصویر محصول</label>
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
                  {isSubmitting ? 'در حال ثبت...' : 'ذخیره محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;
