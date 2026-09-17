'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Calendar,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Search,
  Flame,
} from 'lucide-react';
import OrderTracker from '@/components/OrderTracker';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#101820]" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-4 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>

          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
                <Flame className="w-3.5 h-3.5 fill-black" /> Your Order History
              </div>
              <h1 className="text-4xl font-black uppercase text-zinc-900">My Orders</h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Track all your footwear orders below
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black bg-[#101820] text-[#FEE715] border-2 border-black px-4 py-2 rounded-full">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 text-sm font-black bg-white border-2 border-black px-4 py-2 rounded-full hover:bg-[#FEE715] transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" /> Track by ID
              </Link>
            </div>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="bg-white p-16 rounded-3xl border-2 border-zinc-200 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#101820] mx-auto mb-4" />
            <p className="text-zinc-500 font-bold text-sm">Fetching your orders from Neon Database…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border-2 border-zinc-200 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-[#FEE715] rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase text-zinc-900 mb-2">No Orders Yet</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              You haven&apos;t placed any orders yet. Explore our latest drops and cop something fire.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider px-8 py-4 rounded-2xl transition-all border-2 border-black"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = (() => { try { return JSON.parse(order.items || '[]'); } catch { return []; } })();
              const shipping = (() => { try { return order.shippingAddress ? JSON.parse(order.shippingAddress) : null; } catch { return null; } })();
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isExpanded = expandedId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order card header */}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-zinc-100 gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-[#101820]" />
                          <span className="font-black text-zinc-900 text-lg">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Placed on {formattedDate}</span>
                        </div>
                        {shipping && (
                          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                            📍 {shipping.street}, {shipping.city}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" /> {order.status}
                        </span>
                        <span className="text-xl font-black text-zinc-900 bg-[#FEE715] px-3 py-1 rounded-xl border border-black">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Tracking progress bar — always visible */}
                    <div className="mb-5">
                      <OrderTracker
                        orderId={order.id}
                        createdAt={order.createdAt}
                        lightMode
                      />
                    </div>

                    {/* Items preview (first 2 items) */}
                    <div className="space-y-2.5">
                      {items.slice(0, isExpanded ? items.length : 2).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                        >
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
                              Size: {item.size} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-black text-zinc-900 text-sm shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Show more / less toggle */}
                    {items.length > 2 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="mt-3 text-xs font-black text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider"
                      >
                        {isExpanded ? '▲ Show Less' : `▼ +${items.length - 2} More Item${items.length - 2 > 1 ? 's' : ''}`}
                      </button>
                    )}
                  </div>

                  {/* Card footer: track order link */}
                  <div className="bg-zinc-50 border-t border-zinc-100 px-6 sm:px-8 py-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Ref: {order.stripeSessionId?.slice(0, 18) || order.id.slice(0, 18)}…
                    </p>
                    <Link
                      href={`/track-order?id=${order.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#101820] hover:text-[#FEE715] hover:bg-[#101820] border border-zinc-300 hover:border-[#101820] px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Search className="w-3 h-3" /> Track Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
