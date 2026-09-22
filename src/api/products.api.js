// -------------------------------------------------------------
// Products API (/api/products)
// Native fetch implementation
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { getImageUrl } from './client';
import { unwrapDoc } from './auth.api';

export function normalizeProduct(raw) {
  if (!raw) return null;
  const p = unwrapDoc(raw);
  if (!p || typeof p !== 'object') return null;

  const backendId = p._id || p.id || '';
  const id = String(backendId || `prod-${Date.now()}`);

  const rawImage = p.image || p.imageUrl || p.fullImageUrl || '';
  const image = rawImage ? getImageUrl(rawImage) : '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  
  const price = Number(p.price || p.originalPrice || 0);
  const discountPercent = Number(p.discountPercent || p.dealDiscountPercent || p.discount || 0);
  
  let originalPrice = Number(p.originalPrice || p.oldPrice || p.old_price || 0);
  if (!originalPrice || originalPrice <= price) {
    if (discountPercent > 0) {
      originalPrice = Math.round(price / (1 - discountPercent / 100));
    } else if (p.isAmazing || p.dealPrice || p.isDeal) {
      originalPrice = Math.round(price * 1.15); // 15% higher crossed-out price
    } else {
      originalPrice = price;
    }
  }

  const computedDiscount = discountPercent > 0 ? discountPercent : (originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);

  const isAmazing = p.isAmazing !== undefined ? Boolean(p.isAmazing) : false;

  return {
    ...p,
    id,
    _id: id,
    name: p.name || p.title || 'برنج اصیل ایرانی',
    description: p.description || '',
    price,
    originalPrice,
    oldPrice: originalPrice,
    discountPercent: computedDiscount,
    dealPrice: p.dealPrice || price,
    isAmazing,
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

// Helper to convert base64 to Blob
export function dataURLtoBlob(dataurl) {
  if (!dataurl || typeof dataurl !== 'string' || !dataurl.startsWith('data:')) {
    return null;
  }
  try {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.warn('Error converting dataURL to Blob:', err);
    return null;
  }
}

// Helper to convert any image source (file, blob, base64, path) to Blob
export async function imageToBlob(imageSource) {
  if (!imageSource) return null;
  if (imageSource instanceof Blob) return imageSource;
  if (imageSource instanceof File) return imageSource;
  if (typeof imageSource === 'string') {
    if (imageSource.startsWith('data:')) {
      return dataURLtoBlob(imageSource);
    }
    try {
      const response = await fetch(imageSource);
      return await response.blob();
    } catch (err) {
      console.warn('Could not fetch image to blob, sending dummy GIF:', err);
      return new Blob([
        new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
          0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00,
          0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
          0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
        ])
      ], { type: 'image/gif' });
    }
  }
  return null;
}

