'use client';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment process failed. Please check setup.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Checkout error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-500 flex items-center justify-center gap-2 text-sm font-medium">
            <Lock className="w-4 h-4 text-green-600" /> Powered by Stripe Test Gateway
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Order Summary */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Order Review
              </h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#F7F7F7] rounded-xl overflow-hidden p-1 flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Size {item.size} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total Due</span>
                  <span className="text-2xl text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="md:col-span-5">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" /> Payment
              </h2>
              
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Clicking proceed will redirect you to the Stripe Test Checkout portal where you can test payments safely.
              </p>

              <form onSubmit={handleCheckout}>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 active:scale-[0.98] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-black/10 disabled:bg-gray-400"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Connecting to Stripe...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay ${getTotal().toFixed(2)}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-700">
                  <ShieldCheck className="w-4 h-4" /> Demo Test Gateway Mode
                </p>
                <p className="text-blue-800/80">Use standard Stripe test cards like 4242 4242 4242 4242 during test checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
