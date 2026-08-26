import React, { useState } from 'react';
import { useApp } from '../../context';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, clearCart, cartTotalAmount, setIsCheckoutOpen } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

      <div className="relative w-full max-w-sm bg-[#073b27] border-r border-[#d4af37]/30 h-full flex flex-col z-10 text-white">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
            <i className="fa-solid fa-cart-shopping" />
            <span>سبد خرید شما ({cart.length})</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
              <i className="fa-solid fa-cart-arrow-down text-4xl text-[#d4af37]/50" />
              <p className="text-sm">سبد خرید شما خالی است.</p>
            </div>
          ) : (
            cart.map((item) => {
              const id = item.product._id || item.product.id;
              return (
                <div key={`${id}-${item.weightKg}`} className="bg-[#042a1b] border border-white/10 rounded-xl p-3 flex gap-3 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="text-xs font-bold line-clamp-1">{item.product.name}</h4>
                    <span className="text-[11px] text-[#d4af37]">کیسه {item.weightKg} کیلویی</span>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2 bg-[#073b27] border border-white/10 rounded-lg px-2 py-0.5">
                        <button onClick={() => updateCartQuantity(id, item.weightKg, item.quantity - 1)} className="text-xs text-gray-300">-</button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(id, item.weightKg, item.quantity + 1)} className="text-xs text-gray-300">+</button>
                      </div>
                      <button onClick={() => removeFromCart(id, item.weightKg)} className="text-red-400 hover:text-red-300 text-xs">
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-[#042a1b] flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">مجموع:</span>
              <span className="font-black text-[#d4af37]">{Number(cartTotalAmount).toLocaleString('fa-IR')} تومان</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-[#d4af37] text-[#042a1b] py-3 rounded-xl font-black text-sm hover:bg-yellow-400 transition-colors"
            >
              تکمیل سفارش
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
