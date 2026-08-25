import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Plus, Trash2, Edit3, Link as LinkIcon, 
  Sparkles, RefreshCw, Upload, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import { useApp } from '../../context';
import API from '../../services/api';

export const SlidersTab = ({ onUpdate, showToast }) => {
  const { heroSlides, setHeroSlides } = useApp();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '/catalog',
    order: 1
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await API.sliders.getAll();
      const rawList = Array.isArray(res) 
        ? res 
        : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.slides) ? res.slides : []));
      
      const mapped = rawList.map(s => ({
        id: s._id || s.id,
        _id: s._id || s.id,
        title: s.title || '',
        subtitle: s.subtitle || '',
        image: s.image || s.imageUrl || '',
        link: s.link || '/catalog',
        order: s.order || 1
      }));
      setSlides(mapped);
      setHeroSlides(mapped);
    } catch (err) {
      console.error('Failed to load slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '/catalog',
      order: (slides.length || 0) + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image: slide.image || '',
      link: slide.link || '/catalog',
      order: slide.order || 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      showToast?.('لطفاً آدرس تصویر اسلاید را وارد نمایید', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingSlide) {
        await API.sliders.update(editingSlide.id || editingSlide._id, formData);
        showToast?.('اسلایدر با موفقیت بروزرسانی شد', 'success');
      } else {
        await API.sliders.create(formData);
        showToast?.('اسلایدر جدید با موفقیت ایجاد شد', 'success');
      }
      setIsModalOpen(false);
      await fetchSlides();
      onUpdate?.();
    } catch (err) {
      showToast?.(err.message || 'خطا در ذخیره‌سازی اسلایدر', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;
    try {
      await API.sliders.delete(slideId);
      showToast?.('اسلاید با موفقیت حذف شد', 'success');
      await fetchSlides();
      onUpdate?.();
    } catch (err) {
      showToast?.(err.message || 'خطا در حذف اسلاید', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <ImageIcon className="text-[#d4af37]" />
            <span>مدیریت اسلایدر و بنرهای صفحه اصلی</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            اسلایدهای دلخواه خود را اضافه کنید. در صورت خالی بودن، هیچ اسلاید فرضی یا تستی نمایش داده نمی‌شود.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlides}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>بروزرسانی</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#042a1b] text-[#d4af37] hover:bg-[#063b26] rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#042a1b]/10 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>افزودن اسلاید جدید</span>
          </button>
        </div>
      </div>

      {/* Slide List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
          <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-[#d4af37]" />
          <p className="text-sm font-medium">در حال دریافت لیست اسلایدها از سرور...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">هیچ اسلایدی تعریف نشده است</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            داده‌های پیش‌فرض فرانت‌اند حذف شده‌اند. برای نمایش اسلایدر در صفحه اصلی، اولین اسلاید را با دکمه زیر ایجاد کنید.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-[#042a1b] text-white rounded-2xl font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>ایجاد اولین اسلاید</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id || slide._id || idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h4 className="font-bold text-base">{slide.title || 'بدون عنوان'}</h4>
                    <p className="text-xs text-white/80 line-clamp-1">{slide.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <LinkIcon size={14} className="text-[#d4af37]" />
                  <span className="font-mono">{slide.link || '/catalog'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-slate-600 hover:text-[#042a1b] hover:bg-slate-100 rounded-xl transition-colors"
                    title="ویرایش"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id || slide._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="text-[#d4af37]" size={20} />
              <span>{editingSlide ? 'ویرایش اسلایدر' : 'افزودن اسلایدر جدید'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان اصلی اسلاید</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: برنج طارم هاشمی درجه یک"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">توضیح کوتاه / زیرعنوان</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="مثال: عرضه مستقیم و بدون واسطه از شالیزارهای گیلان"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">آدرس اینترنتی تصویر اسلاید (URL)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... یا /images/banner.jpg"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#d4af37] outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">لینک مقصد دکمه خرید</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/catalog یا آدرس محصول"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#d4af37] outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#042a1b] text-[#d4af37] text-xs font-bold hover:bg-[#063b26] flex items-center gap-2"
                >
                  {saving && <RefreshCw size={14} className="animate-spin" />}
                  <span>{editingSlide ? 'ذخیره تغییرات' : 'ثبت اسلاید'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidersTab;
