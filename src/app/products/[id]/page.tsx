import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  const images = JSON.parse(product.images);

  return (
    <div className="bg-white min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/3] lg:aspect-square bg-[#F7F7F7] rounded-[2rem] overflow-hidden p-8 relative flex items-center justify-center group">
              <img 
                src={images[0]} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-4">
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">{product.brand}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{product.name}</h1>
            <p className="text-3xl font-light text-gray-900 mb-8">${product.price.toFixed(2)}</p>
            
            <div className="prose prose-lg mb-10 text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
            
            <div className="pt-8 border-t border-gray-100">
              <AddToCart product={product} />
            </div>
            
            <div className="mt-8 flex gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                In Stock ({product.stock})
              </div>
              <div>Free Shipping & Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
