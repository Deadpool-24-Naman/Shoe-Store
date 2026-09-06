export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AddToCart from '@/components/AddToCart';

export default async function WishlistPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error('[wishlist] Failed to get session:', err);
  }

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Please log in to view your wishlist.</p>
        <Link
          href="/login?callbackUrl=/wishlist"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition"
        >
          Log In
        </Link>
      </div>
    );
  }

  let items: any[] = [];
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      include: { wishlists: { include: { product: true } } },
    });
    items = user?.wishlists.map((w) => w.product) ?? [];
  } catch (err) {
    console.error('[wishlist] DB error:', err);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            let firstImage = '/placeholder.png';
            try {
              firstImage = JSON.parse(product.images)[0] ?? firstImage;
            } catch {}
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col"
              >
                <Link href={`/products/${product.id}`} className="mb-4 block">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="object-contain w-full h-48"
                  />
                </Link>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
                <p className="text-gray-600 mb-4 font-medium">${product.price.toFixed(2)}</p>
                <AddToCart product={product} stock={product.stock} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
