import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import AddToCart from '@/components/AddToCart';

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Please log in to view your wishlist.</p>
        <Link href="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
          Log In
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
    include: { wishlists: { include: { product: true } } },
  });

  const items = user?.wishlists.map(w => w.product) ?? [];

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Your wishlist is empty.</p>
        <Link href="/products" className="text-blue-600 underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const images = JSON.parse(product.images);
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
                <Link href={`/products/${product.id}`} className="mb-4">
                  <img src={images[0]} alt={product.name} className="object-contain w-full h-48" />
                </Link>
                <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                {/* Move to Cart button */}
                <AddToCart product={product} stock={product.stock} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
