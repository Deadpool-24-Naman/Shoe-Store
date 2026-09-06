'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, CheckCircle, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          if (data.orders) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch orders:', err);
          setLoading(false);
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
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-4 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-1">View and track all your past footwear orders</p>
            </div>
            <span className="text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
            </span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching your order history directly from Neon Database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No Order History Found</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              You haven't placed any orders with this account yet. Explore our latest drops and upgrade your footwear.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 hover:bg-black text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shopping
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
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-extrabold text-gray-900 text-lg">Order #{order.id.slice(-8)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Placed on {formattedDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" /> {order.status}
                      </span>
                      <span className="text-2xl font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-4">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/60 hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <p className="font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment details */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">
                    {shipping && (
                      <div>
                        <span className="font-bold text-gray-700">Shipping Address:</span> {shipping.street}, {shipping.city}, {shipping.zip}, {shipping.country}
                      </div>
                    )}
                    {order.stripeSessionId && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> Ref: {order.stripeSessionId.slice(0, 16)}...
                      </div>
                    )}
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
