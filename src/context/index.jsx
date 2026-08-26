import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { authAPI, productsAPI, ordersAPI, slidersAPI, blogAPI } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Data States from Backend
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [articles, setArticles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const isAuthenticated = Boolean(token && currentUser);
  const isAdmin = Boolean(currentUser?.role === 'admin' || currentUser?.isAdmin);

  // 3. Cart State (Local Storage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 4. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch Initial Data from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, slideRes, postRes] = await Promise.allSettled([
        productsAPI.getAll(),
        slidersAPI.getAll(),
        blogAPI.getAll(),
      ]);

      if (prodRes.status === 'fulfilled') {
        const data = prodRes.value;
        const list = Array.isArray(data) ? data : (data?.products || data?.data || []);
        setProducts(list);
      }

      if (slideRes.status === 'fulfilled') {
        const data = slideRes.value;
        const list = Array.isArray(data) ? data : (data?.slides || data?.data || []);
        setHeroSlides(list);
      }

      if (postRes.status === 'fulfilled') {
        const data = postRes.value;
        const list = Array.isArray(data) ? data : (data?.posts || data?.articles || data?.data || []);
        setArticles(list);
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auth Operations
  const loginUser = async (phoneOrEmail, password) => {
    try {
      const res = await authAPI.login(phoneOrEmail, password);
      const user = res?.user || res?.data?.user || res;
      const userToken = res?.token || res?.data?.token;

      if (userToken) {
        setToken(userToken);
        localStorage.setItem('token', userToken);
      }

      const normalizedUser = {
        ...user,
        id: user?._id || user?.id,
        role: user?.role || (user?.isAdmin ? 'admin' : 'user'),
      };

      setCurrentUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser, message: 'ورود با موفقیت انجام شد' };
    } catch (err) {
      return { success: false, message: err?.message || 'اطلاعات ورود نامعتبر است' };
    }
  };

  const registerUser = async (name, phone, password) => {
    try {
      const res = await authAPI.register({ name, phone, password });
      const user = res?.user || res?.data?.user || res;
      const userToken = res?.token || res?.data?.token;

      if (userToken) {
        setToken(userToken);
        localStorage.setItem('token', userToken);
      }

      const normalizedUser = {
        ...user,
        id: user?._id || user?.id,
        role: user?.role || 'user',
      };

      setCurrentUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser, message: 'ثبت‌نام با موفقیت انجام شد' };
    } catch (err) {
      return { success: false, message: err?.message || 'خطا در ثبت‌نام کاربر' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Cart Operations
  const addToCart = (product, weightKg = 10, quantity = 1) => {
    const pWeight = weightKg || product.weight || 10;
    setCart((prev) => {
      const index = prev.findIndex(
        (item) => (item.product._id || item.product.id) === (product._id || product.id) && item.weightKg === pWeight
      );
      if (index > -1) {
        const next = [...prev];
        next[index].quantity += quantity;
        return next;
      }
      return [...prev, { product, weightKg: pWeight, quantity }];
    });
  };

  const updateCartQuantity = (productId, weightKg, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId && item.weightKg === weightKg
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, weightKg) => {
    setCart((prev) =>
      prev.filter(
        (item) => !((item.product._id || item.product.id) === productId && item.weightKg === weightKg)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Totals Calculation
  const cartTotalAmount = cart.reduce((sum, item) => {
    const baseWeight = item.product.weight || 10;
    const unitPrice = (item.product.price / baseWeight) * item.weightKg;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((cartTotalAmount * (appliedCoupon.discountPercent || 0)) / 100) : 0;
  const shippingFee = cartTotalAmount > 1000000 || cartTotalAmount === 0 ? 0 : 45000;
  const finalAmount = Math.max(0, cartTotalAmount - discountAmount + shippingFee);

  // Order Submission
  const createOrder = async (orderData) => {
    try {
      const payload = {
        products: cart.map((item) => ({
          product: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          weight: item.weightKg,
        })),
        totalPrice: finalAmount,
        ...orderData,
      };

      const res = await ordersAPI.create(payload);
      clearCart();
      return res;
    } catch (err) {
      console.error('Order creation error:', err);
      throw err;
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const name = p.name || '';
    const desc = p.description || '';
    const matchesSearch = !searchQuery.trim() || name.includes(searchQuery) || desc.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesWeight = selectedWeightFilter === 'all' || (p.weight && p.weight.toString() === selectedWeightFilter);
    return matchesSearch && matchesCategory && matchesWeight;
  });

  return (
    <AppContext.Provider
      value={{
        // Data
        products,
        heroSlides,
        articles,
        orders,
        loading,
        refreshData: fetchData,

        // Auth
        currentUser,
        isAuthenticated,
        isAdmin,
        token,
        loginUser,
        registerUser,
        logout,

        // Cart
        cart,
        cartCount,
        cartTotalAmount,
        discountAmount,
        shippingFee,
        finalAmount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedCoupon,
        setAppliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,

        // Filters & UI
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedWeightFilter,
        setSelectedWeightFilter,
        sortBy,
        setSortBy,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        selectedArticle,
        setSelectedArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export default AppContext;
