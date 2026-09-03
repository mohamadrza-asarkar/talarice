import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseAmazingProduct(p) {
  if (!p) return null;
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  const originalPrice = typeof p.originalPrice === 'number' ? p.originalPrice : (Number(p.originalPrice) || price);
  const discount = typeof p.discountPercent === 'number' ? p.discountPercent : (typeof p.discount === 'number' ? p.discount : 0);
  const finalPrice = p.finalPrice ? Number(p.finalPrice) : price;
  const oldPrice = p.oldPrice ? Number(p.oldPrice) : (originalPrice > price ? originalPrice : null);
  const stock = p.countInStock !== undefined ? Number(p.countInStock) : (p.count !== undefined ? Number(p.count) : (p.stock ?? 0));
  const image = p.fullImageUrl || p.imageUrl || p.image || '';
  const id = String(p._id || p.id || '');

  return {
    id,
    _id: id,
    title: p.title || p.name || '',
    name: p.title || p.name || '',
    description: p.description || '',
    price: price,
    originalPrice: originalPrice,
    oldPrice: oldPrice,
    discount: discount,
    discountPercent: discount,
    finalPrice: finalPrice,
    count: stock,
    stock: stock,
    image: image,
    imageUrl: image,
    fullImageUrl: image,
    rating: Number(p.rating || 0),
    numReviews: Number(p.numReviews || 0),
    isAmazing: true,
    amazingExpiresAt: p.amazingExpiresAt || null,
    createdAt: p.createdAt || ''
  };
}

export const amazingProductsApi = {
  /**
   * Fetch Amazing deals
   * GET /api/amazing-products
   */
  async getAmazingProducts() {
    try {
      let response;
      try {
        response = await client.get('/amazing-products');
      } catch (err) {
        if (err.statusCode === 404) {
          response = await client.get('/products/amazing');
        } else {
          throw err;
        }
      }
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.products)) {
        list = response.products;
      } else if (Array.isArray(response?.data?.products)) {
        list = response.data.products;
      } else if (Array.isArray(response?.amazingProducts)) {
        list = response.amazingProducts;
      } else if (Array.isArray(response?.data?.amazingProducts)) {
        list = response.data.amazingProducts;
      } else if (Array.isArray(response?.items)) {
        list = response.items;
      }
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: list.map(parseAmazingProduct).filter(Boolean),
        message: response?.message || 'محصولات شگفت‌انگیز دریافت شدند'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Get single amazing product
   * GET /api/amazing-products/:id
   */
  async getAmazingProductById(id) {
    try {
      const response = await client.get(`/amazing-products/${id}`);
      const raw = response?.data?.product || response?.data;
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parseAmazingProduct(raw),
        message: response?.message || 'جزئیات محصول شگفت‌انگیز دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Create amazing product (Admin)
   * POST /api/amazing-products
   */
  async createAmazingProduct(productData) {
    try {
      const response = await client.post('/amazing-products', productData);
      return {
        success: true,
        statusCode: response?.statusCode || 201,
        data: parseAmazingProduct(response?.data?.product || response?.data),
        message: response?.message || 'محصول شگفت‌انگیز با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Update amazing product (Admin)
   * PUT /api/amazing-products/:id
   */
  async updateAmazingProduct(id, productData) {
    try {
      const response = await client.put(`/amazing-products/${id}`, productData);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parseAmazingProduct(response?.data?.product || response?.data),
        message: response?.message || 'محصول شگفت‌انگیز با موفقیت ویرایش شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Delete amazing product (Admin)
   * DELETE /api/amazing-products/:id
   */
  async deleteAmazingProduct(id) {
    try {
      const response = await client.delete(`/amazing-products/${id}`);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'محصول شگفت‌انگیز حذف گردید'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default amazingProductsApi;
