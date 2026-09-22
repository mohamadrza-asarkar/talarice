import React, { useState } from 'react';
import { getImageUrl } from '../../../api/client';
import styles from '../admin.module.css';

const defaultProductForm = {
  name: '',
  price: '',
  originalPrice: '',
  discount: 0,
  category: 'kamfirouz',
  weight: '۱۰ کیلوگرم',
  stock: 30,
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

  const queryText = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (!queryText) return true;
    const name = product.name || '';
    return name.toLowerCase().includes(queryText);
  });

  const openAddModal = () => {
    setForm(defaultProductForm);
    setModalMode('add');
  };

  const openEditModal = (product) => {
    setActiveProduct(product);
    setForm({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || product.price || '',
      discount: product.discount || 0,
      category: product.category || 'kamfirouz',
      weight: product.weight || '۱۰ کیلوگرم',
      stock: product.stock ?? 30,
      description: product.description || '',
      isAmazing: !!product.isAmazing,
      image: product.image || ''
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveProduct(null);
  };

  const handleFieldChange = (key, value) => {
    setForm((previous) => {
      const updated = { ...previous, [key]: value };
      if (key === 'originalPrice' || key === 'price') {
        const original = Number(key === 'originalPrice' ? value : updated.originalPrice);
        const current = Number(key === 'price' ? value : updated.price);
        if (original > 0 && current > 0 && original > current) {
          updated.discount = Math.round(((original - current) / original) * 100);
        }
      }
      return updated;
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      handleFieldChange('image', loadEvent.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        const productId = activeProduct.id || activeProduct._id;
        await onUpdateProduct(productId, payload);
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
          <i className="fa-solid fa-plus" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجوی محصول با نام..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className={styles.itemsList}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-box" style={{ fontSize: '2rem' }} />
            <p>محصولی یافت نشد.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const productId = product.id || product._id;
            return (
              <div key={productId} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className={styles.thumbnail}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
                    }}
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.rowCenter}>
                      <h3 className={styles.itemName}>{product.name}</h3>
                      {product.isAmazing && (
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>
                          <i className="fa-solid fa-star" />
                          <span>شگفت‌انگیز</span>
                        </span>
                      )}
                    </div>
                    <p className={styles.itemMeta}>
                      <span>{Number(product.price || 0).toLocaleString('fa-IR')} تومان</span>
                      <span>|</span>
                      <span>وزن: {product.weight || '۱۰ کیلو'}</span>
                      <span>|</span>
                      <span>موجودی: {product.stock ?? 30} کیسه</span>
                    </p>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => openEditModal(product)}
                  >
                    <i className="fa-solid fa-pen-to-square" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setProductToDelete(product)}
                  >
                    <i className="fa-solid fa-trash-can" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                <i className="fa-solid fa-xmark" />
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
                  const productId = productToDelete.id || productToDelete._id;
                  setProductToDelete(null);
                  if (onDeleteProduct) onDeleteProduct(productId);
                }}
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

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
                <i className="fa-solid fa-xmark" />
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
                  onChange={(event) => handleFieldChange('name', event.target.value)}
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
                    onChange={(event) => handleFieldChange('originalPrice', event.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>قیمت با تخفیف / فروش (تومان)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۴۳۰۰۰۰"
                    value={form.price}
                    onChange={(event) => handleFieldChange('price', event.target.value)}
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
                    onChange={(event) => handleFieldChange('discount', event.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>موجودی (کیسه)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="مثال: ۵۰"
                    value={form.stock}
                    onChange={(event) => handleFieldChange('stock', event.target.value)}
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid2}`}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>دسته‌بندی</label>
                  <select
                    className={styles.select}
                    value={form.category}
                    onChange={(event) => handleFieldChange('category', event.target.value)}
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
                    onChange={(event) => handleFieldChange('weight', event.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات محصول</label>
                <textarea
                  className={styles.textarea}
                  placeholder="مشخصات عطر، پخت و ری‌دهی..."
                  value={form.description}
                  onChange={(event) => handleFieldChange('description', event.target.value)}
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
