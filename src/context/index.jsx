import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastContainer from '../components/toast';
import { authApi, normalizeUser } from '../api/auth.api';
import { productsApi } from '../api/products.api';
import { amazingProductsApi } from '../api/amazing.api';
import { ordersApi, normalizeOrder } from '../api/orders.api';
import { slidesApi } from '../api/slides.api';
import { storeApi } from '../api/store.api';
import { getStoredToken, setStoredToken } from '../api/client';

const AppContext = createContext();

const STORAGE_KEYS = {
  USER_ID: 'tala_rice_user_id',
  CART: 'tala_rice_cart_cache'
};

export function AppProvider({ children }) {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem('tala_rice_token');
      if (storedToken) {
        const cachedUser = localStorage.getItem('tala_rice_user');
        return cachedUser ? JSON.parse(cachedUser) : null;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Cart & Order State
  const [cart, setCart] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CART);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState([]);

  // Catalog & Store State
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [amazingProducts, setAmazingProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [brandStory, setBrandStory] = useState({});
  const [trustItems, setTrustItems] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiError, setApiError] = useState(null);

  const categories = useMemo(() => {
    const defaultCategories = [
      { id: 'tarom', name: 'برنج طارم' },
      { id: 'hashemi', name: 'برنج هاشمی' },
      { id: 'sadri', name: 'برنج صدری' },
      { id: 'fajr', name: 'برنج فجر' },
      { id: 'kamfirooz', name: 'برنج کامفیروز' },
      { id: 'smoked', name: 'برنج دودی' }
    ];

    const productCategories = new Set();
    products.forEach((product) => {
      if (product.category) {
        productCategories.add(product.category);
      }
    });

    const result = [...defaultCategories];
    productCategories.forEach((categoryId) => {
      if (!result.some((category) => category.id === categoryId)) {
        let name = categoryId;
        if (categoryId === 'hashemi') name = 'برنج هاشمی';
        else if (categoryId === 'tarom') name = 'برنج طارم';
        else if (categoryId === 'sadri') name = 'برنج صدری';
        else if (categoryId === 'fajr') name = 'برنج فجر';
        else if (categoryId === 'kamfirooz') name = 'برنج کامفیروز';
        else if (categoryId === 'smoked') name = 'برنج دودی';
        else if (categoryId === 'all') return;

        result.push({ id: categoryId, name });
      }
    });

    return result;
  }, [products]);

  const refreshProductsFromApi = useCallback(async () => {
    setIsLoadingData(true);
    setApiError(null);
    try {
      const [productResponse, slideResponse, amazingResponse] = await Promise.allSettled([
        productsApi.getAll(),
        slidesApi.getAll(),
        amazingProductsApi.getAll()
      ]);

      if (productResponse.status === 'fulfilled' && productResponse.value) {
        setProducts(Array.isArray(productResponse.value) ? productResponse.value : (productResponse.value.products || []));
      } else if (productResponse.status === 'rejected') {
        setApiError('خطا در بارگذاری محصولات');
      }

      if (slideResponse.status === 'fulfilled' && slideResponse.value) {
        setSlides(Array.isArray(slideResponse.value) ? slideResponse.value : []);
      }

      if (amazingResponse.status === 'fulfilled' && amazingResponse.value) {
        setAmazingProducts(Array.isArray(amazingResponse.value) ? amazingResponse.value : []);
      }
    } catch (error) {
      setApiError(error.message || 'خطا در بارگذاری اطلاعات');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const triggerNotification = useCallback((message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('tala-toast', { detail: { message, type } }));
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.debug('Failed to save cart cache', error);
    }
  }, [cart]);

  // Initial load gate to prevent duplicates
  const initialLoadStarted = useRef(false);

  // Initial load
  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;

    let isMounted = true;
    const token = getStoredToken();

    async function initializeAppData() {
      setIsLoadingData(true);

      if (token) {
        try {
          const response = await authApi.getMe();
          if (isMounted) {
            const normalized = response?.user || normalizeUser(response);
            if (normalized) {
              setCurrentUser(normalized);
              const userId = normalized.id || normalized._id;
              if (userId) {
                localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
              }
            }
          }
        } catch (error) {
          console.debug('Auth sync failed on mount:', error.message);
          if (error.status === 401 || error.status === 403) {
            setStoredToken(null);
            try {
              localStorage.removeItem('tala_rice_user');
              localStorage.removeItem(STORAGE_KEYS.USER_ID);
            } catch {
              // ignore
            }
            setCurrentUser(null);
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

      try {
        const [productResponse, slideResponse, infoResponse, storyResponse, trustResponse, amazingResponse] = await Promise.allSettled([
          productsApi.getAll(),
          slidesApi.getAll(),
          storeApi.getStoreInfo(),
          storeApi.getBrandStory(),
          storeApi.getTrustItems(),
          amazingProductsApi.getAll()
        ]);

        if (isMounted) {
          if (productResponse.status === 'fulfilled' && productResponse.value) {
            setProducts(Array.isArray(productResponse.value) ? productResponse.value : (productResponse.value.products || []));
          }
          if (slideResponse.status === 'fulfilled' && slideResponse.value) {
            setSlides(Array.isArray(slideResponse.value) ? slideResponse.value : []);
          }
          if (infoResponse.status === 'fulfilled' && infoResponse.value) {
            setStoreInfo(infoResponse.value);
          }
          if (storyResponse.status === 'fulfilled' && storyResponse.value) {
            setBrandStory(storyResponse.value);
          }
          if (trustResponse.status === 'fulfilled' && trustResponse.value) {
            setTrustItems(trustResponse.value);
          }
          if (amazingResponse.status === 'fulfilled' && amazingResponse.value) {
            setAmazingProducts(Array.isArray(amazingResponse.value) ? amazingResponse.value : []);
          }
        }
      } catch (fetchError) {
        console.debug('Failed to load catalog/store data:', fetchError);
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

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      triggerNotification('نشست کاربری شما منقضی شده است یا نیاز به ورود با دسترسی مدیر دارید (خطای ۴۰۱).', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [triggerNotification]);

  const loginUser = useCallback(async (phone, password) => {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanPhone || !cleanPassword) {
      return { success: false, message: 'لطفاً شماره موبایل و رمز عبور را وارد کنید.' };
    }

    setIsLoadingAuth(true);
    try {
      const response = await authApi.login({ phone: cleanPhone, password: cleanPassword });
      const userObject = response?.user || normalizeUser(response);
      if (!userObject) throw new Error(response?.message || 'پاسخ نامعتبر از سرور.');

      const token = response?.token || response?.data?.token;
      if (token) setStoredToken(token);
      const userId = userObject.id || userObject._id;
      if (userId) localStorage.setItem(STORAGE_KEYS.USER_ID, userId);

      setCurrentUser(userObject);
      triggerNotification(`خوش آمدید، ${userObject.name || 'کاربر گرامی'}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObject };
    } catch (error) {
      setIsLoadingAuth(false);
      triggerNotification(error.message, 'error');
      return { success: false, message: error.message };
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
      const response = await authApi.register({
        name: cleanName || `کاربر ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        password: cleanPassword
      });
      const userObject = response?.user || normalizeUser(response);
      if (!userObject) throw new Error(response?.message || 'پاسخ نامعتبر از سرور.');

      const token = response?.token || response?.data?.token;
      if (token) setStoredToken(token);
      const userId = userObject.id || userObject._id;
      if (userId) localStorage.setItem(STORAGE_KEYS.USER_ID, userId);

      setCurrentUser(userObject);
      triggerNotification(`ثبت‌نام با موفقیت انجام شد: ${userObject.name}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObject };
    } catch (error) {
      setIsLoadingAuth(false);
      triggerNotification(error.message, 'error');
      return { success: false, message: error.message };
    }
  }, [triggerNotification]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authApi.updateProfile(profileData);
      const updated = response?.user || normalizeUser(response) || { ...currentUser, ...profileData };
      setCurrentUser(updated);
      triggerNotification('پروفایل با موفقیت به‌روزرسانی شد.', 'success');
      return { success: true, user: updated };
    } catch (error) {
      triggerNotification(error.message, 'error');
      return { success: false, message: error.message };
    }
  }, [currentUser, triggerNotification]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      triggerNotification('رمز عبور با موفقیت تغییر یافت.', 'success');
      return { success: true };
    } catch (error) {
      triggerNotification(error.message, 'error');
      return { success: false, message: error.message };
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
  const addToCart = useCallback((product, quantity = 1) => {
    const targetId = product.id || product._id;
    setCart((previous) => {
      const existingIndex = previous.findIndex((item) => (item.id || item._id) === targetId);
      if (existingIndex > -1) {
        const updated = [...previous];
        const newQuantity = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQuantity };
        triggerNotification('تعداد محصول در سبد خرید افزایش یافت.', 'success');
        return updated;
      } else {
        triggerNotification('محصول به سبد خرید اضافه شد.', 'success');
        return [...previous, { ...product, quantity }];
      }
    });
  }, [triggerNotification]);

  const removeFromCart = useCallback((productId) => {
    setCart((previous) => previous.filter((item) => (item.id || item._id) !== productId));
    triggerNotification('محصول از سبد خرید حذف شد.', 'info');
  }, [triggerNotification]);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((previous) =>
      previous.map((item) => ((item.id || item._id) === productId ? { ...item, quantity } : item))
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
      const response = await ordersApi.create(payload);
      const newOrder = normalizeOrder(response);
      setOrders((previous) => [newOrder, ...previous]);
      clearCart();
      triggerNotification('سفارش شما با موفقیت ثبت شد!', 'success');
      return { success: true, order: newOrder };
    } catch (error) {
      triggerNotification(error.message || 'خطا در ثبت سفارش', 'error');
      return { success: false, message: error.message };
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
    goBack: () => navigate(-1),
    showToast: triggerNotification,
    showSuccess: (message) => triggerNotification(message, 'success'),
    showError: (message) => triggerNotification(message, 'error'),
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
