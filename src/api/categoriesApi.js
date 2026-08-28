import client from './client';

export const categoriesApi = {
  /**
   * Fetch categories list
   */
  async getCategories() {
    try {
      const response = await client.get('/categories');
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت دسته‌بندی‌ها' };
    } catch (err) {
      console.error('[categoriesApi] Categories fetch error:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch home trust items, brand story, and test tips
   */
  async getHomeMeta() {
    try {
      const response = await client.get('/home/meta');
      if (response && response.success && response.data) {
        return {
          success: true,
          trustItems: response.data.trustItems || [],
          brandStory: response.data.brandStory || '',
          testTips: response.data.testTips || []
        };
      }
      return {
        success: false,
        trustItems: [],
        brandStory: '',
        testTips: [],
        message: 'خطا در دریافت متا دیتای خانه'
      };
    } catch (err) {
      console.error('[categoriesApi] Home meta fetch error:', err.message || err);
      throw err;
    }
  }
};

export default categoriesApi;
