import client from './client';

function parseArticle(a) {
  if (!a) return null;
  return {
    id: String(a.id || a._id || ''),
    _id: String(a._id || a.id || ''),
    title: a.title || '',
    summary: a.summary || '',
    content: a.content || '',
    image: a.image || '',
    readTime: a.readTime || '',
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    comments: Array.isArray(a.comments) ? a.comments.map(c => ({
      id: c.id || `c-${Math.random()}`,
      name: c.name || 'کاربر',
      text: c.text || c.comment || '',
      date: c.date || ''
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
      let articlesList = [];
      if (Array.isArray(response)) {
        articlesList = response;
      } else if (Array.isArray(response?.data)) {
        articlesList = response.data;
      } else if (Array.isArray(response?.articles)) {
        articlesList = response.articles;
      } else if (Array.isArray(response?.data?.articles)) {
        articlesList = response.data.articles;
      }
      return {
        success: true,
        data: articlesList.map(parseArticle).filter(Boolean)
      };
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