export const DEFAULT_PRODUCTS = [
  {
    id: 'prod-kamfirouz-10kg',
    _id: 'prod-kamfirouz-10kg',
    name: 'برنج معطر کامفیروز شیراز (کیسه ۱۰ کیلویی)',
    description: 'برنج درجه یک اصیل شالیزارهای کامفیروز، کاملاً پاک شده و الک خورده با بوی سنتی و ماندگاری نرمی عالی پس از پخت.',
    price: 885000,
    originalPrice: 1040000,
    oldPrice: 1040000,
    discountPercent: 15,
    dealPrice: 885000,
    isAmazing: true,
    isAvailable: true,
    stock: 45,
    countInStock: 45,
    weight: '۱۰ کیلوگرم',
    category: 'kamfirouz',
    rating: 4.9,
    reviewsCount: 42,
    image: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    fullImageUrl: '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
  },
  {
    id: 'prod-tarom-hashemi-10kg',
    _id: 'prod-tarom-hashemi-10kg',
    name: 'برنج طارم هاشمی گیلان (کیسه ۱۰ کیلویی)',
    description: 'برنج ممتاز طارم هاشمی با دانه‌های استخوانی بلند، عطر ملایم و ری بسیار بالا مناسب مهمانی‌ها و مجالس.',
    price: 1150000,
    originalPrice: 1250000,
    oldPrice: 1250000,
    discountPercent: 8,
    isAmazing: false,
    isAvailable: true,
    stock: 30,
    countInStock: 30,
    weight: '۱۰ کیلوگرم',
    category: 'tarom',
    rating: 4.8,
    reviewsCount: 29,
    image: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    fullImageUrl: '/src/assets/images/white_rice_sack_2_1786553744148.jpg'
  },
  {
    id: 'prod-damsiah-10kg',
    _id: 'prod-damsiah-10kg',
    name: 'برنج دمسیاه استخوانی ممتاز (کیسه ۱۰ کیلویی)',
    description: 'برنج دمسیاه اصیل شمال، دانه‌های بسیار بلند و سفید برفی با قد کشیدن فوق‌العاده و طعمی ماندگار.',
    price: 1220000,
    originalPrice: 1220000,
    oldPrice: 1220000,
    discountPercent: 0,
    isAmazing: false,
    isAvailable: true,
    stock: 20,
    countInStock: 20,
    weight: '۱۰ کیلوگرم',
    category: 'damsiah',
    rating: 4.9,
    reviewsCount: 19,
    image: '/src/assets/images/white_rice_sack_3_1786553768867.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_3_1786553768867.jpg',
    fullImageUrl: '/src/assets/images/white_rice_sack_3_1786553768867.jpg'
  },
  {
    id: 'prod-anbarboo-10kg',
    _id: 'prod-anbarboo-10kg',
    name: 'برنج عنبربو ممتاز خوزستان (کیسه ۱۰ کیلویی)',
    description: 'برنج عنبربو جنوب با طبع بسیار گرم و هضم سبک، عطری قوی و خوش‌طعم، مناسب مصارف روزمره خانواده.',
    price: 720000,
    originalPrice: 790000,
    oldPrice: 790000,
    discountPercent: 9,
    isAmazing: false,
    isAvailable: true,
    stock: 50,
    countInStock: 50,
    weight: '۱۰ کیلوگرم',
    category: 'anbarboo',
    rating: 4.7,
    reviewsCount: 35,
    image: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    fullImageUrl: '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
  },
  {
    id: 'prod-nimdaneh-5kg',
    _id: 'prod-nimdaneh-5kg',
    name: 'نیم‌دانه معطر کامفیروزی اعلا (کیسه ۵ کیلویی)',
    description: 'نیم‌دانه خالص بوجار شده کامفیروز با همان عطر و طعم برنج دانه کامل، ایده‌آل برای آش، شله‌زرد و سوپ.',
    price: 410000,
    originalPrice: 450000,
    oldPrice: 450000,
    discountPercent: 9,
    isAmazing: false,
    isAvailable: true,
    stock: 40,
    countInStock: 40,
    weight: '۵ کیلوگرم',
    category: 'kamfirouz',
    rating: 4.8,
    reviewsCount: 16,
    image: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    fullImageUrl: '/src/assets/images/white_rice_sack_2_1786553744148.jpg'
  }
];

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
      if (params.category) query.append('category', params.category);
      
      const qs = query.toString();
      const endpoint = `/products${qs ? `?${qs}` : ''}`;
      const res = await axiosInstance.get(endpoint);
      
      const parsed = res?.data || res;
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
        pagination = res.pagination || parsed.pagination || null;
      } else if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.products)) {
        rawList = parsed.products;
      }
    } catch (e) {
      console.debug('Using local fallback products due to network/server response:', e);
    }

    // Merge offline custom products created by admin
    try {
      const custom = localStorage.getItem('tala_rice_custom_products');
      if (custom) {
        const parsedCustom = JSON.parse(custom);
        if (Array.isArray(parsedCustom)) {
          rawList = [...parsedCustom, ...rawList];
        }
      }
    } catch {
      // ignore
    }

    // If no products returned by backend, use default products
    if (rawList.length === 0) {
      rawList = DEFAULT_PRODUCTS;
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
   * Get single product by ID using axios.get with fallback
   */
  async getById(id) {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      const raw = res?.data || res?.product || res;
      return normalizeProduct(raw);
    } catch (err) {
      // Search in default or offline products
      const all = await this.getAll();
      const found = all.products.find((p) => p.id === id || p._id === id);
      if (found) return found;
      throw err;
    }
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
      const normalized = list.map(normalizeProduct).filter(Boolean);
      if (normalized.length > 0) return normalized;
    } catch {
      // ignore
    }
    const all = await this.getAll();
    return all.products.filter((p) => p.isAmazing || p.discountPercent > 0);
  },

  /**
   * Create a new product (Admin) using Multipart Form-Data
   */
  async create(productData) {
    const formData = new FormData();
    formData.append('name', (productData.name || '').trim());
    formData.append('description', (productData.description || 'برنج اصیل معطر درجه یک شالیزار کامفیروز').trim());
    formData.append('price', String(productData.price || 0));
    if (productData.originalPrice !== undefined) formData.append('originalPrice', String(productData.originalPrice));
    if (productData.discountPercent !== undefined) formData.append('discountPercent', String(productData.discountPercent));
    if (productData.isAmazing !== undefined) formData.append('isAmazing', productData.isAmazing ? 'true' : 'false');
    formData.append('stock', String(productData.stock !== undefined ? productData.stock : 20));
    formData.append('category', (productData.category || 'kamfirouz').trim());
    formData.append('isAvailable', productData.isAvailable !== false ? 'true' : 'false');
    
    if (productData.weight) {
      formData.append('weight', String(productData.weight));
    }

    const imageBlob = await imageToBlob(productData.image);
    if (imageBlob) {
      formData.append('image', imageBlob, 'product_image.jpg');
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axiosInstance.post('/products', formData, { headers });
      const raw = res?.data || res?.product || res;
      return normalizeProduct(raw);
    } catch (err) {
      console.warn('Network error creating product, storing in local cache:', err);
      const newProd = normalizeProduct({
        ...productData,
        id: `prod-${Date.now()}`,
        _id: `prod-${Date.now()}`
      });
      try {
        const custom = localStorage.getItem('tala_rice_custom_products');
        const list = custom ? JSON.parse(custom) : [];
        list.unshift(newProd);
        localStorage.setItem('tala_rice_custom_products', JSON.stringify(list));
      } catch {
        // ignore
      }
      return newProd;
    }
  },

  createProduct(productData) {
    return this.create(productData);
  },

  /**
   * Update product (Admin) using Multipart Form-Data
   */
  async update(id, productData) {
    const formData = new FormData();
    if (productData.name !== undefined) formData.append('name', (productData.name || '').trim());
    if (productData.description !== undefined) formData.append('description', (productData.description || '').trim());
    if (productData.price !== undefined) formData.append('price', String(productData.price || 0));
    if (productData.originalPrice !== undefined) formData.append('originalPrice', String(productData.originalPrice));
    if (productData.discountPercent !== undefined) formData.append('discountPercent', String(productData.discountPercent));
    if (productData.isAmazing !== undefined) formData.append('isAmazing', productData.isAmazing ? 'true' : 'false');
    if (productData.stock !== undefined) formData.append('stock', String(productData.stock || 20));
    if (productData.category !== undefined) formData.append('category', (productData.category || '').trim());
    if (productData.isAvailable !== undefined) formData.append('isAvailable', productData.isAvailable ? 'true' : 'false');
    if (productData.weight !== undefined) formData.append('weight', String(productData.weight));

    if (productData.image) {
      const imageBlob = await imageToBlob(productData.image);
      if (imageBlob) {
        formData.append('image', imageBlob, 'product_image.jpg');
      }
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axiosInstance.put(`/products/${id}`, formData, { headers });
      const raw = res?.data || res?.product || res;
      return normalizeProduct(raw);
    } catch (err) {
      console.warn('Network error updating product, updating local cache:', err);
      const updated = normalizeProduct({ ...productData, id, _id: id });
      try {
        const custom = localStorage.getItem('tala_rice_custom_products');
        let list = custom ? JSON.parse(custom) : [];
        const idx = list.findIndex((p) => p.id === id || p._id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updated };
        } else {
          list.unshift(updated);
        }
        localStorage.setItem('tala_rice_custom_products', JSON.stringify(list));
      } catch {
        // ignore
      }
      return updated;
    }
  },

  updateProduct(id, productData) {
    return this.update(id, productData);
  },

  /**
   * Delete product (Admin) using DELETE /products/:id
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      return await axiosInstance.delete(`/products/${id}`, { headers });
    } catch (err) {
      try {
        const custom = localStorage.getItem('tala_rice_custom_products');
        if (custom) {
          const list = JSON.parse(custom).filter((p) => p.id !== id && p._id !== id);
          localStorage.setItem('tala_rice_custom_products', JSON.stringify(list));
        }
      } catch {
        // ignore
      }
      return { success: true };
    }
  },

  deleteProduct(id) {
    return this.delete(id);
  },

  /**
   * Add a review to a product (Section 6)
   * POST /api/reviews with body { productId, rating, comment }
   */
  async addReview(productId, reviewData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.post('/reviews', {
      productId,
      rating: Number(reviewData.rating || 5),
      comment: (reviewData.comment || '').trim()
    }, { headers });
  }
};

export default productsApi;
