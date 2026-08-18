import React from 'react';
import { AppProvider } from './context';
import { Header } from './components/header';
import { Main } from './components/main';
import { BottomNav } from './components/bottomNav';
import { CartDrawer } from './components/cartDrawer';
import { CheckoutModal } from './components/checkoutModal';
import { ProductDetailModal } from './components/productDetailModal';
import { SearchModal } from './components/searchModal';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#042a1b] text-white max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-[#d4af37]/40">
        <Header />
        <Main />
        <BottomNav />
        <CartDrawer />
        <CheckoutModal />
        <ProductDetailModal />
        <SearchModal />
      </div>
    </AppProvider>
  );
}
