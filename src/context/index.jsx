import React, { createContext, useContext, useState, useEffect } from 'react';
import data from '../api/data.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products] = useState(data.products || []);
  const [recipes] = useState(data.recipes || []);
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  const addToCart = (product, weightKg = product.weight, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.weightKg === weightKg
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, weightKg, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, weightKg) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.weightKg === weightKg)
      )
    );
  };

  const updateQuantity = (productId, weightKg, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.weightKg === weightKg) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
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
      return { success: false, message: 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
    }
    const currentSubtotal = cart.reduce((sum, item) => {
      const unitPrice =
        item.weightKg === item.product.weight
          ? item.product.price
          : Math.round((item.product.price / item.product.weight) * item.weightKg);
      return sum + unitPrice * item.quantity;
    }, 0);

    if (found.minSpend && currentSubtotal < found.minSpend) {
      return {
        success: false,
        message: `این کد تخفیف برای سفارش‌های بالای ${found.minSpend.toLocaleString('fa-IR')} تومان است.`
      };
    }
    setAppliedCoupon(found);
    return {
      success: true,
      message: `کد تخفیف ${found.discountPercent}٪ با موفقیت اعمال شد.`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('fa-IR'),
      trackingCode: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'processing'
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice =
      item.weightKg === item.product.weight
        ? item.product.price
        : Math.round((item.product.price / item.product.weight) * item.weightKg);
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartSubtotal >= 2000000 || cartSubtotal === 0 ? 0 : 49000;
  const finalTotal = cartSubtotal - discountAmount + shippingFee;

  return (
    <AppContext.Provider
      value={{
        products,
        recipes,
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
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        addOrder,
        addresses,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        finalTotal
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
