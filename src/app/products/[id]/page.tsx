export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCart from '@/components/AddToCart';
import ReviewSection from '@/components/ReviewSection';
import StyleMatcherSection from '@/components/StyleMatcherSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let product = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch (err) {
    console.error('[product-detail] DB error:', err);
  }

  if (!product) notFound();

  let images = ['/placeholder.png'];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = ['/placeholder.png'];
  }
  const firstImage = images?.[0] || '/placeholder.png';
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24 text-zinc-900">
      <div className="container mx-auto px-4 max-w-6xl">

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-8 font-black uppercase text-xs tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Drops
        </Link>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-16">
            
            {/* Product Image Gallery Box */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-square bg-[#F4F4F5] rounded-3xl overflow-hidden p-8 relative flex items-center justify-center group border-2 border-zinc-200/80">
                <img
                  src={firstImage}
                  alt={product.name || 'Shoe'}
                  className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out"
                />
                {/* Out of Stock Overlay Badge */}
                {isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Product Details & Purchase Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-[#FEE715] text-black text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-black shadow-sm">
                  {product.category}
                </span>
                <span className="text-zinc-500 font-black uppercase tracking-widest text-xs">
                  {product.brand}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-3xl font-black text-black">${(product.price ?? 0).toFixed(2)}</p>
                <p className="text-sm font-semibold text-zinc-400 line-through">${((product.price ?? 0) * 1.35).toFixed(2)}</p>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                  25% OFF
                </span>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2 mb-6 text-xs font-black uppercase tracking-wider">
                {isOutOfStock ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-600">Currently Sold Out</span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700">In Stock ({product.stock} Pairs Left)</span>
                  </>
                )}
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500">Free Express Delivery</span>
              </div>

              <div className="prose prose-sm mb-8 text-zinc-600 font-medium leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="pt-6 border-t-2 border-zinc-100">
                <AddToCart product={product} stock={product.stock} />
              </div>
            </div>

          </div>
        </div>

        {/* Shop the Look / Style Matcher Cross-sell Section */}
        <StyleMatcherSection mainProductName={product.name} />

        {/* Review Section */}
        <div className="mt-12 bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-10 shadow-sm">
          <ReviewSection productId={product.id} />
        </div>

      </div>
    </div>
  );
}
