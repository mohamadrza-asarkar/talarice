import React, { useState, useMemo } from 'react';
import { useApp } from '../../context';
import {
  Plus,
  Trash2,
  Search,
  PackageOpen,
  Edit3,
  X,
  Filter,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Tag,
  Boxes
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { DeleteConfirmModal } from './DeleteConfirmModal';
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
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialFormState = {
    title: '',
    name: '',
    price: '',
    discount: '0',
    stock: '25',
    count: '25',
    image: '',
    description: '',
    isAmazing: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function openAddModal() {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormData({
      title: product.title || product.name || '',
      name: product.title || product.name || '',
      price: product.price ? String(product.price) : '',
      discount: product.discount !== undefined ? String(product.discount) : (product.discountPercent ? String(product.discountPercent) : '0'),
      stock: product.stock !== undefined ? String(product.stock) : (product.count !== undefined ? String(product.count) : '20'),
      count: product.count !== undefined ? String(product.count) : (product.stock !== undefined ? String(product.stock) : '20'),
      image: typeof product.image === 'string' ? product.image : '',
      description: product.description || '',
      isAmazing: Boolean(product.isAmazing || product.isDeal)
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const title = (formData.title || formData.name || '').trim();
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock !== undefined && formData.stock !== '' ? formData.stock : formData.count);
    const newErrors = {};

    if (!title) {
      newErrors.title = 'لطفاً عنوان کامل محصول را وارد فرمایید.';
    } else if (title.length < 3) {
      newErrors.title = 'عنوان محصول باید حداقل ۳ کاراکتر باشد.';
    }

    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'لطفاً مبلغ معتبر قیمت فروش به تومان را وارد فرمایید.';
    }

    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'لطفاً موجودی انبار را تعیین فرمایید (عدد ۰ یا بیشتر).';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const discountNum = Number(formData.discount || 0);

    const payload = {
      title: title,
      name: title,
      description: formData.description || '',
      price: priceNum,
      discount: discountNum,
      count: stockNum,
      stock: stockNum,
      image: formData.image || RICE_SAMPLE_IMAGES[0].url,
      isAmazing: Boolean(formData.isAmazing)
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
        showSuccess('محصول جدید با موفقیت به ویترین فروشگاه افزوده شد.');
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingProduct(null);
    } catch (err) {
      showError(err, 'ذخیره مشخصات محصول');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await productsApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
      showSuccess('محصول با موفقیت از فروشگاه حذف گردید.');
      setDeleteConfirmId(null);
    } catch (err) {
      showError(err, 'حذف محصول');
    }
  }

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const s = search.toLowerCase();

      const matchesSearch = !s || name.includes(s) || desc.includes(s);

      const stockCount = p.stock !== undefined ? p.stock : (p.count || 0);
      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = stockCount > 5;
      else if (stockFilter === 'low_stock') matchesStock = stockCount > 0 && stockCount <= 5;
      else if (stockFilter === 'out_of_stock') matchesStock = stockCount <= 0;

      return matchesSearch && matchesStock;
    }).sort((a, b) => {
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);
      const stockA = Number(a.stock || a.count || 0);
      const stockB = Number(b.stock || b.count || 0);

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'stock_desc') return stockB - stockA;
      return 0; // default newest/order in array
    });
  }, [products, search, stockFilter, sortBy]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت محصولات، نرخ‌گذاری و موجودی انبار</span>
          </h1>
          <p className={styles.tabSubtitle}>
            کنترل دقیق کاتالوگ کیسه‌های برنج، قیمت روز، تخفیف‌ها و اتصال مستقیم به وب‌سرویس
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Main Table & Controls Card */}
      <div className={styles.card}>
        {/* Filters & Search Toolbar */}
        <div className={styles.toolbar} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className={styles.searchBox} style={{ flex: '1 1 240px' }}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو در عنوان یا توضیحات محصول..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className={styles.searchInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={e => { setStockFilter(e.target.value); setCurrentPage(1); }}
              className={styles.filterChip}
              style={{ padding: '0.45rem 0.75rem', cursor: 'pointer' }}
            >
              <option value="all">وضعیت موجودی: همه</option>
              <option value="in_stock">موجود در انبار</option>
              <option value="low_stock">موجودی محدود (زیر ۵ کیسه)</option>
              <option value="out_of_stock">ناموجود در انبار</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={styles.filterChip}
              style={{ padding: '0.45rem 0.75rem', cursor: 'pointer' }}
            >
              <option value="newest">ترتیب: جدیدترین‌ها</option>
              <option value="price_asc">قیمت: ارزان‌ترین به گران‌ترین</option>
              <option value="price_desc">قیمت: گران‌ترین به ارزان‌ترین</option>
              <option value="stock_desc">موجودی: بیشترین موجودی</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className={styles.tableContainer}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <PackageOpen size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ محصولی با فیلترهای انتخاب شده یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>تصویر</th>
                    <th className={styles.th}>عنوان محصول</th>
                    <th className={styles.th}>قیمت فروش</th>
                    <th className={styles.th}>تخفیف</th>
                    <th className={styles.th}>موجودی</th>
                    <th className={styles.th}>ویژه / شگفت‌انگیز</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(p => {
                    const id = p._id || p.id;
                    const stock = p.stock !== undefined ? p.stock : (p.count || 0);
                    const discount = p.discount || p.discountPercent || 0;
                    const isAmazing = Boolean(p.isAmazing || p.isDeal);

                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Image */}
                        <td className={styles.td} style={{ width: '60px' }}>
                          <img
                            src={p.image || RICE_SAMPLE_IMAGES[0].url}
                            alt={p.name || p.title}
                            style={{
                              width: '46px',
                              height: '46px',
                              objectFit: 'cover',
                              borderRadius: '0.5rem',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        </td>

                        {/* Title */}
                        <td className={styles.td}>
                          <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                            {p.name || p.title}
                          </div>
                          {p.description && (
                            <div style={{
                              fontSize: '0.725rem',
                              color: '#64748b',
                              marginTop: '0.15rem',
                              maxWidth: '260px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {p.description}
                            </div>
                          )}
                        </td>

                        {/* Price */}
                        <td className={styles.td}>
                          <span className={styles.priceText}>{Number(p.price || 0).toLocaleString('fa-IR')}</span>{' '}
                          <span className={styles.currency}>تومان</span>
                          {p.oldPrice && p.oldPrice > p.price && (
                            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              {Number(p.oldPrice).toLocaleString('fa-IR')} تومان
                            </div>
                          )}
                        </td>

                        {/* Discount */}
                        <td className={styles.td}>
                          {discount > 0 ? (
                            <span style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {discount}٪ تخفیف
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ندارد</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className={styles.td}>
                          {stock > 5 ? (
                            <span style={{
                              color: '#166534',
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {stock} در انبار
                            </span>
                          ) : stock > 0 ? (
                            <span style={{
                              color: '#b45309',
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              تنها {stock} باقی‌مانده
                            </span>
                          ) : (
                            <span style={{
                              color: '#dc2626',
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              ناموجود
                            </span>
                          )}
                        </td>

                        {/* Is Amazing */}
                        <td className={styles.td}>
                          {isAmazing ? (
                            <span style={{
                              background: 'rgba(212, 175, 55, 0.15)',
                              color: '#854d0e',
                              border: '1px solid #d4af37',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <Sparkles size={12} color="#b45309" />
                              شگفت‌انگیز
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>عادی</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                            <button
                              onClick={() => openEditModal(p)}
                              className={styles.detailBtn}
                              title="ویرایش محصول"
                            >
                              <Edit3 size={14} />
                              <span>ویرایش</span>
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(id)}
                              className={styles.deleteBtn}
                              title="حذف محصول"
                            >
                              <Trash2 size={14} />
                              <span>حذف</span>
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

        {/* Advanced Pagination */}
        {filteredProducts.length > pageSize && (
          <div className={styles.paginationContainer}>
            <span className={styles.paginationInfo}>
              نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, filteredProducts.length)} از {filteredProducts.length} محصول
            </span>

            <div className={styles.paginationButtons}>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageBtn}
                title="صفحه قبل"
              >
                <ChevronRight size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
                title="صفحه بعد"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingProduct ? 'ویرایش اطلاعات محصول' : 'ثبت محصول جدید در سامانه'}
                </h3>
                <p className={styles.modalDesc}>
                  مشخصات فنی، قیمت‌گذاری و تصویر محصول را بر اساس فیلدهای معتبر وب‌سرویس تنظیم نمایید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className={styles.modalContent}>
              <div className={styles.formGrid}>
                {/* Title */}
                <div className={`${styles.formGroup} ${styles.fullCol}`}>
                  <label className={styles.formLabel}>عنوان کامل محصول:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    placeholder="مثال: برنج کامفیروزی درجه یک ممتاز"
                    className={`${styles.formInput} ${formErrors.title ? styles.inputError : ''}`}
                    style={formErrors.title ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                  />
                  {formErrors.title && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                      {formErrors.title}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>قیمت فروش (تومان):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={e => handleFieldChange('price', e.target.value)}
                    placeholder="مثال: ۱۴۵۰۰۰۰"
                    className={`${styles.formInput} ${formErrors.price ? styles.inputError : ''}`}
                    style={formErrors.price ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                  />
                  {formErrors.price && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                      {formErrors.price}
                    </span>
                  )}
                </div>

                {/* Discount */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>درصد تخفیف (٪):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={e => handleFieldChange('discount', e.target.value)}
                    placeholder="۰"
                    className={styles.formInput}
                  />
                </div>

                {/* Stock Count */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تعداد موجودی انبار:</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => {
                      handleFieldChange('stock', e.target.value);
                      handleFieldChange('count', e.target.value);
                    }}
                    placeholder="۲۵"
                    className={`${styles.formInput} ${formErrors.stock ? styles.inputError : ''}`}
                    style={formErrors.stock ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                  />
                  {formErrors.stock && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                      {formErrors.stock}
                    </span>
                  )}
                </div>

                {/* Is Amazing (Special Deal) */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>پیشنهاد شگفت‌انگیز:</label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    cursor: 'pointer',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: '#fafbfc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '0.75rem',
                    minHeight: '42px',
                    boxSizing: 'border-box'
                  }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isAmazing)}
                      onChange={e => setFormData({ ...formData, isAmazing: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#073822' }}
                    />
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#042a1b' }}>
                      نمایش در تخفیف‌های ویژه
                    </span>
                  </label>
                </div>

                {/* Image Uploader */}
                <div className={`${styles.formGroup} ${styles.fullCol}`}>
                  <ImageUploader
                    label="تصویر محصول:"
                    value={formData.image}
                    onChange={imgUrl => setFormData({ ...formData, image: imgUrl })}
                    presets={RICE_SAMPLE_IMAGES}
                  />
                </div>

                {/* Description */}
                <div className={`${styles.formGroup} ${styles.fullCol}`}>
                  <label className={styles.formLabel}>توضیحات محصول:</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="توضیحات و مشخصات پخت، عطر و دانه‌بندی محصول..."
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? <Loader2 size={16} className="spin-animation" /> : <CheckCircle2 size={16} />}
                  <span>{editingProduct ? 'ذخیره تغییرات' : 'ثبت و انتشار محصول'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="تأیید حذف محصول"
        itemType="محصول"
        itemName={products.find(p => (p.id || p._id) === deleteConfirmId)?.title || products.find(p => (p.id || p._id) === deleteConfirmId)?.name || 'این محصول'}
        message="آیا از حذف این محصول از ویترین فروشگاه اطمینان دارید؟ اطلاعات محصول و سوابق آن پاک خواهند شد."
        confirmText="حذف قطعی محصول"
      />
    </div>
  );
}

export default ProductsTab;
