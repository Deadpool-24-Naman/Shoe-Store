'use client';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[75vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added any shoes to your collection yet. Start exploring our latest drops.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Shopping Bag</h1>
        <p className="text-gray-500 mb-10">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-28 h-28 bg-[#F7F7F7] rounded-xl overflow-hidden shrink-0 p-2 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">Size: <span className="text-gray-900 font-semibold">{item.size}</span></p>
                    </div>
                    <p className="font-extrabold text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Qty:</label>
                      <select 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 font-semibold text-gray-800 bg-gray-50 hover:border-gray-900 focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-gray-400 hover:text-red-600 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span className="text-2xl text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-8 space-y-3 pt-6 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gray-700" />
                  <span>Encrypted 256-bit SSL security</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-gray-700" />
                  <span>Free express delivery & easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
