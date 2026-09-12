import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { Filter, SlidersHorizontal, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { ProductCard } from '../components/productCard';
import styles from './pages.module.css';

export default function Catalog() {
  const { products, categories, selectedCategory, setSelectedCategory } = useApp();
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, rating
  const [activeWeightFilter, setActiveWeightFilter] = useState('all'); // all, 10, 5

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...(products || [])];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory || p.categoryId === selectedCategory);
    }

    // Filter by Weight
    if (activeWeightFilter !== 'all') {
      list = list.filter((p) => p.weight?.includes(activeWeightFilter) || p.name.includes(`${activeWeightFilter} کیلو`));
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, selectedCategory, activeWeightFilter, sortBy]);

  return (
    <main className={styles.pageContainer}>
      {/* هدر کاتالوگ */}
      <header className={styles.catalogHeader}>
        <div className={styles.catalogHeaderInfo}>
          <div className={styles.catalogBadge}>
            <Sparkles size={13} className="text-yellow-400" />
            <span>محصولات اصیل شالیزار کامفیروز</span>
          </div>
          <h1 className={styles.catalogMainTitle}>ویترین محصولات طلا رایس</h1>
          <p className={styles.catalogMainSubtitle}>
            ارقام برنج درجه یک، کاملاً بوجار و پاک شده در کیسه‌های نخی سنتی با ضمانت پخت
          </p>
        </div>
      </header>

      {/* بنر تضمین کیفیت */}
      <section className={styles.guaranteeBanner}>
        <ShieldCheck size={24} className={styles.guaranteeIcon} />
        <div>
          <strong className={styles.guaranteeTitle}>ضمانت بی‌قید و شرط پخت و عطر</strong>
          <p className={styles.guaranteeText}>
            در صورت عدم رضایت از عطر یا ری‌دهی، مرجوعی بدون کسر هزینه تا ۷ روز پذیرفته می‌شود.
          </p>
        </div>
      </section>

      {/* دسته‌بندی‌های کاتالوگ */}
      <div className={styles.filterSection}>
        <div className={styles.categoryPillsScroll}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`${styles.filterPill} ${(!selectedCategory || selectedCategory === 'all') ? styles.filterPillActive : ''}`}
          >
            همه ارقام
          </button>
          {categories
            ?.filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.filterPillActive : ''}`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {/* فیلتر سریع وزن و مرتب‌سازی */}
        <div className={styles.sortBar}>
          <div className={styles.sortOptions}>
            <SlidersHorizontal size={14} className="text-yellow-500" />
            <span className={styles.sortLabel}>مرتب‌سازی:</span>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortBy === 'popular' ? styles.sortBtnActive : ''}`}
              onClick={() => setSortBy('popular')}
            >
              محبوب‌ترین
            </button>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortBy === 'price-asc' ? styles.sortBtnActive : ''}`}
              onClick={() => setSortBy('price-asc')}
            >
              ارزان‌ترین
            </button>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortBy === 'price-desc' ? styles.sortBtnActive : ''}`}
              onClick={() => setSortBy('price-desc')}
            >
              گران‌ترین
            </button>
          </div>

          <span className={styles.productCountBadge}>
            {filteredAndSortedProducts.length.toLocaleString('fa-IR')} محصول
          </span>
        </div>
      </div>

      {/* لیست محصولات */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className={styles.emptyCatalog}>
          <p>
            {products && products.length === 0
              ? 'در حال حاضر هیچ محصولی ثبت نشده است.'
              : 'محصولی با این مشخصات یافت نشد.'}
          </p>
          {products && products.length > 0 && (
            <button
              type="button"
              className={styles.resetFilterBtn}
              onClick={() => {
                setSelectedCategory('all');
                setActiveWeightFilter('all');
              }}
            >
              مشاهده همه محصولات
            </button>
          )}
        </div>
      ) : (
        <section className={styles.productGrid}>
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

export { Catalog };
