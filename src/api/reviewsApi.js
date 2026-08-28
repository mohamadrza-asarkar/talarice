import client from './client';

function parseReview(r) {
  if (!r) return null;
  return {
    id: String(r.id || r._id || `rev-${Date.now()}`),
    productId: String(r.productId || 'prod-1'),
    userName: r.userName || r.user || 'خریدار محترم',
    rating: Number(r.rating || 5),
    comment: r.comment || r.text || 'پخت و عطر برنج عالی بود.',
    date: r.date || 'بهمن ۱۴۰۳',
    isVerifiedPurchase: Boolean(r.isVerifiedPurchase ?? true)
  };
}

export const reviewsApi = {
  /**
   * Get product reviews
   */
  async getReviews(productId = null) {
    try {
      const response = await client.get('/reviews', { params: { productId } });
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseReview)
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت نظرات' };
    } catch (err) {
      console.error('[reviewsApi] Fetch reviews error:', err.message || err);
      throw err;
    }
  },

  /**
   * Submit new review
   */
  async addReview(reviewData) {
    try {
      const response = await client.post('/reviews', reviewData);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseReview(response.data),
          message: response.message || 'دیدگاه شما با موفقیت ثبت شد.'
        };
      }
      return { success: false, message: 'خطا در ثبت دیدگاه' };
    } catch (err) {
      console.error('[reviewsApi] Add review error:', err.message || err);
      throw err;
    }
  },

  /**
   * Reply to review (Admin)
   */
  async replyToReview(reviewId, comment) {
    try {
      const response = await client.post(`/reviews/${reviewId}/reply`, { comment });
      return response || { success: true, message: 'پاسخ شما با موفقیت ثبت شد.' };
    } catch (err) {
      console.error(`[reviewsApi] Reply to review ${reviewId} error:`, err.message || err);
      throw err;
    }
  },

  /**
   * Delete review (Admin)
   */
  async deleteReview(reviewId) {
    try {
      const response = await client.delete(`/reviews/${reviewId}`);
      return response || { success: true, message: 'دیدگاه با موفقیت حذف شد.' };
    } catch (err) {
      console.error(`[reviewsApi] Delete review ${reviewId} error:`, err.message || err);
      throw err;
    }
  }
};

export default reviewsApi;
