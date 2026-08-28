import client from './client';

function parseArticle(a) {
  if (!a) return null;
  return {
    id: String(a.id || a._id || `art-${Date.now()}`),
    _id: String(a._id || a.id || `art-${Date.now()}`),
    title: a.title || 'دانشنامه تخصصی کشت برنج کامفیروز',
    summary: a.summary || 'مرجع اصیل آشنایی با مراحل کاشت، داشت و برداشت برنج معطر کامفیروز',
    content: a.content || 'توضیحات جامع و علمی درباره شالیزارهای کامفیروز...',
    image: a.image || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1000&q=80',
    readTime: a.readTime || '۶ دقیقه مطالعه',
    author: a.author || 'مهندس زارعی (کارشناس شالیکاری)',
    date: a.date || 'بهمن ۱۴۰۳',
    category: a.category || 'دانشنامه شالیکاری',
    comments: Array.isArray(a.comments) ? a.comments.map(c => ({
      id: c.id || `c-${Math.random()}`,
      name: c.name || 'کاربر گرامی',
      text: c.text || c.comment || '',
      date: c.date || 'امروز'
    })) : []
  };
}

export const blogApi = {
  /**
   * Fetch all blog & cultivation articles
   */
  async getArticles() {
    try {
      const response = await client.get('/articles');
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseArticle)
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت مقالات' };
    } catch (err) {
      console.error('[blogApi] Fetch articles error:', err.message || err);
      throw err;
    }
  },

  /**
   * Get single article details
   */
  async getArticleById(id) {
    try {
      const response = await client.get(`/articles/${id}`);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseArticle(response.data)
        };
      }
      return { success: false, data: null, message: 'مقاله مورد نظر پیدا نشد.' };
    } catch (err) {
      console.error(`[blogApi] Fetch article ${id} error:`, err.message || err);
      throw err;
    }
  },

  /**
   * Submit a user comment on an article
   */
  async addComment(articleId, commentData) {
    try {
      const response = await client.post(`/articles/${articleId}/comments`, commentData);
      if (response && response.success) {
        return {
          success: true,
          message: response.message || 'دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.'
        };
      }
      return { success: false, message: 'خطا در ثبت دیدگاه.' };
    } catch (err) {
      console.error('[blogApi] Submit comment error:', err.message || err);
      throw err;
    }
  }
};

export default blogApi;
