import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Search, PackageOpen } from 'lucide-react';
import styles from './style.module.css';

export const ProductsTab = () => {
  const { products, setProducts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: 'برنج', origin: '', image: '', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      _id: `prod_${Math.random().toString(36).substr(2, 9)}`,
      id: `prod_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      inStock: Number(formData.stock) > 0,
      category: formData.category,
      origin: formData.origin,
      image: formData.image || '/images/products/hashemi.jpg',
      description: formData.description,
      features: ['جدید'],
      rating: 5,
      reviewCount: 0
    };
    
    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setFormData({ name: '', price: '', stock: '', category: 'برنج', origin: '', image: '', description: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('محصول حذف شود؟')) return;
    setProducts(products.filter(p => p._id !== id && p.id !== id));
  };

  const filteredProducts = products.filter(p => p.name.includes(search));

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>محصولات انبار</h1>
          <p className={styles.tabSubtitle}>مدیریت و افزودن کالاهای جدید به فروشگاه</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={20} strokeWidth={2.5} /> محصول جدید
        </button>
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
           <div className={styles.searchBox}>
             <Search size={18} className={styles.searchIcon} />
             <input 
               type="text" 
               placeholder="جستجو در بین محصولات..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               className={styles.searchInput}
             />
           </div>
           <div className={styles.countBadge}>
             تعداد کل: <span className={styles.countNumber}>{products.length}</span>
           </div>
        </div>

        {/* Table/List */}
        <div className={styles.tableContainer}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <PackageOpen size={64} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ محصولی یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>مشخصات محصول</th>
                    <th className={styles.th}>موجودی</th>
                    <th className={styles.th}>قیمت مصرف‌کننده</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.productCell}>
                          <div className={styles.productThumb}>
                            {p.image && <img src={p.image.startsWith('http') ? p.image : `http://localhost:3000${p.image}`} alt={p.name} />}
                          </div>
                          <div>
                            <div className={styles.productName}>{p.name}</div>
                            <div className={styles.productTag}>{p.category} - {p.origin}</div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.stockBadge} ${p.stock > 10 ? styles.stockHigh : p.stock > 0 ? styles.stockLow : styles.stockOut}`}>
                          {p.stock} عدد
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.priceText}>{p.price.toLocaleString()}</span> <span className={styles.currency}>تومان</span>
                      </td>
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <button onClick={() => handleDelete(p._id)} className={styles.deleteBtn}>
                          <Trash2 size={18} strokeWidth={2.5}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>افزودن محصول جدید</h3>
              <p className={styles.modalDesc}>اطلاعات محصول را با دقت وارد کنید.</p>
            </div>
            
            <div className={styles.modalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>نام کامل محصول</label>
                    <input required type="text" placeholder="مثال: برنج طارم محلی فریدونکنار" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>قیمت فروش (تومان)</label>
                    <input required type="number" placeholder="1250000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>موجودی انبار (تعداد)</label>
                    <input required type="number" placeholder="25" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>محل کشت / مبدا</label>
                    <input required type="text" placeholder="مثال: کامفیروز" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>لینک تصویر (URL)</label>
                    <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} dir="ltr" className={styles.input} />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>توضیحات کوتاه</label>
                    <textarea placeholder="توضیح مختصری درباره کیفیت و عطر برنج..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className={styles.textarea}></textarea>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>انصراف</button>
                  <button type="submit" className={styles.submitBtn}>ثبت محصول در انبار</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
