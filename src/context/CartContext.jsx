import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import ToastContainer from '../components/toast';
import {
  productsApi,
  ordersApi,
  adminApi,
  normalizeProduct
} from '../api';

const CartContext = createContext();

const STORAGE_KEYS = {
  CART: 'tala_rice_cart',
  ORDERS: 'tala_rice_orders',
  PRODUCTS: 'tala_rice_products',
  REVIEWS: 'tala_rice_reviews',
  SLIDES: 'tala_rice_slides'
};

const STORE_INFO = {
  name: 'برنج طلا رایس',
  phone: '۰۷۱-۳۸۳۰۱۵۶۰',
  mobile: '۰۹۱۷-۳۱۴-۷۸۵۲',
  address: 'فارس، مرودشت، منطقه کامفیروز، دفتر مرکزی طلا رایس',
  email: 'info@talarice.ir',
  instagram: 'talarice'
};

const TRUST_ITEMS = [
  {
    id: 'trust-1',
    title: 'ارسال مستقیم از شالیزار',
    iconClass: 'fa-solid fa-seedling',
    description: 'تمامی کیسه‌ها بدون واسطه و دلال، مستقیماً از مزارع حاصلخیز کامفیروز بسته‌بندی و ارسال می‌شوند.'
  },
  {
    id: 'trust-2',
    title: 'ضمانت ۱۰۰٪ اصالت و عطر',
    iconClass: 'fa-solid fa-circle-check',
    description: 'در صورت عدم رضایت کامل از عطر، ری و کیفیت پخت، وجه پرداختی تا ۷ روز بدون قید و شرط عودت داده می‌شود.'
  },
  {
    id: 'trust-3',
    title: 'کیسه نخی تنفس‌پذیر',
    iconClass: 'fa-solid fa-box-open',
    description: 'بسته‌بندی در گونی‌های پارچه‌ای سفید با دوخت صنعتی جهت حفظ عطر طبیعی و جلوگیری از آفت‌زدگی.'
  }
];

const BRAND_STORY = {
  title: 'اصالت و پیشینه برنج کامفیروز',
  description: 'عرضه مستقیم اصیل‌ترین برنج معطر کامفیروز مرودشت از شالیزارهای حوزه سد درودزن استان فارس در گونی‌های نخی سفید و بهداشتی، بدون اختلاط و با خلوص ۱۰۰ درصدی.'
};

const FALLBACK_PRODUCTS = [];

const FALLBACK_REVIEWS = [];

