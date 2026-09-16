import React, { useRef, useState } from 'react';
import { Package, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { toFaDigits } from '../../../utils/textUtils';
import styles from '../../../pages/pages.module.css';

export function AdminProducts({
  products,
  productSearchQuery,
  setProductSearchQuery,
  showAddProdForm,
  setShowAddProdForm,
  handleAddProduct,
  newProdName,
  setNewProdName,
  newProdPrice,
  setNewProdPrice,
  newProdOriginalPrice,
  setNewProdOriginalPrice,
  newProdDiscount,
  setNewProdDiscount,
  newProdCategory,
  setNewProdCategory,
  newProdWeight,
  setNewProdWeight,
  newProdStock,
  setNewProdStock,
  newProdDesc,
  setNewProdDesc,
  newProdIsAmazing,
  setNewProdIsAmazing,
  newProdImageBase64,
  setNewProdImageBase64,
  isSubmittingProd,
  openEditProductModal,
  handleDeleteProduct,
  handleNewPriceChange,
  handleNewOriginalPriceChange,
  handleNewDiscountChange
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const onPriceChange = (val) => {
    if (handleNewPriceChange) {
      handleNewPriceChange(val);
    } else {
      setNewProdPrice(val);
      const orig = Number(newProdOriginalPrice);
      const cur = Number(val);
      if (orig > 0 && cur > 0 && orig > cur && setNewProdDiscount) {
        setNewProdDiscount(String(Math.round(((orig - cur) / orig) * 100)));
      }
    }
  };

  const onOriginalPriceChange = (val) => {
    if (handleNewOriginalPriceChange) {
      handleNewOriginalPriceChange(val);
    } else {
      setNewProdOriginalPrice(val);
      const orig = Number(val);
      const cur = Number(newProdPrice);
      if (orig > 0 && cur > 0 && orig > cur && setNewProdDiscount) {
        setNewProdDiscount(String(Math.round(((orig - cur) / orig) * 100)));
      }
    }
  };

  const onDiscountChange = (val) => {
    if (handleNewDiscountChange) {
      handleNewDiscountChange(val);
    } else {
      if (setNewProdDiscount) setNewProdDiscount(val);
      const disc = Number(val);
      const orig = Number(newProdOriginalPrice || newProdPrice);
      if (orig > 0 && disc >= 0 && disc <= 100) {
        setNewProdPrice(String(Math.round(orig * (1 - disc / 100))));
        if (!newProdOriginalPrice) setNewProdOriginalPrice(String(orig));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویر انتخاب کنید.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('حجم تصویر بسیار بالا است (حداکثر ۴ مگابایت مجاز است).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewProdImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitWrapper = (e) => {
    e.preventDefault();
    if (!newProdImageBase64) {
      alert('ارسال تصویر محصول الزامی است. لطفاً تصویر محصول را بارگذاری نمایید.');
      return;
    }
    handleAddProduct(e);
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase().trim();
    return (
      String(p.name || p.title || '').toLowerCase().includes(q) ||
      String(p.category || '').toLowerCase().includes(q) ||
      String(p.price || '').includes(q)
    );
  });

  return (
    <section className={styles.card}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت محصولات و انبار</h2>
          <p className={styles.pageSubtitle}>افزودن، ویرایش، قیمت‌گذاری و مدیریت موجودی برنج‌های شالیزار</p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          style={{ backgroundColor: '#1C3A27', color: '#fff', borderColor: '#1C3A27' }}
          onClick={() => setShowAddProdForm(!showAddProdForm)}
        >
          <Plus size={16} />
          {showAddProdForm ? 'بستن فرم' : 'افزودن محصول جدید'}
        </button>
      </div>

      {showAddProdForm && (
        <form onSubmit={handleSubmitWrapper} className={styles.cardHighlight} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1C3A27' }}>فرم افزودن محصول جدید</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className={styles.label}>نام محصول <span style={{ color: '#b91c1c' }}>*</span></label>
              <input
                type="text"
                className={styles.input}
                placeholder="مثلا: برنج کامفیروز درجه یک"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={styles.label}>قیمت نهایی فروش (تومان) <span style={{ color: '#b91c1c' }}>*</span></label>
              <input
                type="number"
                className={styles.input}
                placeholder="430000"
                value={newProdPrice}
                onChange={(e) => onPriceChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={styles.label}>قیمت اصلی / خط‌خورده (تومان)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="480000"
                value={newProdOriginalPrice}
                onChange={(e) => onOriginalPriceChange(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>
                تخفیف (درصد) <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>٪ خودکار</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className={styles.input}
                placeholder="مثلا: 10"
                value={newProdDiscount}
                onChange={(e) => onDiscountChange(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>دسته‌بندی</label>
              <select
                className={styles.select}
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
              >
                <option value="kamfirouz">کامفیروزی</option>
                <option value="hashemi">هاشمی</option>
                <option value="doudi">دودی سنتی</option>
                <option value="tarom">طارم دم‌سیاه</option>
                <option value="nimdaneh">نیم‌دانه</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>وزن / بسته‌بندی</label>
              <input
                type="text"
                className={styles.input}
                value={newProdWeight}
                onChange={(e) => setNewProdWeight(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>موجودی انبار</label>
              <input
                type="number"
                className={styles.input}
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={styles.label}>توضیحات تکمیلی</label>
            <textarea
              className={styles.input}
              rows={2}
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              placeholder="ویژگی‌های عطر و پخت محصول..."
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: newProdIsAmazing ? '#fef2f2' : '#f8fafc',
            border: newProdIsAmazing ? '1.5px solid #f87171' : '1px solid #e2e8f0',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }}>
            <input
              type="checkbox"
              id="newProdIsAmazing"
              checked={newProdIsAmazing}
              onChange={(e) => setNewProdIsAmazing(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
            />
            <label htmlFor="newProdIsAmazing" style={{ fontSize: '0.875rem', fontWeight: 600, color: newProdIsAmazing ? '#991b1b' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔥 قرار گرفتن در بخش پیشنهادهای شگفت‌انگیز (فروش ویژه)
            </label>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div>
            <label className={styles.label}>تصویر محصول <span style={{ color: '#b91c1c' }}>*</span></label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            
            {!newProdImageBase64 ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                style={{
                  border: dragActive ? '2px dashed #1C3A27' : '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: dragActive ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Upload size={32} style={{ color: '#64748b', margin: '0 auto 0.75rem auto' }} />
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                  کشیدن و رها کردن تصویر، یا کلیک برای انتخاب فایل
                </p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                  فرمت‌های مجاز: PNG, JPG, JPEG (حداکثر ۴ مگابایت)
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <img
                  src={newProdImageBase64}
                  alt="پیش‌نمایش محصول"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>تصویر با موفقیت بارگذاری شد</p>
                  <button
                    type="button"
                    onClick={() => setNewProdImageBase64('')}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    <X size={14} />
                    حذف و تغییر تصویر
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmittingProd}
            >
              {isSubmittingProd ? 'در حال ثبت...' : 'ذخیره محصول جدید'}
            </button>
          </div>
        </form>
      )}

      {/* جستجوی محصولات */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          className={styles.input}
          placeholder="جستجو در نام محصولات..."
          value={productSearchQuery}
          onChange={(e) => setProductSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {filteredProducts.map((p) => {
          const pid = p._id || p.id;
          return (
            <div key={pid} className={styles.statBox} style={{ border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#111827' }}>{p.name}</h4>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span className={styles.badge} style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{p.category}</span>
                      {p.isAmazing && (
                        <span className={styles.badge} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                          🔥 شگفت‌انگیز
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1C3A27', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {Number(p.price || 0).toLocaleString('fa-IR')} تومان
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  className={styles.backButton}
                  style={{ flex: 1, padding: '0.35rem', fontSize: '0.8rem' }}
                  onClick={() => openEditProductModal(p)}
                >
                  <Edit size={14} />
                  ویرایش
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => handleDeleteProduct(pid)}
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
