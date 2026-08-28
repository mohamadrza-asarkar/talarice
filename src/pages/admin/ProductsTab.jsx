import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Search, PackageOpen, Edit3, X, Filter, CheckCircle2 } from 'lucide-react';
import styles from './style.module.css';

export function ProductsTab() {
  const { products, setProducts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const initialFormState = {
    name: '',
    price: '',
    oldPrice: '',
    stock: '',
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
      name: product.name || '',
      price: product.price ? String(product.price) : '',
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      stock: product.stock !== undefined ? String(product.stock) : '20',
      origin: product.origin || 'کامفیروز، استان فارس',
      image: typeof product.image === 'string' ? product.image : '',
      description: product.description || '',
      farmer: product.farmer || 'شالیکاران کامفیروز'
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const priceNum = Number(formData.price);
    const oldPriceNum = formData.oldPrice ? Number(formData.oldPrice) : Math.round(priceNum * 1.12);
    const stockNum = Number(formData.stock);

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map(function (p) {
        if (p._id === editingProduct._id || p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.name,
            price: priceNum,
            oldPrice: oldPriceNum,
            discountPercent: Math.max(0, Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)),
            stock: stockNum,
            inStock: stockNum > 0,
            origin: formData.origin,
            image: formData.image || p.image || '/images/products/hashemi.jpg',
            description: formData.description,
            farmer: formData.farmer
          };
        }
        return p;
      });
      setProducts(updatedProducts);
    } else {
      // Create new product
      const newId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const newProduct = {
        _id: newId,
        id: newId,
        name: formData.name,
        price: priceNum,
        oldPrice: oldPriceNum,
        discountPercent: Math.max(0, Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)),
        stock: stockNum,
        inStock: stockNum > 0,
        origin: formData.origin,
        image: formData.image || '/images/products/hashemi.jpg',
        description: formData.description,
        farmer: formData.farmer,
        features: ['۱۰۰٪ خالص و اصیل', 'کیسه نخی سفید اعلا', 'سورت لیزری'],
        rating: 5,
        reviewCount: 1,
        isFeatured: true,
        isDeal: false
      };
      setProducts([newProduct, ...products]);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  }

  function handleDelete(id) {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return;
    setProducts(products.filter(function (p) { return p._id !== id && p.id !== id; }));
  }

  // Filter products
  const filteredProducts = products.filter(function (p) {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.origin?.toLowerCase().includes(search.toLowerCase());

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'inStock' && (p.stock || 0) > 0) ||
      (stockFilter === 'outOfStock' && (p.stock || 0) <= 0);

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
                    const stock = p.stock ?? 0;
                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Product info */}
                        <td className={styles.td}>
                          <div className={styles.productCell}>
                            <div className={styles.productThumb}>
                              <img
                                src={p.image || '/images/products/hashemi.jpg'}
                                alt={p.name}
                                onError={function (e) {
                                  e.target.onerror = null;
                                  e.target.src = '/images/products/hashemi.jpg';
                                }}
                              />
                            </div>
                            <div>
                              <div className={styles.productName}>{p.name}</div>
                              <div className={styles.productTag}>
                                {p.origin || 'کامفیروز، استان فارس'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className={styles.td}>
                          <span
                            className={`${styles.stockBadge} ${
                              stock > 15
                                ? styles.stockHigh
                                : stock > 0
                                ? styles.stockLow
                                : styles.stockOut
                            }`}
                          >
                            {stock > 0 ? `${stock} کیسه` : 'ناموجود'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className={styles.td}>
                          <div>
                            <span className={styles.priceText}>
                              {(p.price || 0).toLocaleString()}
                            </span>{' '}
                            <span className={styles.currency}>تومان</span>
                          </div>
                          {p.oldPrice && p.oldPrice > p.price && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginTop: '0.125rem' }}>
                              {p.oldPrice.toLocaleString()} تومان
                            </div>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div className={styles.actionBtnGroup}>
                            <button
                              onClick={function () { openEditModal(p); }}
                              className={styles.editBtn}
                              title="ویرایش مشخصات و قیمت"
                            >
                              <Edit3 size={16} strokeWidth={2.2} />
                            </button>
                            <button
                              onClick={function () { handleDelete(id); }}
                              className={styles.deleteBtn}
                              title="حذف از انبار"
                            >
                              <Trash2 size={16} strokeWidth={2.2} />
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={function () { setIsModalOpen(false); }}>
          <div className={styles.modalBox} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingProduct ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید به انبار'}
                </h3>
                <p className={styles.modalDesc}>
                  {editingProduct
                    ? `در حال ویرایش: ${editingProduct.name}`
                    : 'مشخصات برنج، شالیزار و قیمت را وارد کنید.'}
                </p>
              </div>
              <button
                type="button"
                onClick={function () { setIsModalOpen(false); }}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>نام کامل محصول</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: برنج کامفیروزی اعلا کشت اول طلا رایس"
                      value={formData.name}
                      onChange={function (e) { setFormData({ ...formData, name: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>محل کشت و شالیزار</label>
                    <input
                      type="text"
                      placeholder="مثال: کامفیروز مرودشت، استان فارس"
                      value={formData.origin}
                      onChange={function (e) { setFormData({ ...formData, origin: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>نام شالیکار / تولیدکننده</label>
                    <input
                      type="text"
                      placeholder="مثال: شالیکاران نمونه حوزه رود کُر"
                      value={formData.farmer}
                      onChange={function (e) { setFormData({ ...formData, farmer: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>قیمت نهایی فروش (تومان)</label>
                    <input
                      required
                      type="number"
                      placeholder="مثال: 1450000"
                      value={formData.price}
                      onChange={function (e) { setFormData({ ...formData, price: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>قیمت قبل از تخفیف (اختیاری)</label>
                    <input
                      type="number"
                      placeholder="مثال: 1650000"
                      value={formData.oldPrice}
                      onChange={function (e) { setFormData({ ...formData, oldPrice: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>موجودی انبار (تعداد کیسه)</label>
                    <input
                      required
                      type="number"
                      placeholder="مثال: 30"
                      value={formData.stock}
                      onChange={function (e) { setFormData({ ...formData, stock: e.target.value }); }}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>آدرس اینترنتی عکس محصول (URL)</label>
                    <input
                      type="text"
                      placeholder="https://... یا خالی برای تصویر پیش‌فرض"
                      value={formData.image}
                      onChange={function (e) { setFormData({ ...formData, image: e.target.value }); }}
                      dir="ltr"
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>توضیحات و مشخصات پخت</label>
                    <textarea
                      placeholder="توضیحاتی درباره عطر، قد کشیدن، و نحوه پخت این برنج بنویسید..."
                      value={formData.description}
                      onChange={function (e) { setFormData({ ...formData, description: e.target.value }); }}
                      rows="3"
                      className={styles.textarea}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={function () { setIsModalOpen(false); }}
                    className={styles.cancelBtn}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {editingProduct ? 'ذخیره تغییرات محصول' : 'ثبت و انتشار محصول در فروشگاه'}
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
