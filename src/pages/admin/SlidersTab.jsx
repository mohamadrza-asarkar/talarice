import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export const SlidersTab = () => {
  const { heroSlides: sliders, setHeroSlides: setSliders } = useApp();
  const [formData, setFormData] = useState({ title: '', image: '', isActive: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSlider = {
      _id: `slide_${Math.random().toString(36).substr(2, 9)}`,
      id: `slide_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      image: formData.image || '/images/slides/slide-1.jpg',
      link: '/products'
    };
    setSliders([newSlider, ...sliders]);
    setIsModalOpen(false);
    setFormData({ title: '', image: '', isActive: true });
  };

  const handleDelete = (id) => {
    if (!window.confirm('حذف شود؟')) return;
    setSliders(sliders.filter(s => s._id !== id && s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">ویترین و اسلایدرها</h1>
          <p className="text-slate-500 font-medium mt-1">مدیریت بنرهای نمایشی در صفحه اصلی سایت</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-[1.25rem] text-sm font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
          <Plus size={20} strokeWidth={2.5} /> افزودن بنر جدید
        </button>
      </div>

      {sliders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200/60 p-20 flex flex-col items-center justify-center text-slate-400">
           <ImageIcon size={64} className="mb-4 opacity-20" />
           <p className="font-bold text-lg">هیچ بنری تنظیم نشده است</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map(s => (
            <div key={s._id} className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
              <div className="h-48 bg-slate-100 rounded-[1.5rem] overflow-hidden relative border border-slate-100">
                {s.image ? (
                  <img src={s.image.startsWith('http') ? s.image : `http://localhost:3000${s.image}`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40}/></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <button onClick={() => handleDelete(s._id)} className="bg-white/20 backdrop-blur-md text-white hover:bg-rose-500 p-2.5 rounded-xl transition-colors shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="px-4 py-4">
                <h3 className="font-black text-slate-800 text-base line-clamp-1">{s.title || 'بنر بدون عنوان'}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <h3 className="font-black text-2xl text-slate-800 mb-2">ثبت بنر جدید</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">آدرس تصویر را وارد کنید.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">عنوان بنر</label>
                  <input required type="text" placeholder="مثال: جشنواره پاییزه" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">لینک تصویر (URL)</label>
                  <input required type="text" placeholder="https://..." dir="ltr" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black transition-colors">انصراف</button>
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all">ثبت بنر</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
