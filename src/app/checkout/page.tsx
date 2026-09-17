'use client';

import { useCartStore } from '@/lib/store';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowRight, MapPin, UserCheck, AlertCircle, Tag, Check, X, Flame } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function CheckoutContent() {
  const { data: session, status } = useSession();
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get('coupon') || '';

  // Shipping address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
    value: number;
    type: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Auto-validate coupon from query params if passed from Cart
  useEffect(() => {
    if (initialCoupon) {
      handleApplyCoupon(initialCoupon);
    }
  }, [initialCoupon]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const subtotal = getTotal();
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, subtotal)
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          description: data.description,
          value: data.value,
          type: data.type,
        });
        setCouponSuccess(data.message);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code.');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Failed to validate coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Fallback view if user is unauthenticated
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="bg-[#FAFAFA] min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#FEE715] text-black rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase text-zinc-900 mb-2">Authentication Required</h2>
          <p className="text-zinc-500 text-xs font-medium mb-6 leading-relaxed">
            Please log in or create an account to proceed with checkout and secure your order.
          </p>
          <Link
            href="/login?callbackUrl=/checkout"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider py-4 rounded-xl transition-all border-2 border-black shadow-md"
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
          couponCode: appliedCoupon?.code || null,
          discountAmount,
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
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24 text-zinc-900">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Checkout Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
            <Flame className="w-3.5 h-3.5 fill-black" />
            FINAL STEP • SECURE CHECKOUT
          </div>
          <h1 className="text-4xl font-black uppercase text-zinc-900 mb-2">Checkout Details</h1>
          <p className="text-zinc-500 flex items-center justify-center gap-1.5 text-xs font-bold">
            <Lock className="w-4 h-4 text-emerald-600" /> Powered by Stripe Test Gateway
          </p>
          
          <div className="mt-3 inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
            <UserCheck className="w-4 h-4 text-black" />
            <span>Authenticated as {session.user.name || session.user.email}</span>
          </div>
        </div>

        {authError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Shipping & Order Summary */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping Address Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm">
              <h2 className="text-xl font-black uppercase text-zinc-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-black" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Shoe Street, Apt 4B"
                    className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="10001"
                      className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Order Review List */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm">
              <h2 className="text-xl font-black uppercase text-zinc-900 mb-6">
                Items in Order ({items.length})
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#F4F4F5] rounded-xl overflow-hidden p-1 flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-zinc-900">{item.name}</p>
                        <p className="text-xs font-bold text-zinc-500 mt-0.5">Size {item.size} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-sm text-zinc-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-zinc-100 space-y-3 text-xs font-bold text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-black">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-black text-emerald-600">FREE</span>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-zinc-900 pt-3 border-t-2 border-zinc-100">
                  <span>Total Payable</span>
                  <span className="text-2xl text-black bg-[#FEE715] px-2.5 py-0.5 rounded-xl border border-black">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Promo Code & Payment */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Code Input on Checkout */}
            <div className="bg-white p-6 rounded-3xl border-2 border-zinc-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-black" /> Promo / Coupon Code
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-emerald-800 font-black text-xs uppercase">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {appliedCoupon.code} APPLIED
                    </div>
                    <p className="text-[10px] text-emerald-700 font-medium">{appliedCoupon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-full hover:bg-emerald-100 text-emerald-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. FIRST10, DRIP15"
                      className="flex-1 uppercase font-bold text-xs bg-zinc-100 border-2 border-zinc-200 px-3 py-2 rounded-xl focus:bg-white focus:border-black focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponInput.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="bg-black hover:bg-zinc-800 text-[#FEE715] font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                      ⚠️ {couponError}
                    </p>
                  )}

                  {couponSuccess && (
                    <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      {couponSuccess}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm sticky top-28">
              <h2 className="text-xl font-black uppercase text-zinc-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-black" /> Payment Simulation
              </h2>

              <p className="text-zinc-500 text-xs font-medium mb-6 leading-relaxed">
                Clicking complete order will record your order in Neon Database under your user account with authenticated session security.
              </p>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#101820] hover:bg-black active:scale-[0.98] text-[#FEE715] font-black uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)] disabled:bg-zinc-400"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FEE715] border-t-transparent"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <span>Complete Order (${finalTotal.toFixed(2)})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-800 space-y-1">
                <p className="font-black flex items-center gap-1.5 text-zinc-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Strictly Authenticated Order
                </p>
                <p className="text-zinc-600 text-[11px] font-medium">
                  Your order is linked to verified user account <span className="font-mono font-bold text-black">{session.user.email}</span>.
                </p>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
