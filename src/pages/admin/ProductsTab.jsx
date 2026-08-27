import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Search, PackageOpen } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">محصولات انبار</h1>
          <p className="text-slate-500 font-medium mt-1">مدیریت و افزودن کالاهای جدید به فروشگاه</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-[1.25rem] text-sm font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
          <Plus size={20} strokeWidth={2.5} /> محصول جدید
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50">
           <div className="relative w-full max-w-md">
             <Search size={18} className="absolute right-4 top-3.5 text-slate-400" />
             <input 
               type="text" 
               placeholder="جستجو در بین محصولات..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-semibold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
             />
           </div>
           <div className="text-sm font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             تعداد کل: <span className="text-emerald-600">{products.length}</span>
           </div>
        </div>

        {/* Table/List */}
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <PackageOpen size={64} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">هیچ محصولی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-100">
                    <th className="pb-4 font-bold">مشخصات محصول</th>
                    <th className="pb-4 font-bold">موجودی</th>
                    <th className="pb-4 font-bold">قیمت مصرف‌کننده</th>
                    <th className="pb-4 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map(p => (
                    <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
                            {p.image && <img src={p.image.startsWith('http') ? p.image : `http://localhost:3000${p.image}`} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <div className="font-black text-slate-800 text-base">{p.name}</div>
                            <div className="text-xs font-bold text-slate-500 mt-1 bg-slate-100 w-fit px-2 py-0.5 rounded-md">{p.category} - {p.origin}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                          {p.stock} عدد
                        </span>
                      </td>
                      <td className="py-4 font-black text-slate-700">
                        {p.price.toLocaleString()} <span className="text-xs text-slate-400 font-bold">تومان</span>
                      </td>
                      <td className="py-4 text-center">
                        <button onClick={() => handleDelete(p._id)} className="w-10 h-10 inline-flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <h3 className="font-black text-2xl text-slate-800 mb-2">افزودن محصول جدید</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">اطلاعات محصول را با دقت وارد کنید.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-600">نام کامل محصول</label>
                    <input required type="text" placeholder="مثال: برنج طارم محلی فریدونکنار" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">قیمت فروش (تومان)</label>
                    <input required type="number" placeholder="1250000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">موجودی انبار (تعداد)</label>
                    <input required type="number" placeholder="25" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">محل کشت / مبدا</label>
                    <input required type="text" placeholder="مثال: کامفیروز" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">لینک تصویر (URL)</label>
                    <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} dir="ltr" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-600">توضیحات کوتاه</label>
                    <textarea placeholder="توضیح مختصری درباره کیفیت و عطر برنج..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black transition-colors">انصراف</button>
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all">ثبت محصول در انبار</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
