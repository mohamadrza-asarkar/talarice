import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';
import Auth from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';
import { Layout, SimpleLayout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { useApp } from './context/index.jsx';
// No maintenance screens

function App() {
  const { serverHealth, checkHealth } = useApp();

  // در صورتی که سرور پاسخگو و سالم بود، بدون هیچ لودینگ یا مانعی برنامه کارش را انجام می‌دهد
  return (
    <Routes>
      {/* صفحات دارای لایه استاندارد همراه با هدر و ناوبری */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        {/* ریدایرکت خودکار مسیر بلاگ به کاتالوگ محصولات */}
        <Route path="/blog" element={<Navigate to="/catalog" replace />} />
        
        {/* مسیر پروفایل: در صورت عدم ورود، کاربر به /auth هدایت می‌شود */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* صفحه ورود / ثبت‌نام */}
        <Route path="/auth" element={<Auth />} />
      </Route>

      {/* صفحات ساده تک‌ستونه (محصول و جستجو) */}
      <Route element={<SimpleLayout />}>
        <Route path="/product/:id" element={<Product />} />
        <Route path="/search" element={<Search />} />
      </Route>

      {/* مسیرهای پنل مدیریت: حفاظت کامل و محدود به مدیران ارشد */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* تغییر مسیر خودکار برای آدرس‌های نامعتبر */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
