'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, User, LogOut, ShoppingBag, Calendar, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          }
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error('Failed to fetch orders:', err);
          setLoadingOrders(false);
        });
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
              {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{session.user.name || 'Shoe Enthusiast'}</h1>
              <p className="text-gray-500 text-sm">{session.user.email}</p>
              <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {(session.user as any).role || 'USER'} Account
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-sm font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Order History */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" /> Order History
            </h2>
            <p className="text-gray-500 text-sm">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
          </div>

          {loadingOrders ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Fetching your order history from Neon Database...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Once you place an order, your purchase history and tracking will appear right here.
              </p>
              <Link
                href="/products"
                className="inline-block bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-full text-sm transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const items = JSON.parse(order.items || '[]');
                const shipping = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4 mb-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order #{order.id.slice(-8)}</span>
                        <div className="flex items-center gap-2 mt-1 text-sm font-medium text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" /> {order.status}
                        </span>
                        <span className="text-2xl font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Purchased Items */}
                    <div className="space-y-4">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#F7F7F7] rounded-xl p-1 shrink-0 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {shipping && (
                      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-bold text-gray-700">Shipping to:</span> {shipping.street}, {shipping.city}, {shipping.zip}, {shipping.country}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
