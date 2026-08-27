import React, { useState } from 'react';
import { useApp } from '../../context';
import { Plus, Trash2, Edit, BookOpen } from 'lucide-react';

export const BlogTab = () => {
  const { articles: posts, setArticles: setPosts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', excerpt: '', image: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      _id: `post_${Math.random().toString(36).substr(2, 9)}`,
      id: `post_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image || '/images/blog/blog-1.jpg',
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      author: 'مدیر سایت',
      category: 'مقالات'
    };
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setFormData({ title: '', excerpt: '', image: '', content: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('پست حذف شود؟')) return;
    setPosts(posts.filter(p => p._id !== id && p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">مدیریت وبلاگ</h1>
          <p className="text-slate-500 font-medium mt-1">انتشار و ویرایش مقالات در سایت</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-[1.25rem] text-sm font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
          <Plus size={20} strokeWidth={2.5} /> مقاله جدید
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200/60 p-20 flex flex-col items-center justify-center text-slate-400">
           <BookOpen size={64} className="mb-4 opacity-20" />
           <p className="font-bold text-lg">هیچ مقاله‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 group">
              <div className="h-52 bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-100">
                {post.image ? (
                  <img src={post.image.startsWith('http') ? post.image : `http://localhost:3000${post.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={40}/></div>
                )}
              </div>
              <div className="p-5 relative">
                <h3 className="font-black text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => handleDelete(post._id)} className="w-10 h-10 inline-flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shadow-sm">
                    <Trash2 size={18} strokeWidth={2.5}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 pb-4 shrink-0">
              <h3 className="font-black text-2xl text-slate-800 mb-2">نوشتن مقاله جدید</h3>
              <p className="text-slate-500 text-sm font-bold">اطلاعات محتوا را با دقت وارد کنید.</p>
            </div>
            
            <div className="p-8 pt-0 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">عنوان مقاله</label>
                  <input required type="text" placeholder="عنوان جذاب مقاله..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">لینک تصویر (URL)</label>
                  <input required type="text" placeholder="https://..." dir="ltr" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">خلاصه مقاله</label>
                  <textarea required placeholder="یک یا دو خط توضیح برای نمایش در کارت..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows="2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">متن اصلی مقاله</label>
                  <textarea required placeholder="شروع به نوشتن کنید..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="6" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"></textarea>
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black transition-colors">انصراف</button>
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all">انتشار مقاله</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
