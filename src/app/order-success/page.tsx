'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Package,
  MapPin,
  Tag,
  Truck,
  Calendar,
  MessageCircle,
  Mail,
  ShoppingBag,
  ArrowRight,
  X,
  Flame,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

interface OrderData {
  id: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: { street: string; city: string; zip: string; country: string } | null;
  createdAt: string;
}

interface LocalOrderCache {
  orderId: string;
  total: number;
  discountAmount: number;
  couponCode: string | null;
  items: OrderItem[];
  shippingAddress: { street: string; city: string; zip: string; country: string };
}

// WhatsApp / Email alert toast
function AlertToast({ onDismiss }: { onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 800);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-6 right-4 z-50 max-w-xs w-full transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-[#101820] border-2 border-[#FEE715] rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(254,231,21,1)]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEE715] flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-xs uppercase tracking-wider">Order Alert Sent!</p>
            <p className="text-zinc-300 text-[11px] font-medium mt-0.5 leading-relaxed">
              Order details &amp; tracking link sent to your WhatsApp / Email 📦
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#FEE715]">
                <Mail className="w-3 h-3" /> Email
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </div>
            </div>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
            className="p-1 rounded-full hover:bg-white/10 transition text-zinc-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderData | null>(null);
  const [localCache, setLocalCache] = useState<LocalOrderCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(true);
  const [confettiPieces] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: i % 3 === 0 ? '#FEE715' : i % 3 === 1 ? '#101820' : '#10B981',
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      size: `${6 + Math.random() * 8}px`,
      shape: i % 2 === 0 ? 'circle' : 'rect',
    }))
  );

  useEffect(() => {
    // Read cached order data from sessionStorage (set during checkout)
    const cached = sessionStorage.getItem('kicks_last_order');
    if (cached) {
      try {
        setLocalCache(JSON.parse(cached));
      } catch {}
    }

    if (!orderId) {
      setLoading(false);
      return;
    }

    // Fetch from API for full order detail
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) {
          const raw = data.order;
          setOrder({
            ...raw,
            items: (() => { try { return JSON.parse(raw.items || '[]'); } catch { return []; } })(),
            shippingAddress: (() => { try { return raw.shippingAddress ? JSON.parse(raw.shippingAddress) : null; } catch { return null; } })(),
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  // Estimated delivery: 5 business days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayItems: OrderItem[] = order?.items || localCache?.items || [];
  const displayTotal = order?.total ?? localCache?.total ?? 0;
  const displayDiscount = localCache?.discountAmount ?? 0;
  const displaySubtotal = displayDiscount > 0 ? displayTotal + displayDiscount : displayTotal;
  const displayCoupon = localCache?.couponCode ?? null;
  const displayAddress = order?.shippingAddress || localCache?.shippingAddress || null;
  const displayOrderId = orderId || localCache?.orderId || 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101820] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FEE715] mx-auto mb-4" />
          <p className="text-[#FEE715] font-black uppercase tracking-widest text-sm">Loading your order…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101820] pb-24 relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiPieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              top: '-20px',
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              animationName: 'confettiFall',
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          80% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s both; }
      `}</style>

      {/* Toast */}
      {showToast && <AlertToast onDismiss={() => setShowToast(false)} />}

      <div className="container mx-auto px-4 max-w-4xl pt-12">

        {/* Success Hero */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-[#FEE715] blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-28 h-28 mx-auto rounded-full bg-[#FEE715] border-4 border-[#FEE715] flex items-center justify-center check-pop shadow-[0_0_40px_rgba(254,231,21,0.5)]">
              <CheckCircle className="w-14 h-14 text-[#101820]" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              <Flame className="w-3.5 h-3.5" /> Order Confirmed
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-2">
              You&apos;re All Set!
            </h1>
            <p className="text-zinc-400 font-medium text-sm max-w-md mx-auto">
              Your kicks are being prepped for dispatch. You&apos;ll receive updates on your WhatsApp &amp; Email.
            </p>
            <div className="mt-4 inline-block bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1.5 text-zinc-400 text-xs font-mono">
              Order #{displayOrderId.slice(-10)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Items + Delivery */}
          <div className="lg:col-span-7 space-y-5">

            {/* Ordered Items */}
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-6">
              <h2 className="text-white font-black uppercase text-sm tracking-wider mb-5 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FEE715]" /> Items Ordered ({displayItems.length})
              </h2>
              <div className="space-y-4">
                {displayItems.length === 0 ? (
                  <p className="text-zinc-500 text-xs font-medium">No items found.</p>
                ) : (
                  displayItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-zinc-800 rounded-2xl p-3">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{item.name}</p>
                        <p className="text-zinc-400 text-[11px] font-bold mt-0.5">
                          Size {item.size} &bull; Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#FEE715] font-black text-sm shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-6">
              <h2 className="text-white font-black uppercase text-sm tracking-wider mb-5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FEE715]" /> Delivery Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-zinc-800 rounded-2xl p-3">
                  <Calendar className="w-4 h-4 text-[#FEE715] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-wider">Estimated Delivery</p>
                    <p className="text-white font-bold text-sm mt-0.5">{formattedDelivery}</p>
                    <p className="text-emerald-400 text-[10px] font-bold mt-0.5">Express Shipping · FREE</p>
                  </div>
                </div>
                {displayAddress && (
                  <div className="flex items-start gap-3 bg-zinc-800 rounded-2xl p-3">
                    <MapPin className="w-4 h-4 text-[#FEE715] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-wider">Ship To</p>
                      <p className="text-white font-bold text-sm mt-0.5">
                        {displayAddress.street}, {displayAddress.city}
                      </p>
                      <p className="text-zinc-400 text-[11px] font-medium">
                        {displayAddress.zip}, {displayAddress.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right: Payment Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-6 sticky top-6">
              <h2 className="text-white font-black uppercase text-sm tracking-wider mb-5 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FEE715]" /> Payment Summary
              </h2>
              <div className="space-y-3 text-xs font-bold text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-extrabold">${displaySubtotal.toFixed(2)}</span>
                </div>
                {displayDiscount > 0 && displayCoupon && (
                  <div className="flex justify-between text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    <span>Discount ({displayCoupon})</span>
                    <span className="font-black">-${displayDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-emerald-400 font-black">FREE</span>
                </div>
                <div className="flex justify-between items-center text-base font-black text-white pt-3 border-t-2 border-zinc-700">
                  <span>Total Paid</span>
                  <span className="text-xl text-black bg-[#FEE715] px-3 py-1 rounded-xl border border-black">
                    ${displayTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-5 flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-emerald-400 font-black text-[11px] uppercase tracking-wider">Payment Confirmed</p>
                  <p className="text-zinc-400 text-[10px] font-medium">Recorded securely in Neon Database</p>
                </div>
              </div>

              {/* Alert badge */}
              <div className="mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <p className="text-blue-300 text-[10px] font-bold leading-relaxed">
                  Order details &amp; tracking link sent to your WhatsApp / Email
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/orders"
                className="w-full bg-[#FEE715] hover:bg-yellow-300 text-[#101820] font-black uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(16,24,32,1)]"
              >
                <Package className="w-4 h-4" />
                View All Orders
              </Link>
              <Link
                href="/products"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-zinc-600"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101820] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FEE715]" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