const FALLBACK_SLIDERS = [];

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage write error:', err);
  }
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();

  // 1. Core States
  const [cart, setCart] = useState(() => getStorage(STORAGE_KEYS.CART, []));
  const [orders, setOrders] = useState(() => {
    const stored = getStorage(STORAGE_KEYS.ORDERS, []);
    return Array.isArray(stored)
      ? stored.filter((o) => o?.customerPhone !== '09120000000' && o?.phone !== '09120000000')
      : [];
  });
  const [products, setProducts] = useState(() => {
    const stored = getStorage(STORAGE_KEYS.PRODUCTS, []);
    if (!Array.isArray(stored)) return [];
    // Filter out dummy/test products prod-1, prod-2, prod-3, prod-4
    return stored.filter((p) => p && !['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(p.id) && !['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(p._id));
  });
  const [sliders, setSliders] = useState(() => {
    const stored = getStorage(STORAGE_KEYS.SLIDES, []);
    if (!Array.isArray(stored)) return [];
    // Filter out dummy/test slides slide-1, slide-2
    return stored.filter((s) => s && !['slide-1', 'slide-2'].includes(s.id) && !['slide-1', 'slide-2'].includes(s._id));
  });
  const [reviews, setReviews] = useState(() => {
    const stored = getStorage(STORAGE_KEYS.REVIEWS, []);
    return Array.isArray(stored)
      ? stored.filter((r) => r?.id !== 'rev-1' && r?.id !== 'rev-2' && r?.userName !== 'حاج احمد ترابی' && r?.userName !== 'فاطمه سلیمانی')
      : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories list
  const categories = [
    { id: 'all', name: 'همه ارقام برنج' },
    { id: 'kamfirouz', name: 'برنج کامفیروز' },
    { id: 'hashemi', name: 'برنج هاشمی' },
    { id: 'tarom', name: 'برنج طارم' },
    { id: 'doudi', name: 'برنج دودی' },
    { id: 'brown', name: 'برنج قهوه‌ای' }
  ];

  // 2. Toast Actions
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    if (!message) return;
    const cleanMsg = typeof message === 'string' ? message : String(message);
    const id = Date.now() + Math.random().toString(36).substring(2, 7);

    setToasts((prev) => {
      // Prevent identical duplicate toast stacking
      if (prev.some(t => t.message === cleanMsg)) {
        return prev;
      }
      // Cap at maximum 3 visible toasts
      const next = prev.length >= 3 ? prev.slice(1) : prev;
      return [...next, { id, message: cleanMsg, type, duration }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const showSuccess = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const showError = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // Listen to cross-context decoupled toasts
  useEffect(() => {
    const handleTalaToast = (e) => {
      if (e.detail && e.detail.message) {
        showToast(e.detail.message, e.detail.type || 'info');
      }
    };
    window.addEventListener('tala-toast', handleTalaToast);
    return () => window.removeEventListener('tala-toast', handleTalaToast);
  }, [showToast]);

  // 3. LocalStorage persistence
  useEffect(() => { setStorage(STORAGE_KEYS.CART, cart); }, [cart]);
  useEffect(() => { setStorage(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { setStorage(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { setStorage(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { setStorage(STORAGE_KEYS.SLIDES, sliders); }, [sliders]);

  // 4. Synchronization with Remote API
  const refreshProductsFromApi = useCallback(async () => {
    try {
      setIsLoadingApi(true);
      setApiError(null);
      const res = await productsApi.getAll({ limit: 50 });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.products) ? res.products : []));
      if (rawList.length > 0) {
        const cleanList = rawList.filter((p) => p && !['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(p.id) && !['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(p._id));
        setProducts(cleanList);
      }
    } catch (err) {
      setApiError(err.message || 'خطا در بارگذاری لیست محصولات از سرور.');
      console.debug('Product sync notice:', err.message);
    } finally {
      setIsLoadingApi(false);
    }
  }, []);

  const refreshSlidesFromApi = useCallback(async () => {
    // Optional slide refresh
  }, []);

  const refreshOrdersFromApi = useCallback(async () => {
    if (!currentUser) return;
    try {
      const list = await ordersApi.getMyOrders(currentUser);
      if (Array.isArray(list) && list.length > 0) {
        setOrders(list.map((o) => ({
          ...o,
          id: o._id || o.id,
          trackingCode: o.postTrackingCode || o.trackingCode || `TRK-${String(o._id || o.id).slice(-6)}`,
          customerName: o.customerName || o.name,
          customerPhone: o.customerPhone || o.phone,
          items: o.products || o.items || [],
          finalAmount: o.totalPrice || o.finalAmount,
          status: o.state || o.status || 'در حال پردازش',
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('fa-IR') : 'به‌تازگی'
        })));
      }
    } catch (err) {
      console.debug('Order sync notice:', err.message);
    }
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    refreshProductsFromApi();
    refreshSlidesFromApi();
  }, [refreshProductsFromApi, refreshSlidesFromApi]);

  useEffect(() => {
    refreshOrdersFromApi();
  }, [refreshOrdersFromApi]);

  // 5. Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const shippingFee = cartSubtotal >= 1000000 || cartSubtotal === 0 ? 0 : 45000;
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + shippingFee : 0;

  // 6. Cart Actions (with API sync when available)
  const addToCart = useCallback(async (product, qty = 1) => {
    const prodId = product._id || product.id;
    setCart((prev) => {
      const idx = prev.findIndex((i) => (i._id || i.id) === prodId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...product, id: prodId, quantity: qty }];
    });

    try {
      await cartApi.addItem({ productId: prodId, quantity: qty });
    } catch (err) {
      // Local cart maintained gracefully
    }
    showSuccess(`«${product.name}» به سبد خرید اضافه شد.`);
  }, [showSuccess]);

  const updateCartQuantity = useCallback(async (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((i) => ((i._id || i.id) === productId ? { ...i, quantity: qty } : i)));
    try {
      await cartApi.updateItem(productId, { quantity: qty });
    } catch (err) {
      // Handled locally
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    setCart((prev) => prev.filter((i) => (i._id || i.id) !== productId));
    try {
      await cartApi.removeItem(productId);
    } catch (err) {
      // Handled locally
    }
    showToast('کالا از سبد خرید حذف شد.', 'info');
  }, [showToast]);

  const clearCart = useCallback(async () => {
    setCart([]);
    try {
      await cartApi.clearCart();
    } catch (err) {
      // Handled locally
    }
  }, []);

  // 7. Order Actions
  const createOrder = useCallback(async (orderData) => {
    const itemsList = cart.map((item) => ({
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      image: item.image
    }));

    const orderPayload = {
      name: orderData.recipientName || orderData.name || currentUser?.name || 'خریدار محترم',
      phone: orderData.phone || currentUser?.phone || '',
      address: orderData.fullAddress || orderData.address || currentUser?.address || '',
      postalCode: orderData.postalCode || '1991812345',
      products: itemsList,
      paymentReceipt: orderData.paymentReceipt || orderData.receiptImage || ''
    };

    try {
      const res = await ordersApi.createOrder(orderPayload);
      const serverOrder = res?.data || res?.order || res;
      if (!serverOrder) {
        throw new Error('پاسخی از سرور برای ثبت سفارش دریافت نشد.');
      }

      const newOrder = {
        ...serverOrder,
        id: serverOrder._id || serverOrder.id,
        _id: serverOrder._id || serverOrder.id,
        trackingCode: serverOrder.postTrackingCode || serverOrder.trackingCode || serverOrder._id,
        postTrackingCode: serverOrder.postTrackingCode || serverOrder.trackingCode || serverOrder._id,
        date: serverOrder.createdAt ? new Date(serverOrder.createdAt).toLocaleDateString('fa-IR') : new Date().toLocaleDateString('fa-IR'),
        customerName: orderPayload.name,
        customerPhone: orderPayload.phone,
        customerAddress: orderPayload.address,
        postalCode: orderPayload.postalCode,
        items: [...cart],
        totalPrice: cartSubtotal,
        discountAmount: 0,
        shippingFee,
        finalAmount: finalTotal,
        status: serverOrder.state || 'در حال پردازش',
        state: serverOrder.state || 'pending',
        paymentStatus: serverOrder.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || 'آنلاین',
        paymentReceipt: orderPayload.paymentReceipt
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setIsCheckoutOpen(false);
      showSuccess(`سفارش شما با موفقیت در سرور ثبت گردید (کد رهگیری: ${newOrder.trackingCode}).`);
      return newOrder;
    } catch (err) {
      showError(`خطا در ثبت سفارش در سرور: ${err.message}`);
      throw err;
    }
  }, [cart, cartSubtotal, shippingFee, finalTotal, currentUser, clearCart, showSuccess, showError]);

  const updateOrderStatus = useCallback(async (orderId, status, postTrackingCode = '', adminNote = '') => {
    try {
      await ordersApi.updateStatus(orderId, {
        state: status,
        postTrackingCode,
        adminNote
      });
      setOrders((prev) =>
        prev.map((o) =>
          (o.id === orderId || o._id === orderId)
            ? {
                ...o,
                status,
                state: status,
                postTrackingCode: postTrackingCode || o.postTrackingCode
              }
            : o
        )
      );
      showSuccess('وضعیت سفارش در سرور بروزرسانی شد.');
    } catch (err) {
      showError(`خطا در بروزرسانی وضعیت سفارش: ${err.message}`);
      throw err;
    }
  }, [showSuccess, showError]);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId && o._id !== orderId));
    showToast('سفارش حذف شد.', 'info');
  }, [showToast]);

  const trackOrder = useCallback(async (query) => {
    if (!query) return null;
    const clean = String(query).trim();

    try {
      const res = await ordersApi.trackOrder(clean);
      const o = res?.data || res?.order || res;
      if (o && (o._id || o.name || o.status || o.state)) {
        return {
          ...o,
          id: o._id || o.id,
          trackingCode: o.postTrackingCode || o._id,
          customerName: o.name,
          customerPhone: o.phone,
          customerAddress: o.address,
          items: o.products || [],
          finalAmount: o.totalPrice,
          status: o.state || o.status || 'در حال پردازش'
        };
      }
      return null;
    } catch (err) {
      showError(`خطا در استعلام سفارش از سرور: ${err.message}`);
      return null;
    }
  }, [showError]);

  // 8. Product Operations (Admin)
  const addProduct = useCallback(async (productData) => {
    try {
      const res = await productsApi.createProduct({
        name: productData.name,
        description: productData.description,
        originalPrice: Number(productData.price),
        discountPercent: Number(productData.discountPercent || 0),
        countInStock: Number(productData.stock || 20),
        imageBase64: productData.imageBase64 || productData.image
      });

      const created = res?.data || res?.product || res;
      if (!created || (!created._id && !created.id)) {
        throw new Error('پاسخ معتبری از سرور دریافت نشد.');
      }

      const newProd = {
        ...created,
        id: created._id || created.id,
        _id: created._id || created.id,
        price: Number(created.price || created.originalPrice || productData.price),
        originalPrice: Number(created.originalPrice || productData.price),
        stock: Number(created.countInStock || productData.stock || 20),
        rating: created.rating || 5,
        reviewsCount: created.reviewsCount || 0,
        image: created.image || productData.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
      };

      setProducts((prev) => [newProd, ...prev]);
      showSuccess('محصول جدید با موفقیت در سرور ثبت شد.');
      return newProd;
    } catch (err) {
      showError(`خطا در ثبت محصول در سرور: ${err.message}`);
      throw err;
    }
  }, [showSuccess, showError]);

  const updateProduct = useCallback(async (id, updatedData) => {
    try {
      await productsApi.updateProduct(id, updatedData);
      setProducts((prev) => prev.map((p) => ((p.id === id || p._id === id) ? { ...p, ...updatedData } : p)));
      showSuccess('اطلاعات محصول در سرور بروزرسانی شد.');
    } catch (err) {
      showError(`خطا در بروزرسانی محصول: ${err.message}`);
      throw err;
    }
  }, [showSuccess, showError]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      showToast('محصول از سرور حذف گردید.', 'info');
    } catch (err) {
      showError(`خطا در حذف محصول از سرور: ${err.message}`);
      throw err;
    }
  }, [showToast, showError]);

  return (
    <CartContext.Provider
      value={{
        isApiReady: true,
        isLoadingApi,
        apiError,
        products,
        setProducts,
        refreshProductsFromApi,
        sliders,
        heroSlides: sliders,
        reviews,
        setReviews,
        categories,
        selectedCategory,
        setSelectedCategory,
        storeInfo: STORE_INFO,
        trustItems: TRUST_ITEMS,
        brandStory: BRAND_STORY,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        showSuccess,
        showError,
        dismissToast,
        addProduct,
        updateProduct,
        deleteProduct,

        // Cart
        cart,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        setOrders,
        cartSubtotal,
        cartCount,
        discountAmount: 0,
        shippingFee,
        finalTotal,
        addToCart,
        updateCartQuantity,
        updateQuantity: updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        addOrder: createOrder,
        updateOrderStatus,
        deleteOrder,
        trackOrder
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
