import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Plus, Trash2, Image as ImageIcon, Upload, 
  ExternalLink, Sparkles, RefreshCw, Layers 
} from 'lucide-react';

export const SlidersTab = ({ onUpdate, showToast }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: 'عرضه مستقیم از شالیزار',
    image: '',
    link: '/catalog'
  });

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await API.get('/slides').catch(() => API.get('/sliders'));
      if (res.success && res.data) {
        setSlides(res.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

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
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        uploadData.append('title', formData.title);
        uploadData.append('subtitle', formData.subtitle);
        uploadData.append('link', formData.link);

        const res = await fetch('/api/slides', {
          method: 'POST',
          body: uploadData
        });
        const json = await res.json();
        if (json.success) {
          if (showToast) showToast('بنر اسلایدر با موفقیت آپلود و ذخیره شد');
        }
      } else {
        await API.post('/slides', formData);
        if (showToast) showToast('بنر اسلایدر با موفقیت اضافه شد');
      }

      fetchSlides();
      if (onUpdate) onUpdate();
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview('');
      setFormData({ title: '', subtitle: 'عرضه مستقیم از شالیزار', image: '', link: '/catalog' });
    } catch (err) {
      alert('خطا در ثبت اسلایدر');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این بنر اسلایدر اطمینان دارید؟')) return;
    try {
      await API.delete(`/slides/${id}`).catch(() => API.delete(`/sliders/${id}`));
      if (showToast) showToast('اسلاید حذف شد');
      fetchSlides();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('خطا در حذف اسلاید');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مدیریت بنرهای اسلایدر صفحه اصلی</h1>
            <span className="bg-[#042a1b] text-[#d4af37] text-xs font-black px-2.5 py-1 rounded-xl">
              {slides.length} بنر
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1">تصاویر جشنواره‌ها، تخفیف‌های ویژه و بنرهای اصلی هدر وبسایت</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchSlides}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
            title="بروزرسانی"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex-1 sm:flex-none bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus size={19} strokeWidth={3} />
            <span>افزودن بنر اسلاید جدید</span>
          </button>
        </div>
      </div>

      {/* Grid of Sliders */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#042a1b] rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-sm">درحال دریافت لیست اسلایدرها...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
            <ImageIcon size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-black text-lg text-slate-700">هیچ اسلایدری تعریف نشده است</h3>
          <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-6">
            با افزودن بنر جدید، تصاویر زیبا و جشنواره‌های فروش در بالای صفحه اصلی سایت به نمایش در می‌آیند.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2"
          >
            <Plus size={16} />
            افزودن اولین اسلایدر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map(slide => (
            <div key={slide._id || slide.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-none flex flex-col justify-between group hover:border-[#d4af37] transition-all">
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[11px] font-bold text-[#d4af37] mb-1">{slide.subtitle || 'پیشنهاد ویژه'}</span>
                  <h3 className="font-black text-white text-base">{slide.title}</h3>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ExternalLink size={14} className="text-slate-400" />
                  <span>لینک: {slide.link || '/catalog'}</span>
                </div>

                <button 
                  onClick={() => handleDelete(slide._id || slide.id)} 
                  className="p-2.5 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 transition-colors"
                  title="حذف اسلاید"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-slate-200 overflow-hidden shadow-2xl p-6 md:p-8 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-black text-xl text-slate-800">افزودن بنر اسلایدر جدید</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">تصویر شاخص و متن معرفی را وارد نمایید</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">عنوان اصلی بنر</label>
                <input 
                  required 
                  type="text" 
                  placeholder="مثال: جشنواره برداشت برنج تازه ۱۴۰۳ با تخفیف ویژه" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">زیرعنوان بنر</label>
                <input 
                  type="text" 
                  placeholder="مثال: ارسال رایگان و تضمین اصالت و پخت" 
                  value={formData.subtitle} 
                  onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">لینک مقصد هنگام کلیک کاربر</label>
                <input 
                  type="text" 
                  placeholder="مثال: /catalog یا /products" 
                  value={formData.link} 
                  onChange={e => setFormData({...formData, link: e.target.value})} 
                  dir="ltr"
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              {/* Upload Image */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700">تصویر اسلایدر</label>
                <div className="border border-dashed border-slate-300 hover:border-[#d4af37] rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-slate-50/60 transition-colors">
                  <Upload size={24} className="text-[#042a1b] mb-1.5" />
                  <span className="text-xs font-bold text-slate-700">انتخاب تصویر بنر (افقی و عریض)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="mt-2 text-xs text-slate-500 file:mr-0 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#042a1b] file:text-[#d4af37] cursor-pointer" 
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="یا درج لینک تصویر اینترنتی (https://...)" 
                  value={formData.image} 
                  onChange={e => {
                    setFormData({...formData, image: e.target.value});
                    if (!imageFile) setImagePreview(e.target.value);
                  }} 
                  dir="ltr" 
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />

                {imagePreview && (
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 mt-2">
                    <img src={imagePreview} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

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
                  className="flex-1 bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] p-3.5 rounded-2xl font-black text-xs transition-colors"
                >
                  ذخیره و انتشار بنر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
