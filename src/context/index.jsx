import React, { createContext, useContext, useState, useEffect } from 'react';
import data from '../api/data.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products] = useState(data.products || []);
  const [articles] = useState(data.articles || []);
  const [reviews] = useState(data.reviews || []);
  const [coupons] = useState(data.coupons || []);
  const [categories] = useState(data.categories || []);
  const [trustItems] = useState(data.trustItems || []);
  const [heroSlides] = useState(data.heroSlides || []);
  const [brandStory] = useState(data.brandStory || {});
  const [testTips] = useState(data.testTips || []);

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tala_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ORD-9842',
          date: '۱۴۰۳/۰۵/۲۴',
          items: [
            {
              product: data.products[0],
              quantity: 1,
              weightKg: 10
            }
          ],
          totalAmount: 1200000,
          discountAmount: 0,
          shippingFee: 0,
          finalAmount: 1200000,
          status: 'processing',
          trackingCode: 'TRK-8874125',
          paymentMethod: 'gateway',
          address: {
            recipientName: 'محمد رضایی',
            phone: '09171234567',
            fullAddress: 'شیراز، خیابان ارم، کوچه ۱۲، پلاک ۴'
          }
        }
      ];
    } catch {
      return [];
    }
  });

  const [addresses] = useState([
    {
      id: 'addr-1',
      title: 'منزل شخصی',
      recipientName: 'محمد رضایی',
      phone: '۰۹۱۷ ۱۲۳ ۴۵۶۷',
      province: 'فارس',
      city: 'شیراز',
      postalCode: '۷۱۹۴۷۱۲۳۴۵',
      fullAddress: 'شیراز، بلوار ارم، کوچه ۱۲، پلاک ۴، زنگ ۲',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'دفتر شرکت',
      recipientName: 'محمد رضایی',
      phone: '۰۹۱۷ ۱۲۳ ۴۵۶۷',
      province: 'فارس',
      city: 'شیراز',
      postalCode: '۷۱۸۵۵۹۸۷۶۵',
      fullAddress: 'شیراز، خیابان ملاصدرا، ساختمان میلاد، طبقه سوم',
      isDefault: false
    }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('tala_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tala_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (product, weightKg = null, quantity = 1) => {
    const selectedWeight = weightKg || product.weight;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.weightKg === selectedWeight
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, weightKg: selectedWeight, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId, weightKg, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.weightKg === weightKg
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, weightKg) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.weightKg === weightKg)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const found = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!found) {
      return { success: false, message: 'کد تخفیف نامعتبر است.' };
    }
    if (found.minSpend && cartTotalAmount < found.minSpend) {
      return {
        success: false,
        message: `این کد برای خریدهای بالای ${found.minSpend.toLocaleString('fa-IR')} تومان فعال می‌شود.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `کد تخفیف ${found.discountPercent}٪ با موفقیت اعمال شد.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartTotalAmount = cart.reduce((sum, item) => {
    const unitPrice = (item.product.price / item.product.weight) * item.weightKg;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const discountAmount = appliedCoupon
    ? Math.round((cartTotalAmount * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartTotalAmount > 1000000 || cartTotalAmount === 0 ? 0 : 45000;

  const finalAmount = Math.max(0, cartTotalAmount - discountAmount + shippingFee);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      items: [...cart],
      totalAmount: cartTotalAmount,
      discountAmount,
      shippingFee,
      finalAmount,
      status: 'processing',
      trackingCode: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      ...orderData
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesWeight =
      selectedWeightFilter === 'all' ||
      p.weight.toString() === selectedWeightFilter;

    return matchesSearch && matchesCategory && matchesWeight;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  return (
    <AppContext.Provider
      value={{
        products,
        articles,
        reviews,
        coupons,
        categories,
        trustItems,
        heroSlides,
        brandStory,
        testTips,
        activeTab,
        setActiveTab,
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
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        cart,
        cartCount,
        cartTotalAmount,
        discountAmount,
        shippingFee,
        finalAmount,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        orders,
        createOrder,
        addresses
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
