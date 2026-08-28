import client from './client';
import { initialCategories, initialTrustItems, initialBrandStory, initialTestTips } from '../data/mockData';

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
    } catch (err) {
      console.warn('[categoriesApi] Server fallback:', err.message);
    }
    return {
      success: true,
      data: initialCategories
    };
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
          trustItems: response.data.trustItems || initialTrustItems,
          brandStory: response.data.brandStory || initialBrandStory,
          testTips: response.data.testTips || initialTestTips
        };
      }
    } catch (err) {
      console.warn('[categoriesApi] Home meta server fallback:', err.message);
    }
    return {
      success: true,
      trustItems: initialTrustItems,
      brandStory: initialBrandStory,
      testTips: initialTestTips
    };
  }
};

export default categoriesApi;
