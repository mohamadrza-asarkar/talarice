import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Search, PackageOpen, Edit3, X, Filter, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import styles from './style.module.css';

const RICE_SAMPLE_IMAGES = [
  { label: 'کیسه نخی برنج کامفیروز', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000' },
  { label: 'برنج پخته شده و ری‌کشیده', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1000' },
  { label: 'دانه‌های یکدست برنج معطر', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1000' },
  { label: 'برنج دودی اصیل سنتی', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=1000' }
];

export function ProductsTab() {
  const { products, setProducts, productsApi, showError, showSuccess } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    title: '',
    name: '',
    price: '',
    oldPrice: '',
    discount: '0',
    stock: '20',
    category: 'all',
    origin: 'کامفیروز، استان فارس',
    image: '',
    description: '',
    farmer: 'شالیکاران کامفیروز'
  };

  const [formData, setFormData] = useState(initialFormState);

  function openAddModal() {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormData({
      title: product.title || product.name || '',
      name: product.title || product.name || '',
      price: product.price ? String(product.price) : '',
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      discount: product.discount !== undefined ? String(product.discount) : (product.discountPercent ? String(product.discountPercent) : '0'),
      stock: product.stock !== undefined ? String(product.stock) : (product.count !== undefined ? String(product.count) : '20'),
      category: product.category || 'all',
      origin: product.origin || 'کامفیروز، استان فارس',
      image: typeof product.image === 'string' ? product.image : '',
      description: product.description || '',
      farmer: product.farmer || 'شالیکاران کامفیروز'
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const priceNum = Number(formData.price);
    const oldPriceNum = formData.oldPrice ? Number(formData.oldPrice) : Math.round(priceNum * 1.12);
    const stockNum = Number(formData.stock);
    const discountNum = Number(formData.discount || 0);

    const payload = {
      title: formData.title || formData.name,
      name: formData.title || formData.name,
      description: formData.description,
      price: priceNum,
      oldPrice: oldPriceNum,
      discount: discountNum,
      count: stockNum,
      stock: stockNum,
      category: formData.category,
      origin: formData.origin,
      image: formData.image,
      farmer: formData.farmer
    };

    try {
      if (editingProduct) {
        const prodId = editingProduct._id || editingProduct.id;
        const res = await productsApi.updateProduct(prodId, payload);
        const updated = res.data || res.product;
        setProducts(prev => prev.map(p => (p._id === prodId || p.id === prodId ? { ...p, ...payload, ...updated } : p)));
        showSuccess('محصول با موفقیت ویرایش گردید.');
      } else {
        const res = await productsApi.createProduct(payload);
        const created = res.data || res.product || {
          _id: `prod_${Date.now()}`,
          id: `prod_${Date.now()}`,
          ...payload
        };
        setProducts(prev => [created, ...prev]);
        showSuccess('محصول جدید با موفقیت ثبت شد.');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData(initialFormState);
    } catch (err) {
      showError(err, editingProduct ? 'ویرایش محصول' : 'ثبت محصول جدید');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return;
    try {
      await productsApi.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id && p.id !== id));
      showSuccess('محصول با موفقیت حذف گردید.');
    } catch (err) {
      showError(err, 'حذف محصول');
    }
  }

  // Filter products
  const filteredProducts = products.filter(function (p) {
    const title = p.title || p.name || '';
    const origin = p.origin || '';
    const matchesSearch =
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      origin.toLowerCase().includes(search.toLowerCase());

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'inStock' && (p.stock || p.count || 0) > 0) ||
      (stockFilter === 'outOfStock' && (p.stock || p.count || 0) <= 0);

    return matchesSearch && matchesStock;
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت محصولات انبار</span>
          </h1>
          <p className={styles.tabSubtitle}>
            افزودن، ویرایش قیمت و مدیریت موجودی گونی‌های برنج اعلا طلا رایس
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className={styles.card}>
        {/* Toolbar & Filters */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو بر اساس نام محصول یا منطقه کشت..."
              value={search}
              onChange={function (e) { setSearch(e.target.value); }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.toolbarFilters}>
            <select
              value={stockFilter}
              onChange={function (e) { setStockFilter(e.target.value); }}
              className={styles.filterSelect}
            >
              <option value="all">همه موجودی‌ها</option>
              <option value="inStock">فقط موجود در انبار</option>
              <option value="outOfStock">ناموجود</option>
            </select>

            <div className={styles.countBadge}>
              کالاهای نمایش‌داده: <span className={styles.countNumber}>{filteredProducts.length}</span> از{' '}
              {products.length}
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className={styles.tableContainer}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <PackageOpen size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ محصولی با معیارهای انتخابی یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th} style={{ minWidth: '240px' }}>مشخصات محصول و شالیزار</th>
                    <th className={styles.th}>موجودی انبار</th>
                    <th className={styles.th}>قیمت فروش (تومان)</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(function (p) {
                    const id = p._id || p.id;
                    const stock = p.stock ?? p.count ?? 0;
                    const title = p.title || p.name || 'بدون عنوان';
                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Product info */}
                        <td className={styles.td}>
                          <div className={styles.productCell}>
                            <img
                              src={p.image || p.imageUrl || '/images/products/hashemi.jpg'}
                              alt={title}
                              className={styles.productThumb}
                              onError={function (e) {
                                e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&auto=format&fit=crop&q=60';
                              }}
                            />
                            <div>
                              <strong className={styles.productName}>{title}</strong>
                              <span className={styles.productMeta}>
                                {p.origin || 'کامفیروز، فارس'} {p.farmer ? `| کشاورز: ${p.farmer}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Stock status */}
                        <td className={styles.td}>
                          <div className={styles.stockBadgeWrapper}>
                            {stock > 0 ? (
                              <span className={styles.stockIn}>
                                <CheckCircle2 size={13} />
                                <span>{stock} گونی ۱۰ کیلویی</span>
                              </span>
                            ) : (
                              <span className={styles.stockOut}>ناموجود</span>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td className={styles.td}>
                          <div className={styles.priceCell}>
                            <span className={styles.priceCurrent}>
                              {(p.price ?? 0).toLocaleString('fa-IR')}
                            </span>
                            {p.oldPrice && p.oldPrice > p.price && (
                              <del className={styles.priceOld}>
                                {(p.oldPrice ?? 0).toLocaleString('fa-IR')}
                              </del>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div className={styles.actionsCell}>
                            <button
                              onClick={function () { openEditModal(p); }}
                              className={styles.editBtn}
                              title="ویرایش محصول"
                              aria-label="ویرایش محصول"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={function () { handleDelete(id); }}
                              className={styles.deleteBtn}
                              title="حذف محصول"
                              aria-label="حذف محصول"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  {editingProduct ? 'ویرایش مشخصات محصول' : 'افزودن برنج اعلا به انبار'}
                </h2>
                <p className={styles.modalDesc}>
                  اطلاعات محصول، قیمت‌گذاری و بارگذاری تصویر را تکمیل کنید
                </p>
              </div>
              <button
                type="button"
                onClick={function () { setIsModalOpen(false); }}
                className={styles.modalCloseBtn}
                aria-label="بستن پنجره"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>عنوان کامل محصول *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: برنج کامفیروزی اصل طلا رایس - کیسه ۱۰ کیلوگرمی"
                      value={formData.title}
                      onChange={function (e) { setFormData({ ...formData, title: e.target.value, name: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>دسته‌بندی محصول</label>
                    <select
                      value={formData.category}
                      onChange={function (e) { setFormData({ ...formData, category: e.target.value }); }}
                      className={styles.select}
                    >
                      <option value="all">برنج کامفیروز درجه یک</option>
                      <option value="kamfirooz">کامفیروز بوجار شده</option>
                      <option value="hashemi">برنج طارم هاشمی</option>
                      <option value="smoky">برنج دودی اصیل</option>
                      <option value="broken">برنج نیم‌دانه معطر</option>
                      <option value="sarlash">برنج لاشه و سرلاشه</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>موجودی انبار (تعداد کیسه ۱۰ کیلویی) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="مثال: 45"
                      value={formData.stock}
                      onChange={function (e) { setFormData({ ...formData, stock: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>قیمت فروش (تومان) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="مثال: 1450000"
                      value={formData.price}
                      onChange={function (e) { setFormData({ ...formData, price: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>قیمت قبل از تخفیف (تومان - اختیاری)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="مثال: 1650000"
                      value={formData.oldPrice}
                      onChange={function (e) { setFormData({ ...formData, oldPrice: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>منطقه کشت و شالیزار</label>
                    <input
                      type="text"
                      placeholder="مثال: کامفیروز، مرودشت، استان فارس"
                      value={formData.origin}
                      onChange={function (e) { setFormData({ ...formData, origin: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>کشاورز معتمد</label>
                    <input
                      type="text"
                      placeholder="مثال: حاج رضا زارع کامفیروزی"
                      value={formData.farmer}
                      onChange={function (e) { setFormData({ ...formData, farmer: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <ImageUploader
                      label="تصویر شاخص محصول *"
                      value={formData.image}
                      onChange={function (url) { setFormData({ ...formData, image: url }); }}
                      sampleImages={RICE_SAMPLE_IMAGES}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>توضیحات و ویژگی‌های پخت و عطر</label>
                    <textarea
                      rows="3"
                      placeholder="توضیحات ری‌کشیدن، عطر برنج، زمان بوجار، تضمین اصالت و پخت مجلسی..."
                      value={formData.description}
                      onChange={function (e) { setFormData({ ...formData, description: e.target.value }); }}
                      className={styles.textarea}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={function () { setIsModalOpen(false); }}
                    className={styles.cancelBtn}
                    disabled={isSubmitting}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span>در حال ذخیره‌سازی...</span>
                      </span>
                    ) : (
                      <span>{editingProduct ? 'ذخیره تغییرات محصول' : 'ثبت نهایی کالا در انبار'}</span>
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

export default ProductsTab;
