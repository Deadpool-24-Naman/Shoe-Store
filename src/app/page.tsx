export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop' }
];

export default async function Home() {
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error('[home] DB error:', err);
    featuredProducts = [];
  }

  const safeFeatured = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#F7F7F7] pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 leading-tight">
              Elevate Your <br/><span className="text-blue-600">Footwear</span>
            </h1>
            <p className="text-gray-600 mb-10 text-xl max-w-lg leading-relaxed">
              Discover the latest collections of premium footwear designed for style, comfort, and performance.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/products" className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-black hover:shadow-xl transition-all duration-300">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="relative w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop" 
                alt="Premium Sneaker" 
                className="object-cover w-full h-[600px] hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Shop by Category</h2>
              <p className="text-gray-500 text-lg">Find the perfect style for everyone</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/products?category=${cat.name.toLowerCase()}`} className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute inset-0 flex items-end p-8 z-20">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-3xl font-bold mb-2">{cat.name}</h3>
                    <span className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">New Arrivals</h2>
              <p className="text-gray-500 text-lg">The latest drops you need to see</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {safeFeatured.map((product) => {
              let images = ['/placeholder.png'];
              try {
                images = JSON.parse(product?.images || '[]');
              } catch {
                images = ['/placeholder.png'];
              }
              const firstImage = images?.[0] || '/placeholder.png';
              const price = typeof product?.price === 'number' ? product.price.toFixed(2) : '0.00';

              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative h-72 overflow-hidden bg-gray-100 p-4">
                    <img 
                      src={firstImage} 
                      alt={product?.name || 'Shoe'} 
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">{product?.brand || 'Brand'}</p>
                      <h3 className="font-bold text-xl mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{product?.name || 'Footwear'}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product?.description || ''}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-bold text-xl">${price}</p>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
