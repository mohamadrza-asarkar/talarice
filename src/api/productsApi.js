import client from './client';

function parseProduct(p) {
  if (!p) return null;
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  const oldPrice = typeof p.originalPrice === 'number' ? p.originalPrice : (p.oldPrice ? Number(p.oldPrice) : (p.discountPercent ? Math.round(price / (1 - p.discountPercent / 100)) : null));
  const discountPercent = p.discountPercent ?? (oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
  const stock = p.countInStock !== undefined ? p.countInStock : (p.stock ?? 0);
  const inStock = p.isAvailable !== undefined ? p.isAvailable : (stock > 0);
  const image = p.fullImageUrl || p.imageUrl || p.image || p.images?.[0] || '';
  
  return {
    id: String(p._id || p.id || ''),
    _id: String(p._id || p.id || ''),
    name: p.name || p.title || '',
    description: p.description || '',
    price: price,
    oldPrice: oldPrice,
    discountPercent: discountPercent,
    stock: stock,
    inStock: inStock,
    category: p.category || 'all',
    image: image,
    origin: p.origin || '',
    farmer: p.farmer || '',
    cookingRatio: p.cookingRatio || '',
    rating: Number(p.rating || 0),
    reviewCount: Number(p.reviewCount || p.numReviews || 0),
    gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (image ? [image] : []),
    features: Array.isArray(p.features) ? p.features : [],
    cookingTime: p.cookingTime || '',
    smellLevel: p.smellLevel || '',
    grainType: p.grainType || '',
    isFeatured: Boolean(p.isFeatured || p.isAmazing),
    isDeal: Boolean(p.isDeal || p.isAmazing)
  };
}

export const productsApi = {
  /**
   * Fetch all products from backend & parse data
   */
  async getProducts(params = {}) {
    try {
      const response = await client.get('/products', { params });
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseProduct),
          total: response.total || response.data.length
        };
      }
      return { success: false, data: [], total: 0, message: 'خطا در دریافت لیست محصولات' };
    } catch (err) {
      console.error('[productsApi] Server fetch error:', err.message || err);
      throw err;
    }
  },

  /**
   * Get single product details
   */
  async getProductById(id) {
    try {
      const response = await client.get(`/products/${id}`);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseProduct(response.data)
        };
      }
      return { success: false, data: null, message: 'محصول مورد نظر یافت نشد.' };
    } catch (err) {
      console.error(`[productsApi] Fetch product ${id} error:`, err.message || err);
      throw err;
    }
  },

  /**
   * Create new product (Admin)
   */
  async createProduct(productData) {
    try {
      const response = await client.post('/products', productData);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseProduct(response.data),
          message: 'محصول جدید با موفقیت ایجاد شد.'
        };
      }
      return { success: false, message: 'خطا در ثبت محصول جدید' };
    } catch (err) {
      console.error('[productsApi] Create product error:', err.message || err);
      throw err;
    }
  },

  /**
   * Update existing product
   */
  async updateProduct(id, productData) {
    try {
      const response = await client.put(`/products/${id}`, productData);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseProduct(response.data),
          message: 'اطلاعات محصول به‌روزرسانی شد.'
        };
      }
      return { success: false, message: 'خطا در ویرایش اطلاعات محصول' };
    } catch (err) {
      console.error(`[productsApi] Update product ${id} error:`, err.message || err);
      throw err;
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    try {
      const response = await client.delete(`/products/${id}`);
      return response || { success: true, message: 'محصول با موفقیت حذف گردید.' };
    } catch (err) {
      console.error(`[productsApi] Delete product ${id} error:`, err.message || err);
      throw err;
    }
  }
};

export default productsApi;
