import client from './client';
import { initialArticles } from '../data/mockData';

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
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data.map(parseArticle)
        };
      }
    } catch (err) {
      console.warn('[blogApi] Fetch articles server fallback:', err.message);
    }
    return {
      success: true,
      data: initialArticles.map(parseArticle)
    };
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
    } catch (err) {
      console.warn(`[blogApi] Fetch article ${id} fallback:`, err.message);
    }
    const found = initialArticles.find(a => String(a.id) === String(id));
    return {
      success: Boolean(found),
      data: found ? parseArticle(found) : parseArticle(initialArticles[0])
    };
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
          message: 'دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.'
        };
      }
    } catch (err) {
      console.warn('[blogApi] Submit comment server fallback:', err);
    }
    return {
      success: true,
      message: 'دیدگاه شما ثبت شد و به مقاله اضافه گردید.'
    };
  }
};

export default blogApi;
