'use client';

import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Tag, Check, X, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
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

  useEffect(() => setMounted(true), []);

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
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-[75vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-[#FEE715] text-black rounded-3xl border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black uppercase text-zinc-900 mb-3">Your Bag is Empty</h1>
          <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
            Looks like you haven't copped any sneakers yet. Check out our fresh streetwear drops.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider py-4 px-8 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          >
            Explore Street Drops <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const checkoutUrl = appliedCoupon
    ? `/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
    : '/checkout';

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24 text-zinc-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
            <Flame className="w-3.5 h-3.5 fill-black" />
            STREET BAG
          </div>
          <h1 className="text-4xl font-black uppercase text-zinc-900 mb-1">Shopping Bag</h1>
          <p className="text-zinc-500 font-bold text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-3xl border-2 border-zinc-200 shadow-sm hover:border-black transition-all flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-28 h-28 bg-[#F4F4F5] rounded-2xl overflow-hidden shrink-0 p-3 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-extrabold text-xl text-zinc-900">{item.name}</h3>
                      <p className="text-xs font-bold text-zinc-500 mt-0.5">
                        Size: <span className="bg-[#FEE715] text-black font-black px-1.5 py-0.5 rounded text-[11px]">{item.size}</span>
                      </p>
                    </div>
                    <p className="font-black text-xl text-zinc-950">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-black uppercase tracking-wider text-zinc-600">Qty:</label>
                      <select 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="border-2 border-zinc-200 rounded-xl px-3 py-1.5 font-bold text-zinc-900 bg-zinc-50 hover:border-black focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-zinc-400 hover:text-red-600 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary & Coupon */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Promo Code Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-zinc-200 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-black" /> Apply Promo Code
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-emerald-800 font-black text-xs uppercase">
                      <Check className="w-4 h-4 text-emerald-600" /> {appliedCoupon.code} APPLIED
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium">{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-800 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. FIRST10, DRIP15"
                      className="flex-1 uppercase font-bold text-xs bg-zinc-100 border-2 border-zinc-200 px-3.5 py-2.5 rounded-xl focus:bg-white focus:border-black focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponInput.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="bg-black hover:bg-zinc-800 text-[#FEE715] font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition disabled:opacity-50"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      ⚠️ {couponError}
                    </p>
                  )}

                  {couponSuccess && (
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      {couponSuccess}
                    </p>
                  )}

                  {/* Quick Coupon Chips */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Available Streetwear Codes:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['FIRST10', 'DRIP15', 'BEWAKOOF'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleApplyCoupon(c)}
                          className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 hover:bg-[#FEE715] hover:text-black text-zinc-700 border border-zinc-300 px-2.5 py-1 rounded-lg transition"
                        >
                          ⚡ {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm sticky top-28">
              <h3 className="text-xl font-black uppercase text-zinc-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3.5 mb-6 text-xs font-bold text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-black">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-black text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-extrabold text-zinc-900">$0.00</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-zinc-100 mb-6">
                <div className="flex justify-between items-center text-lg font-black text-zinc-900">
                  <span>Total Due</span>
                  <span className="text-2xl text-black bg-[#FEE715] px-2.5 py-0.5 rounded-xl border border-black">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link 
                href={checkoutUrl}
                className="w-full bg-[#101820] hover:bg-black active:scale-[0.98] text-[#FEE715] font-black uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)]"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-6 space-y-2 pt-6 border-t border-zinc-100 text-[11px] font-bold text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-800" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-zinc-800" />
                  <span>Free Express Delivery &amp; 7-Day Swaps</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
