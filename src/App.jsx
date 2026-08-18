import React from 'react';
import { AppProvider } from './context';
import { Header } from './components/header';
import { Main } from './components/main';
import { BottomNav } from './components/bottomNav';
import { CartDrawer } from './components/cartDrawer';
import { CheckoutModal } from './components/checkoutModal';
import { ProductDetailModal } from './components/productDetailModal';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-[#d4af37]/30">
        <Header />
        <Main />
        <BottomNav />
        <CartDrawer />
        <CheckoutModal />
        <ProductDetailModal />
      </div>
    </AppProvider>
  );
}
