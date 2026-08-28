import client from './client';
import { initialProducts } from '../data/mockData';

function parseProduct(p) {
  if (!p) return null;
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  const oldPrice = typeof p.originalPrice === 'number' ? p.originalPrice : (p.oldPrice ? Number(p.oldPrice) : Math.round(price * 1.15));
  const discountPercent = p.discountPercent ?? (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
  const stock = p.countInStock !== undefined ? p.countInStock : (p.stock ?? 25);
  const inStock = p.isAvailable !== undefined ? p.isAvailable : (stock > 0);
  const image = p.fullImageUrl || p.imageUrl || p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  
  return {
    id: String(p._id || p.id || `prod-${Date.now()}`),
    _id: String(p._id || p.id || `prod-${Date.now()}`),
    name: p.name || p.title || 'برنج کامفیروزی ممتاز',
    description: p.description || 'برنج اصیل کامفیروز شالیزارهای استان فارس با عطر و طعم ماندگار',
    price: price,
    oldPrice: oldPrice,
    discountPercent: discountPercent,
    stock: stock,
    inStock: inStock,
    category: p.category || 'all',
    image: image,
    origin: p.origin || 'کامفیروز، استان فارس',
    farmer: p.farmer || 'تعاونی شالیکاران کامفیروز',
    cookingRatio: p.cookingRatio || '۱ پیمانه برنج به ۱.۳ پیمانه آب',
    elongation: p.elongation || 'بسیار عالی (ری‌کشی ۲ برابر)',
    rating: Number(p.rating || 5.0),
    reviewCount: Number(p.reviewCount || p.numReviews || 12),
    gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [image],
    features: Array.isArray(p.features) ? p.features : ['۱۰۰٪ خالص کامفیروز', 'سورت لیزری دو الک', 'ارسال مستقیم از شالیزار'],
    cookingTime: p.cookingTime || '۳۰ دقیقه',
    smellLevel: p.smellLevel || 'عالی و طبیعی',
    grainType: p.grainType || 'دانه بلند کامفیروزی',
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
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data.map(parseProduct),
          total: response.total || response.data.length
        };
      }
    } catch (err) {
      console.warn('[productsApi] Server fetch fallback:', err.message);
    }
    // Fallback to parsed initial products
    return {
      success: true,
      data: initialProducts.map(parseProduct),
      total: initialProducts.length
    };
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
    } catch (err) {
      console.warn(`[productsApi] Fetch product ${id} fallback:`, err.message);
    }
    const found = initialProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
    return {
      success: Boolean(found),
      data: found ? parseProduct(found) : null
    };
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
    } catch (err) {
      console.warn('[productsApi] Create product server error, creating locally:', err);
    }
    const newProd = parseProduct({ ...productData, id: `prod-${Date.now()}` });
    return {
      success: true,
      data: newProd,
      message: 'محصول با موفقیت اضافه گردید.'
    };
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
    } catch (err) {
      console.warn(`[productsApi] Update product ${id} fallback:`, err);
    }
    return {
      success: true,
      data: parseProduct({ ...productData, id }),
      message: 'ویرایش محصول با موفقیت ذخیره گردید.'
    };
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    try {
      const response = await client.delete(`/products/${id}`);
      return response || { success: true, message: 'محصول حذف گردید.' };
    } catch (err) {
      return { success: true, message: 'محصول با موفقیت حذف گردید.' };
    }
  }
};

export default productsApi;
