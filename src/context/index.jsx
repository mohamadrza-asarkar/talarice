import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastContainer from '../components/toast';
import {
  authApi,
  productsApi,
  amazingProductsApi,
  ordersApi,
  slidesApi,
  cartApi,
  reviewsApi,
  storeApi,
  getStoredToken,
  setStoredToken,
  normalizeUser,
  normalizeProduct,
  normalizeAmazingProduct,
  normalizeOrder,
  normalizeSlide
} from '../api';

const AppContext = createContext();

const STORAGE_KEYS = {
  USER_ID: 'tala_rice_user_id',
  CART: 'tala_rice_cart_cache'
};

export function getOrderStatusInfo(status) {
  const norm = String(status || '').toLowerCase().trim();
  switch (norm) {
    case 'تحویل شده':
    case 'delivered':
      return { label: 'تحویل شده', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
    case 'ارسال شده':
    case 'در حال ارسال':
    case 'shipped':
      return { label: 'در حال ارسال', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' };
    case 'لغو شده':
    case 'cancelled':
      return { label: 'لغو شده', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    default:
      return { label: 'در حال پردازش', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  }
}

export function AppProvider({ children }) {
  const navigate = useNavigate();

  // Unified States
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [cart, setCart] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CART);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [amazingProducts, setAmazingProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [brandStory, setBrandStory] = useState({});
  const [trustItems, setTrustItems] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Catalog Filters & Categories
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiError, setApiError] = useState(null);

  const categories = useMemo(() => {
    const defaultCats = [
      { id: 'tarom', name: 'برنج طارم' },
      { id: 'hashemi', name: 'برنج هاشمی' },
      { id: 'sadri', name: 'برنج صدری' },
      { id: 'fajr', name: 'برنج فجر' },
      { id: 'kamfirooz', name: 'برنج کامفیروز' },
      { id: 'smoked', name: 'برنج دودی' }
    ];
    
    const productCats = new Set();
    products.forEach(p => {
      if (p.category) {
        productCats.add(p.category);
      }
    });
    
    const result = [...defaultCats];
    productCats.forEach(catId => {
      if (!result.some(c => c.id === catId)) {
        let name = catId;
        if (catId === 'hashemi') name = 'برنج هاشمی';
        else if (catId === 'tarom') name = 'برنج طارم';
        else if (catId === 'sadri') name = 'برنج صدری';
        else if (catId === 'fajr') name = 'برنج فجر';
        else if (catId === 'kamfirooz') name = 'برنج کامفیروز';
        else if (catId === 'smoked') name = 'برنج دودی';
        else if (catId === 'all') return;
        
        result.push({ id: catId, name });
      }
    });
    
    return result;
  }, [products]);

  const refreshProductsFromApi = useCallback(async () => {
    setIsLoadingData(true);
    setApiError(null);
    try {
      const [prodRes, slideRes, amazingRes] = await Promise.allSettled([
        productsApi.getAll(),
        slidesApi.getAll(),
        amazingProductsApi.getAll()
      ]);
      if (prodRes.status === 'fulfilled' && prodRes.value) {
        setProducts(Array.isArray(prodRes.value) ? prodRes.value : (prodRes.value.products || []));
      } else if (prodRes.status === 'rejected') {
        setApiError('خطا در بارگذاری محصولات');
      }
      if (slideRes.status === 'fulfilled' && slideRes.value) {
        setSlides(Array.isArray(slideRes.value) ? slideRes.value : []);
      }
      if (amazingRes.status === 'fulfilled' && amazingRes.value) {
        setAmazingProducts(Array.isArray(amazingRes.value) ? amazingRes.value : []);
      }
    } catch (err) {
      setApiError(err.message || 'خطا در بارگذاری اطلاعات');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Notification trigger
  const triggerNotification = useCallback((message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('tala-toast', { detail: { message, type } }));
  }, []);

  // Save cart cache locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.debug('Failed to save cart cache', e);
    }
  }, [cart]);

  // Initial Load: Token, User Profile, Products, Slides, Store Info
  useEffect(() => {
    let isMounted = true;
    const token = getStoredToken();
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);

    async function initializeAppData() {
      setIsLoadingData(true);

      // 1. Fetch Auth User if token exists
      if (token) {
        try {
          const res = await authApi.getMe();
          if (isMounted) {
            const normalized = res?.user || normalizeUser(res);
            if (normalized) {
              setCurrentUser(normalized);
              const uid = normalized.id || normalized._id;
              if (uid) {
                localStorage.setItem(STORAGE_KEYS.USER_ID, String(uid));
              }
            }
          }
        } catch (err) {
          console.debug('Auth sync failed on mount:', err.message);
          if (err.status === 401 || err.status === 403) {
            setStoredToken(null);
            localStorage.removeItem(STORAGE_KEYS.USER_ID);
          }
        } finally {
          if (isMounted) {
            setIsLoadingAuth(false);
          }
        }
      } else {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }

      // 2. Fetch Products, Slides, Store Info
      try {
        const [prodRes, slideRes, infoRes, storyRes, trustRes, amazingRes] = await Promise.allSettled([
          productsApi.getAll(),
          slidesApi.getAll(),
          storeApi.getStoreInfo(),
          storeApi.getBrandStory(),
          storeApi.getTrustItems(),
          amazingProductsApi.getAll()
        ]);

        if (isMounted) {
          if (prodRes.status === 'fulfilled' && prodRes.value) {
            setProducts(Array.isArray(prodRes.value) ? prodRes.value : (prodRes.value.products || []));
          }
          if (slideRes.status === 'fulfilled' && slideRes.value) {
            setSlides(Array.isArray(slideRes.value) ? slideRes.value : []);
          }
          if (infoRes.status === 'fulfilled' && infoRes.value) {
            setStoreInfo(infoRes.value);
          }
          if (storyRes.status === 'fulfilled' && storyRes.value) {
            setBrandStory(storyRes.value);
          }
          if (trustRes.status === 'fulfilled' && trustRes.value) {
            setTrustItems(trustRes.value);
          }
          if (amazingRes.status === 'fulfilled' && amazingRes.value) {
            setAmazingProducts(Array.isArray(amazingRes.value) ? amazingRes.value : []);
          }
        }
      } catch (fetchErr) {
        console.debug('Failed to load catalog/store data:', fetchErr);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    initializeAppData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auth actions
  const loginUser = useCallback(async (phone, password) => {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanPhone || !cleanPassword) {
      return { success: false, message: 'لطفاً شماره موبایل و رمز عبور را وارد کنید.' };
    }

    setIsLoadingAuth(true);
    try {
      const res = await authApi.login({ phone: cleanPhone, password: cleanPassword });
      const userObj = res?.user || normalizeUser(res);
      if (!userObj) throw new Error(res?.message || 'پاسخ نامعتبر از سرور.');

      if (res.token) setStoredToken(res.token);
      const uid = userObj.id || userObj._id;
      if (uid) localStorage.setItem(STORAGE_KEYS.USER_ID, String(uid));

      setCurrentUser(userObj);
      triggerNotification(`خوش آمدید، ${userObj.name || 'کاربر گرامی'}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObj };
    } catch (err) {
      setIsLoadingAuth(false);
      triggerNotification(err.message, 'error');
      return { success: false, message: err.message };
    }
  }, [triggerNotification]);

  const registerUser = useCallback(async (name, phone, password) => {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanPhone || !cleanPassword) {
      return { success: false, message: 'تکمیل شماره موبایل و رمز عبور الزامی است.' };
    }

    setIsLoadingAuth(true);
    try {
      const res = await authApi.register({
        name: cleanName || `کاربر ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        password: cleanPassword
      });
      const userObj = res?.user || normalizeUser(res);
      if (!userObj) throw new Error(res?.message || 'پاسخ نامعتبر از سرور.');

      if (res.token) setStoredToken(res.token);
      const uid = userObj.id || userObj._id;
      if (uid) localStorage.setItem(STORAGE_KEYS.USER_ID, String(uid));

      setCurrentUser(userObj);
      triggerNotification(`ثبت‌نام با موفقیت انجام شد: ${userObj.name}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObj };
    } catch (err) {
      setIsLoadingAuth(false);
      triggerNotification(err.message, 'error');
      return { success: false, message: err.message };
    }
  }, [triggerNotification]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      const updated = res?.user || normalizeUser(res) || { ...currentUser, ...profileData };
      setCurrentUser(updated);
      triggerNotification('پروفایل با موفقیت به‌روزرسانی شد.', 'success');
      return { success: true, user: updated };
    } catch (err) {
      triggerNotification(err.message, 'error');
      return { success: false, message: err.message };
    }
  }, [currentUser, triggerNotification]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      triggerNotification('رمز عبور با موفقیت تغییر یافت.', 'success');
      return { success: true };
    } catch (err) {
      triggerNotification(err.message, 'error');
      return { success: false, message: err.message };
    }
  }, [triggerNotification]);

  const logout = useCallback(() => {
    authApi.logout();
    setStoredToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    setCurrentUser(null);
    triggerNotification('از حساب کاربری خارج شدید.', 'info');
  }, [triggerNotification]);

  // Cart actions
  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id || item._id) === String(product.id || product._id));
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        triggerNotification('تعداد محصول در سبد خرید افزایش یافت.', 'success');
        return updated;
      } else {
        triggerNotification('محصول به سبد خرید اضافه شد.', 'success');
        return [...prev, { ...product, quantity: qty }];
      }
    });
  }, [triggerNotification]);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => String(item.id || item._id) !== String(productId)));
    triggerNotification('محصول از سبد خرید حذف شد.', 'info');
  }, [triggerNotification]);

  const updateCartQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (String(item.id || item._id) === String(productId) ? { ...item, quantity: qty } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = Number(item.dealPrice || item.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  // Order actions
  const createOrder = useCallback(async (orderData) => {
    try {
      const payload = {
        ...orderData,
        items: cart,
        products: cart,
        totalPrice: cartTotal
      };
      const res = await ordersApi.create(payload);
      const newOrd = normalizeOrder(res);
      setOrders((prev) => [newOrd, ...prev]);
      clearCart();
      triggerNotification('سفارش شما با موفقیت ثبت شد!', 'success');
      return { success: true, order: newOrd };
    } catch (err) {
      triggerNotification(err.message || 'خطا در ثبت سفارش', 'error');
      return { success: false, message: err.message };
    }
  }, [cart, cartTotal, clearCart, triggerNotification]);

  const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.isAdmin === true));
  const isAuthenticated = Boolean(currentUser && getStoredToken());

  const value = {
    // Auth
    currentUser,
    setCurrentUser,
    isAuthenticated,
    isAdmin,
    isLoadingAuth,
    loginUser,
    registerUser,
    updateProfile,
    changePassword,
    logout,
    login: loginUser,
    register: registerUser,

    // Cart
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateQuantity: updateCartQuantity,
    clearCart,
    cartCount,
    cartTotal,

    // Orders & Catalog Data
    orders,
    setOrders,
    createOrder,
    addOrder: createOrder,
    products,
    setProducts,
    slides,
    heroSlides: slides,
    amazingProducts,
    setAmazingProducts,
    storeInfo,
    brandStory,
    trustItems,
    isLoadingData,
    isLoadingApi: isLoadingData,
    apiError,
    refreshProductsFromApi,

    // Catalog Categories & Filters
    categories,
    selectedCategory,
    setSelectedCategory,

    // Helpers
    getOrderStatusInfo,
    goBack: () => navigate(-1),
    showToast: triggerNotification,
    showSuccess: (msg) => triggerNotification(msg, 'success'),
    showError: (msg) => triggerNotification(msg, 'error'),
    sliders: slides,
    setSliders: setSlides
  };

  return (
    <AppContext.Provider value={value}>
      <ToastContainer />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
