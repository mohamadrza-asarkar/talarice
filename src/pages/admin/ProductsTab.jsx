import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Plus, Trash2, Search, PackageOpen, Upload, CheckCircle2, 
  XCircle, Star, MessageSquare, Edit3, Layers, Filter, 
  ArrowUpDown, Eye, Image as ImageIcon, Sparkles, RefreshCw,
  TrendingUp, AlertTriangle, LayoutGrid, List
} from 'lucide-react';

export const ProductsTab = ({ onUpdate, showToast }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [reviewsModalProduct, setReviewsModalProduct] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'outOfStock'
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    countInStock: '20',
    category: 'برنج اعلا',
    origin: '',
    weight: '10',
    image: '',
    isAvailable: true,
    description: '',
    cookingTime: '۳۰ دقیقه',
    smellLevel: 'فوق‌العاده عالی',
    grainType: 'دانه بلند مجلسی'
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      price: '',
      countInStock: '20',
      category: 'برنج اعلا',
      origin: 'گیلان، آستانه اشرفیه',
      weight: '10',
      image: '',
      isAvailable: true,
      description: '',
      cookingTime: '۳۰ دقیقه',
      smellLevel: 'فوق‌العاده عالی',
      grainType: 'دانه بلند مجلسی'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setImageFile(null);
    setImagePreview(prod.image || '');
    setFormData({
      name: prod.name || '',
      price: prod.price || '',
      countInStock: prod.countInStock !== undefined ? prod.countInStock : (prod.stock || 0),
      category: prod.category || 'برنج اعلا',
      origin: prod.origin || '',
      weight: prod.weight || '10',
      image: prod.image || '',
      isAvailable: prod.isAvailable !== false,
      description: prod.description || '',
      cookingTime: prod.cookingTime || '۳۰ دقیقه',
      smellLevel: prod.smellLevel || 'فوق‌العاده عالی',
      grainType: prod.grainType || 'دانه بلند مجلسی'
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.image;
      
      // If a file was selected, upload via Multer endpoint
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const json = await res.json();
        if (json.success) {
          finalImageUrl = json.url;
        }
      }

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        stock: Number(formData.countInStock),
        category: formData.category,
        origin: formData.origin,
        weight: Number(formData.weight || 10),
        isAvailable: Number(formData.countInStock) > 0 && Boolean(formData.isAvailable),
        description: formData.description,
        cookingTime: formData.cookingTime,
        smellLevel: formData.smellLevel,
        grainType: formData.grainType,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id || editingProduct.id}`, payload);
        if (showToast) showToast('محصول با موفقیت ویرایش شد');
      } else {
        await API.post('/products', payload);
        if (showToast) showToast('محصول جدید با موفقیت به انبار افزوده شد');
      }

      fetchProducts();
      if (onUpdate) onUpdate();
      setIsModalOpen(false);
    } catch (err) {
      alert('خطا در ذخیره‌سازی محصول');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`آیا از حذف محصول «${name || 'انتخاب شده'}» اطمینان دارید؟`)) return;
    try {
      await API.delete(`/products/${id}`);
      if (showToast) showToast('محصول از انبار حذف شد');
      fetchProducts();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('خطا در حذف محصول');
    }
  };

  // Quick adjust inventory (+1 / -1) directly from table/grid
  const handleQuickStock = async (prod, delta) => {
    const currentStock = prod.countInStock !== undefined ? prod.countInStock : (prod.stock || 0);
    const newStock = Math.max(0, currentStock + delta);
    try {
      await API.put(`/products/${prod._id || prod.id}`, {
        countInStock: newStock,
        stock: newStock,
        isAvailable: newStock > 0
      });
      fetchProducts();
      if (onUpdate) onUpdate();
    } catch (e) {
      console.warn(e);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.origin && p.origin.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    const currentStock = p.countInStock !== undefined ? p.countInStock : (p.stock || 0);
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'inStock' && currentStock > 0 && p.isAvailable !== false) ||
      (stockFilter === 'outOfStock' && (currentStock === 0 || p.isAvailable === false));

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'stock-desc') return (b.countInStock || b.stock || 0) - (a.countInStock || a.stock || 0);
    return 0; // Default order
  });

  // Calculate Quick Stats
  const inStockCount = products.filter(p => (p.countInStock || p.stock || 0) > 0).length;
  const outOfStockCount = products.length - inStockCount;
  const categoriesList = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Header Title & Primary Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مدیریت محصولات و انبار</h1>
            <span className="bg-[#042a1b] text-[#d4af37] text-xs font-black px-2.5 py-1 rounded-xl">
              {products.length} کالا
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1">کنترل قیمت‌گذاری، تعداد موجودی هر کیسه، تصویر و مشخصات کیفی برنج</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchProducts}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
            title="بروزرسانی لیست"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={openAddModal} 
            className="flex-1 sm:flex-none bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus size={19} strokeWidth={3} />
            <span>افزودن محصول جدید</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">کل محصولات</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{products.length} <span className="text-xs font-normal text-slate-400">قلم کالا</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">موجود در انبار</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{inStockCount} <span className="text-xs font-normal text-emerald-600 font-bold">آماده فروش</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">اتمام موجودی</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{outOfStockCount} <span className="text-xs font-normal text-rose-500 font-bold">ناموجود</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Filter size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">تنوع دسته‌ها</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{categoriesList.length || 1} <span className="text-xs font-normal text-slate-400">دسته‌بندی</span></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-none overflow-hidden">
        {/* Toolbar with Filters, Search & View Switcher */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50/50">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو در نام برنج، مبدأ، توضیحات یا دسته..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-11 pl-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & View Modes */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#d4af37]"
            >
              <option value="all">همه دسته‌ها</option>
              <option value="برنج اعلا">برنج اعلا</option>
              <option value="نیم دانه برنج">نیم دانه</option>
              <option value="ریز دانه برنج (لاشه)">ریز دانه و سرلاشه</option>
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#d4af37]"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="inStock">فقط موجودها</option>
              <option value="outOfStock">ناموجودها</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#d4af37]"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="stock-desc">بیشترین موجودی</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-[#042a1b] shadow-sm' : 'text-slate-500'}`}
                title="نمایش جدولی"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-[#042a1b] shadow-sm' : 'text-slate-500'}`}
                title="نمایش کارتی"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#042a1b] rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm">درحال بارگذاری اطلاعات محصولات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                <PackageOpen size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-black text-lg text-slate-700">هیچ محصولی یافت نشد</h3>
              <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-6">
                هنوز کالایی در انبار ثبت نشده است یا با فیلترهای انتخابی شما مطابقت ندارد.
              </p>
              <button
                onClick={openAddModal}
                className="bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2"
              >
                <Plus size={16} />
                افزودن اولین محصول برنج
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 pb-3">
                    <th className="pb-4 font-bold">مشخصات و تصویر</th>
                    <th className="pb-4 font-bold">دسته‌بندی</th>
                    <th className="pb-4 font-bold">موجودی انبار (کیسه)</th>
                    <th className="pb-4 font-bold">قیمت واحد</th>
                    <th className="pb-4 font-bold">دیدگاه‌ها</th>
                    <th className="pb-4 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map(p => {
                    const stock = p.countInStock !== undefined ? p.countInStock : (p.stock || 0);
                    return (
                      <tr key={p._id || p.id} className="group hover:bg-slate-50/70 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 flex-shrink-0">
                              <img 
                                src={p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-sm group-hover:text-[#042a1b] transition-colors">{p.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {p.origin && (
                                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    📍 {p.origin}
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-medium">
                                  وزن: {p.weight || 10} کیلوگرم
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-2.5 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700">
                            {p.category || 'برنج اعلا'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                              <button 
                                onClick={() => handleQuickStock(p, -1)}
                                className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                                title="کاهش یک عدد"
                              >
                                -
                              </button>
                              <span className={`px-2 font-black ${stock > 5 ? 'text-slate-800' : stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {stock}
                              </span>
                              <button 
                                onClick={() => handleQuickStock(p, 1)}
                                className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                                title="افزایش یک عدد"
                              >
                                +
                              </button>
                            </div>
                            {stock > 0 && p.isAvailable !== false ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 size={13} /> موجود
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center gap-1">
                                <XCircle size={13} /> ناموجود
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-black text-slate-800 text-sm">
                            {p.price?.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">تومان</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => setReviewsModalProduct(p)}
                            className="flex items-center gap-1 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors"
                          >
                            <MessageSquare size={13} />
                            <span>{p.reviews?.length || 0}</span>
                          </button>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => openEditModal(p)} 
                              className="p-2 text-slate-600 hover:text-[#042a1b] hover:bg-slate-100 rounded-xl transition-colors"
                              title="ویرایش محصول"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id || p.id, p.name)} 
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                              title="حذف محصول"
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
          ) : (
            /* Grid Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map(p => {
                const stock = p.countInStock !== undefined ? p.countInStock : (p.stock || 0);
                return (
                  <div key={p._id || p.id} className="bg-slate-50/70 border border-slate-200 rounded-3xl p-4 flex flex-col justify-between hover:border-[#d4af37] transition-all">
                    <div>
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-200 mb-3">
                        <img 
                          src={p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'} 
                          alt={p.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-800">
                          {p.category || 'برنج اعلا'}
                        </div>
                      </div>
                      <h3 className="font-black text-slate-800 text-sm line-clamp-1">{p.name}</h3>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{p.description || 'توضیحاتی ثبت نشده است'}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-800">{p.price?.toLocaleString()} تومان</div>
                        <div className="text-[10px] text-slate-400">موجودی: {stock} کیسه</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openEditModal(p)} 
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold"
                          title="ویرایش"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id || p.id, p.name)} 
                          className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 text-xs font-bold"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 overflow-hidden my-8 shadow-2xl">
            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-xl text-slate-800">
                    {editingProduct ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید برنج'}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium mt-1">مشخصات، قیمت، موجودی و تصویر را وارد نمایید</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">نام و عنوان محصول (الزامی)</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="مثال: برنج طارم هاشمی درجه یک گیلان (کیسه ۱۰ کیلوگرمی)" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">دسته‌بندی محصول</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold focus:border-[#d4af37] outline-none transition-colors"
                    >
                      <option value="برنج اعلا">برنج اعلا (طارم، هاشمی، دمسیاه، کامفیروز)</option>
                      <option value="نیم دانه برنج">نیم دانه برنج معطر</option>
                      <option value="ریز دانه برنج (لاشه)">ریز دانه و سرلاشه</option>
                    </select>
                  </div>

                  {/* Origin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">منطقه کشت / مبدا</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="مثال: گیلان، فریدونکنار یا شیراز کامفیروز" 
                      value={formData.origin} 
                      onChange={e => setFormData({...formData, origin: e.target.value})} 
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                    />
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">قیمت به تومان (الزامی)</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="مثال: 1350000" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                    />
                  </div>
                  
                  {/* Count in stock */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">تعداد موجودی در انبار (کیسه)</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="مثال: 25" 
                      value={formData.countInStock} 
                      onChange={e => setFormData({...formData, countInStock: e.target.value})} 
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                    />
                  </div>

                  {/* Image Upload & URL */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700">تصویر محصول (آپلود مستقیم یا لینک)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Upload box */}
                      <div className="border border-dashed border-slate-300 hover:border-[#d4af37] rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/60 transition-colors">
                        <Upload size={20} className="text-[#042a1b] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">انتخاب عکس از کامپیوتر یا گوشی</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="mt-2 text-[10px] text-slate-500 file:mr-0 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#042a1b] file:text-[#d4af37] cursor-pointer" 
                        />
                      </div>

                      {/* URL input */}
                      <div className="flex flex-col justify-center space-y-2">
                        <input 
                          type="text" 
                          placeholder="یا درج لینک تصویر (https://...)" 
                          value={formData.image} 
                          onChange={e => {
                            setFormData({...formData, image: e.target.value});
                            if (!imageFile) setImagePreview(e.target.value);
                          }} 
                          dir="ltr" 
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                        />
                        {imagePreview && (
                          <div className="flex items-center gap-2">
                            <img src={imagePreview} alt="پیش‌نمایش" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                            <span className="text-[11px] font-bold text-emerald-600">تصویر انتخاب شد</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">توضیحات پخت، عطر و خلوص</label>
                    <textarea 
                      placeholder="توضیحاتی پیرامون عطر، قد کشیدن پس از پخت، خلوص دانه‌ها..." 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      rows="3" 
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors"
                  >
                    انصراف
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] p-3.5 rounded-2xl font-black text-xs transition-colors shadow-sm"
                  >
                    {editingProduct ? 'ذخیره تغییرات محصول' : 'ثبت و انتشار محصول در انبار'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {reviewsModalProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-800">نظرات و بازخوردهای خریداران</h3>
                <p className="text-slate-400 text-xs font-medium">{reviewsModalProduct.name}</p>
              </div>
              <button 
                onClick={() => setReviewsModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {(!reviewsModalProduct.reviews || reviewsModalProduct.reviews.length === 0) ? (
                <p className="text-center text-slate-400 py-8 font-bold text-xs">دیدگاهی برای این کالا ثبت نشده است.</p>
              ) : (
                reviewsModalProduct.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-800">{rev.sender || 'کاربر'}</span>
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment || rev.text}</p>
                    {rev.date && <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>}
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setReviewsModalProduct(null)}
              className="w-full mt-4 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
