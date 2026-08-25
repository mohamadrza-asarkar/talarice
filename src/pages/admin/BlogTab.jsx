import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Plus, Trash2, BookOpen, RefreshCw, Upload, 
  Calendar, FileText, Sparkles 
} from 'lucide-react';

export const BlogTab = ({ onUpdate, showToast }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    excerpt: '', 
    image: '', 
    content: '' 
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts');
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

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
      if (imageFile) {
        try {
          const uploadRes = await API.upload.uploadImage(imageFile);
          if (uploadRes && (uploadRes.url || uploadRes.data?.url)) {
            finalImageUrl = uploadRes.url || uploadRes.data?.url;
          }
        } catch (uploadErr) {
          console.warn('Upload error:', uploadErr);
        }
      }

      await API.blog.create({
        ...formData,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'
      });
      if (showToast) showToast('مقاله آموزشی با موفقیت منتشر شد');
      fetchPosts();
      if (onUpdate) onUpdate();
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview('');
      setFormData({ title: '', excerpt: '', image: '', content: '' });
    } catch { alert('خطا در ثبت مقاله'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`آیا از حذف مقاله «${title || 'انتخاب شده'}» اطمینان دارید؟`)) return;
    try {
      await API.delete(`/posts/${id}`);
      if (showToast) showToast('مقاله حذف شد');
      fetchPosts();
      if (onUpdate) onUpdate();
    } catch { }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مدیریت مقالات و وبلاگ آموزشی</h1>
            <span className="bg-[#042a1b] text-[#d4af37] text-xs font-black px-2.5 py-1 rounded-xl">
              {posts.length} مقاله
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1">نکات تشخیص برنج اصل، دستورهای پخت مجلسی، راهنمای نگهداری و شالیزارها</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchPosts}
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
            <span>نگارش مقاله جدید</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#042a1b] rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-sm">درحال بارگذاری مقالات...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
            <BookOpen size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-black text-lg text-slate-700">هنوز مقاله‌ای منتشر نشده است</h3>
          <p className="text-xs text-slate-400 font-medium max-w-sm mt-1 mb-6">
            با انتشار مقالات و راهنماهای کاربردی، به خریداران در انتخاب و پخت برنج اعلا کمک کنید.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2"
          >
            <Plus size={16} />
            نگارش اولین مقاله
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post._id || post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-none hover:border-[#d4af37] transition-all flex flex-col justify-between group">
              <div>
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  {post.image ? (
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={40}/></div>
                  )}
                  {post.createdAt && (
                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      {post.createdAt}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-800 text-sm mb-2 line-clamp-1 group-hover:text-[#042a1b] transition-colors">{post.title}</h3>
                  <p className="text-xs font-medium text-slate-400 line-clamp-2 leading-relaxed">{post.excerpt || 'بدون خلاصه'}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => handleDelete(post._id || post.id, post.title)} 
                  className="p-2.5 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 transition-colors"
                  title="حذف مقاله"
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
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 overflow-hidden shadow-2xl p-6 md:p-8 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-black text-xl text-slate-800">نگارش مقاله و آموزش جدید</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">عنوان، تصویر شاخص و متن کامل مقاله را وارد نمایید</p>
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
                <label className="text-xs font-bold text-slate-700">عنوان مقاله</label>
                <input 
                  required 
                  type="text" 
                  placeholder="مثال: ۵ روش ساده برای تشخیص برنج طارم اصل از تقلبی" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              {/* Upload image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">تصویر شاخص مقاله</label>
                <div className="border border-dashed border-slate-300 hover:border-[#d4af37] rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/60 transition-colors">
                  <Upload size={20} className="text-[#042a1b] mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">انتخاب تصویر از دستگاه</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="mt-2 text-[10px] text-slate-500 file:mr-0 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#042a1b] file:text-[#d4af37] cursor-pointer" 
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="یا لینک تصویر اینترنتی (https://...)" 
                  value={formData.image} 
                  onChange={e => {
                    setFormData({...formData, image: e.target.value});
                    if (!imageFile) setImagePreview(e.target.value);
                  }} 
                  dir="ltr" 
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">خلاصه کوتاه مقاله</label>
                <textarea 
                  required 
                  placeholder="چکیده کوتاه یک یا دو خطی درباره نکات مهم پخت و ری‌کشی..." 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  rows="2" 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">متن کامل مقاله</label>
                <textarea 
                  required 
                  placeholder="متن کامل و بندهای آموزشی مقاله را در اینجا بنویسید..." 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  rows="5" 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors resize-none"
                ></textarea>
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
                  انتشار مقاله
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
