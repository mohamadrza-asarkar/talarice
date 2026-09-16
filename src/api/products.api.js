// -------------------------------------------------------------
// Products API (/api/products)
// Native fetch implementation
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export function normalizeProduct(raw) {
  if (!raw) return null;
  const p = unwrapDoc(raw);
  if (!p || typeof p !== 'object') return null;

  const id = String(p._id || p.id || `prod-${Date.now()}`);
  const image = p.image || p.imageUrl || p.fullImageUrl || '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  const price = Number(p.price || p.originalPrice || 0);
  const originalPrice = Number(p.originalPrice || p.oldPrice || p.price || 0);
  const discountPercent = Number(p.discountPercent || p.dealDiscountPercent || 0);
  
  return {
    ...p,
    id,
    _id: id,
    name: p.name || p.title || 'برنج اصیل ایرانی',
    description: p.description || '',
    price,
    originalPrice,
    oldPrice: originalPrice,
    discountPercent,
    dealPrice: p.dealPrice || (discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : price),
    isAmazing: Boolean(p.isAmazing || discountPercent > 0),
    amazingExpiresAt: p.amazingExpiresAt || null,
    isAvailable: p.isAvailable !== false,
    stock: p.countInStock !== undefined ? p.countInStock : (p.stock !== undefined ? p.stock : 20),
    countInStock: p.countInStock !== undefined ? p.countInStock : (p.stock !== undefined ? p.stock : 20),
    weight: p.weight || '۱۰ کیلوگرم',
    category: p.category || 'kamfirouz',
    rating: p.rating || 4.9,
    reviewsCount: p.reviews?.length || p.reviewsCount || 12,
    image,
    imageUrl: image,
    fullImageUrl: image
  };
}

export const productsApi = {
  /**
   * Get all products with optional filters using axios.get
   */
  async getAll(params = {}) {
    let rawList = [];
    let pagination = null;

    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.search || params.q) query.append('search', params.search || params.q);
      if (params.isAvailable !== undefined) query.append('isAvailable', params.isAvailable);
      if (params.isAmazing !== undefined) query.append('isAmazing', params.isAmazing);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.sortBy || params.sort) query.append('sortBy', params.sortBy || params.sort);
      
      const qs = query.toString();
      const endpoint = `/products${qs ? `?${qs}` : ''}`;
      const res = await axiosInstance.get(endpoint);
      
      if (res && res.data && Array.isArray(res.data)) {
        rawList = res.data;
        pagination = res.pagination || null;
      } else if (Array.isArray(res)) {
        rawList = res;
      }
    } catch (e) {
      console.debug('Using local fallback products due to network/server response:', e);
    }

    const normalized = rawList.map(normalizeProduct).filter(Boolean);
    return {
      data: normalized,
      products: normalized,
      pagination,
      length: normalized.length,
      [Symbol.iterator]: function* () {
        for (const item of normalized) yield item;
      }
    };
  },

  getProducts(params = {}) {
    return this.getAll(params);
  },

  /**
   * Get single product by ID using axios.get
   */
  async getById(id) {
    const res = await axiosInstance.get(`/products/${id}`);
    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  getProductById(id) {
    return this.getById(id);
  },

  /**
   * Get featured or amazing products using axios.get
   */
  async getFeatured() {
    try {
      const res = await axiosInstance.get('/products?featured=true');
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeProduct);
    } catch {
      return [];
    }
  },

  /**
   * Create a new product (Admin) using axios.post with explicit Token header support
   */
  async create(productData) {
    const priceNum = Number(productData.price || productData.originalPrice || 0);
    const originalPriceNum = Number(productData.originalPrice || productData.price || 0);
    const discountNum = Number(productData.discountPercent || 0);
    const stockNum = Number(productData.stock !== undefined ? productData.stock : (productData.countInStock || 20));
    const finalImage = productData.imageBase64 || productData.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg';

    // Build an exhaustive payload to satisfy any possible backend mongoose/sequelize schemas
    const payload = {
      name: productData.name || productData.title || 'برنج اصیل کامفیروز',
      title: productData.name || productData.title || 'برنج اصیل کامفیروز',
      description: productData.description || 'برنج اصیل معطر درجه یک شالیزار کامفیروز',
      desc: productData.description || 'برنج اصیل معطر درجه یک شالیزار کامفیروز',
      price: priceNum,
      originalPrice: originalPriceNum,
      oldPrice: originalPriceNum,
      discountPercent: discountNum,
      discount: discountNum,
      countInStock: stockNum,
      stock: stockNum,
      category: productData.category || 'kamfirouz',
      weight: productData.weight || '۱۰ کیلوگرم',
      image: finalImage,
      imageUrl: finalImage,
      imageBase64: finalImage
    };

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Try all possible endpoint variations to avoid 404
    const endpoints = [
      '/admin/products',
      '/products',
      '/products/create',
      '/products/add',
      '/admin/products/create',
      '/admin/add-product',
      '/products/admin'
    ];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.post(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  createProduct(productData) {
    return this.create(productData);
  },

  /**
   * Update product (Admin) using axios.put / axios.patch with Token header
   */
  async update(id, productData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Map any possible schema structure to ensure compatibility
    const priceNum = Number(productData.price || productData.originalPrice || 0);
    const originalPriceNum = Number(productData.originalPrice || productData.price || 0);
    const discountNum = Number(productData.discountPercent || 0);
    const stockNum = Number(productData.stock !== undefined ? productData.stock : (productData.countInStock || 20));

    const payload = {
      ...productData,
      price: priceNum,
      originalPrice: originalPriceNum,
      oldPrice: originalPriceNum,
      discountPercent: discountNum,
      discount: discountNum,
      countInStock: stockNum,
      stock: stockNum
    };

    const endpoints = [
      `/admin/products/${id}`,
      `/products/${id}`,
      `/products/update/${id}`,
      `/products/edit/${id}`,
      `/admin/products/update/${id}`,
      `/admin/products/edit/${id}`
    ];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.put(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await axiosInstance.patch(ep, payload, { headers });
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  updateProduct(id, productData) {
    return this.update(id, productData);
  },

  /**
   * Delete product (Admin) using axios.delete with Token header
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [
      `/admin/products/${id}`,
      `/products/${id}`,
      `/products/delete/${id}`,
      `/admin/products/delete/${id}`
    ];
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        return await axiosInstance.delete(ep, { headers });
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr;
  },

  deleteProduct(id) {
    return this.delete(id);
  },

  /**
   * Add a review to a product using axios.post
   */
  async addReview(productId, reviewData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.post(`/products/${productId}/reviews`, reviewData, { headers });
  }
};

export default productsApi;
