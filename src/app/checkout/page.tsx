'use client';

import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowRight, MapPin, UserCheck, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Shipping address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fallback view if user is unauthenticated
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="bg-gray-50 min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Please log in or create an account to proceed with checkout and secure your order.
          </p>
          <Link
            href="/login?callbackUrl=/checkout"
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg"
          >
            <span>Log In to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    const shippingAddress = {
      street: street || '123 Main Street',
      city: city || 'New York',
      zip: zip || '10001',
      country: country || 'United States',
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setAuthError(data.error || 'Authentication required. Please log in.');
        setLoading(false);
        router.push('/login?callbackUrl=/checkout');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Payment process failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-500 flex items-center justify-center gap-2 text-sm font-medium">
            <Lock className="w-4 h-4 text-green-600" /> Powered by Stripe Test Gateway
          </p>
          
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Authenticated as {session.user.name || session.user.email}</span>
          </div>
        </div>

        {authError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Order Summary */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Shoe Street"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="10001"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Order Review */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Order Review
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
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

          {/* Right Column: Payment */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" /> Payment
              </h2>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Clicking proceed will simulate or process test payment and record your order directly in Neon Database under your user account.
              </p>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black hover:bg-gray-800 active:scale-[0.98] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-black/10 disabled:bg-gray-400"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <span>Complete Order (${getTotal().toFixed(2)})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-700">
                  <ShieldCheck className="w-4 h-4" /> Strictly Authenticated Order
                </p>
                <p className="text-blue-800/80">
                  Your order will be linked to user ID <span className="font-mono font-bold text-blue-950">{session.user.email}</span> in Neon Database.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
