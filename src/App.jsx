import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Search from './pages/Search.jsx';
import Blog from './pages/Blog.jsx';
import Profile from './pages/Profile.jsx';
import Auth from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';
import { Layout, SimpleLayout } from './components/Layout.jsx';
import { InitialLoadingScreen } from './components/maintenanceScreen';
import { useApp } from './context';

function App() {
  const { serverHealth } = useApp();

  // Show only the 3-stalks loading animation until the server health check succeeds
  if (serverHealth.status !== 'healthy') {
    return <InitialLoadingScreen />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route element={<SimpleLayout />}>
        <Route path="/product/:id" element={<Product />} />
        <Route path="/search" element={<Search />} />
      </Route>

      <Route path="/admin/*" element={<Admin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

