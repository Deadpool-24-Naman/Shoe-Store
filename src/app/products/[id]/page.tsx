import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCart from '@/components/AddToCart';
import ReviewSection from '@/components/ReviewSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  const images = JSON.parse(product.images);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 mb-8">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/3] lg:aspect-square bg-[#F7F7F7] rounded-[2rem] overflow-hidden p-8 relative flex items-center justify-center group">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Out of Stock Overlay Badge */}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-4">
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                {product.brand}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-gray-900 mb-6">${product.price.toFixed(2)}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6 text-sm font-medium">
              {isOutOfStock ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-600">Out of Stock</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-700">In Stock ({product.stock} available)</span>
                </>
              )}
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">Free Shipping &amp; Returns</span>
            </div>

            <div className="prose prose-lg mb-10 text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <AddToCart product={product} stock={product.stock} />
            </div>
          </div>
        </div>

        {/* Review Section — Client Component */}
        <ReviewSection productId={product.id} />

      </div>
    </div>
  );
}
