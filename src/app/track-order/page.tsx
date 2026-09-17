'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Package,
  ArrowLeft,
  Flame,
  AlertCircle,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import OrderTracker from '@/components/OrderTracker';

interface TrackItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

interface TrackOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: TrackItem[];
  shippingAddress: { street: string; city: string; zip: string; country: string } | null;
}

// Pre-fill examples
const EXAMPLE_IDS = [
  'Enter your full Order ID',
  'e.g. cm9xk7a8b0000…',
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputId, setInputId] = useState(searchParams.get('id') || '');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState('');

  // Auto-search if an ID was provided via query param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setInputId(id);
      fetchOrder(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrder = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) {
      setError('Please enter an Order ID.');
      return;
    }
    setLoading(true);
    setSearched(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${trimmed}`);
      const data = await res.json();

      if (res.ok && data.order) {
        const raw = data.order;
        setOrder({
          ...raw,
          items: (() => { try { return JSON.parse(raw.items || '[]'); } catch { return []; } })(),
          shippingAddress: (() => { try { return raw.shippingAddress ? JSON.parse(raw.shippingAddress) : null; } catch { return null; } })(),
        });
        // Update URL without reload
        router.replace(`/track-order?id=${trimmed}`, { scroll: false });
      } else {
        setError('No order found with that ID. Please double-check and try again.');
      }
    } catch {
      setError('Failed to fetch order. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(inputId);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Back nav */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-6 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-3">
            <Flame className="w-3.5 h-3.5 fill-black" /> Live Order Tracking
          </div>
          <h1 className="text-4xl font-black uppercase text-zinc-900 mb-2">Track Your Order</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">
            Enter your Order ID to get real-time tracking updates for your kicks.
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-8 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-2">
                Order ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Paste your full Order ID here…"
                  className="flex-1 px-4 py-3.5 border-2 border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-sm font-bold font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !inputId.trim()}
                  className="bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all border-2 border-black disabled:bg-zinc-300 disabled:text-zinc-500 disabled:border-zinc-300"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Track</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium mt-2">
                💡 Your Order ID is available on the Order Confirmation page and in your order history.
              </p>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Quick access:</span>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-[11px] font-black text-zinc-600 hover:text-black border border-zinc-200 hover:border-zinc-400 px-2.5 py-1 rounded-lg transition-colors"
            >
              <ClipboardList className="w-3 h-3" /> My Orders
            </Link>
            <Link
              href="/order-success"
              className="inline-flex items-center gap-1 text-[11px] font-black text-zinc-600 hover:text-black border border-zinc-200 hover:border-zinc-400 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Package className="w-3 h-3" /> Last Order
            </Link>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-black text-sm">Order Not Found</p>
              <p className="text-red-600 text-xs font-medium mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-8 animate-pulse">
            <div className="h-4 bg-zinc-200 rounded-full w-40 mb-4" />
            <div className="h-20 bg-zinc-100 rounded-2xl mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-zinc-100 rounded-xl" />)}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && order && (
          <div className="space-y-5">

            {/* Order Header */}
            <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-[#101820]" />
                    <span className="font-black text-xl text-zinc-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-bold">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {order.shippingAddress && (
                    <p className="text-[11px] text-zinc-400 font-medium mt-1">
                      📍 {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.zip}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    ✓ {order.status}
                  </span>
                  <span className="text-xl font-black text-black bg-[#FEE715] px-3 py-1.5 rounded-xl border border-black">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Tracking bar */}
              <OrderTracker
                orderId={order.id}
                createdAt={order.createdAt}
                lightMode
              />
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items in This Order ({order.items.length})
              </h2>
              <div className="space-y-3">
                {order.items.length === 0 ? (
                  <p className="text-zinc-400 text-sm font-medium">No item details available.</p>
                ) : (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl">
                      <div className="w-14 h-14 bg-white rounded-xl p-1 shrink-0 border border-zinc-200 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 text-sm truncate">{item.name}</p>
                        <p className="text-[11px] font-bold text-zinc-500 mt-0.5">
                          Size {item.size} &bull; Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-zinc-900 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Link
                href="/orders"
                className="flex-1 bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-black text-sm"
              >
                <ClipboardList className="w-4 h-4" /> All Orders
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-black uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-zinc-300 text-sm"
              >
                Shop More →
              </Link>
            </div>
          </div>
        )}

        {/* Empty / not searched state */}
        {!loading && !searched && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-zinc-100 border-2 border-zinc-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-zinc-400" />
            </div>
            <p className="text-zinc-400 font-bold text-sm">Enter your Order ID above to get tracking updates.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#101820]" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
