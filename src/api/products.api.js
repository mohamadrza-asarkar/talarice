// -------------------------------------------------------------
// Products API (/api/products)
// Native fetch implementation
// -------------------------------------------------------------
import { client } from './client';
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
   * Get all products with optional filters
   */
  async getAll(params = {}) {
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
    const res = await client.get(endpoint);
    
    let rawList = [];
    let pagination = null;

    if (res && res.data && Array.isArray(res.data)) {
      rawList = res.data;
      pagination = res.pagination || null;
    } else if (Array.isArray(res)) {
      rawList = res;
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
   * Get single product by ID
   */
  async getById(id) {
    const res = await client.get(`/products/${id}`);
    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  getProductById(id) {
    return this.getById(id);
  },

  /**
   * Get featured or amazing products
   */
  async getFeatured() {
    try {
      const res = await client.get('/products?featured=true');
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeProduct);
    } catch {
      return [];
    }
  },

  /**
   * Create a new product (Admin)
   */
  async create(productData) {
    const payload = {
      name: productData.name || productData.title,
      description: productData.description || '',
      originalPrice: Number(productData.originalPrice || productData.price || 0),
      discountPercent: Number(productData.discountPercent || 0),
      countInStock: Number(productData.stock !== undefined ? productData.stock : (productData.countInStock || 20)),
      imageBase64: productData.imageBase64 || productData.image || ''
    };

    const endpoints = ['/products', '/admin/products'];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await client.post(ep, payload);
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
   * Update product (Admin)
   */
  async update(id, productData) {
    const endpoints = [`/products/${id}`, `/admin/products/${id}`];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await client.put(ep, productData);
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await client.patch(ep, productData);
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
   * Delete product (Admin)
   */
  async delete(id) {
    const endpoints = [`/products/${id}`, `/admin/products/${id}`];
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        return await client.delete(ep);
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
   * Add a review to a product
   */
  async addReview(productId, reviewData) {
    return await client.post(`/products/${productId}/reviews`, reviewData);
  }
};

export default productsApi;
