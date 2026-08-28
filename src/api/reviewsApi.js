import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseReview(r) {
  if (!r) return null;
  const id = String(r._id || r.id || '');
  return {
    id,
    _id: id,
    productId: String(r.productId || r.product || ''),
    userName: r.userName || r.user?.name || r.user || 'کاربر',
    rating: Number(r.rating || 5),
    comment: r.comment || r.text || '',
    reply: r.reply || r.adminReply || '',
    date: r.date || (r.createdAt ? r.createdAt.split('T')[0] : ''),
    createdAt: r.createdAt || '',
    isVerifiedPurchase: Boolean(r.isVerifiedPurchase ?? false)
  };
}

export const reviewsApi = {
  /**
   * Fetch reviews for a specific product
   * GET /api/reviews?productId=:productId
   */
  async getReviews(productId) {
    try {
      const response = await client.get('/reviews', {
        params: productId ? { productId } : {}
      });
      let list = [];
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          list = response.data;
        } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
          list = response.data.reviews;
        }
      } else if (Array.isArray(response)) {
        list = response;
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: list.map(parseReview).filter(Boolean),
        message: response?.message || 'نظرات با موفقیت دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Add a review for a product
   * POST /api/reviews
   * Body: { productId, rating, comment }
   */
  async addReview(reviewData) {
    try {
      const payload = {
        productId: reviewData.productId,
        rating: Number(reviewData.rating || 5),
        comment: reviewData.comment || reviewData.text || ''
      };

      const response = await client.post('/reviews', payload);
      const raw = response?.data?.review || response?.data;

      return {
        success: true,
        statusCode: response?.statusCode || 201,
        data: parseReview(raw),
        message: response?.message || 'نظر شما با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Admin reply to review
   * POST /api/reviews/:id/reply
   * Body: { reply }
   */
  async replyReview(reviewId, replyText) {
    try {
      const response = await client.post(`/reviews/${reviewId}/reply`, { reply: replyText });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'پاسخ شما با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Admin delete review
   * DELETE /api/reviews/:id
   */
  async deleteReview(reviewId) {
    try {
      const response = await client.delete(`/reviews/${reviewId}`);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'نظر با موفقیت حذف گردید'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default reviewsApi;
