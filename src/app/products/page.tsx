export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Filter, Search, X, Flame, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface ProductsPageProps {
  searchParams?: Promise<{ category?: string; brand?: string; sort?: string; search?: string; q?: string }> | { category?: string; brand?: string; sort?: string; search?: string; q?: string };
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { category, brand, sort, search, q } = resolvedParams || {};
  const searchQuery = (search || q || '').trim();

  const where: any = {};
  if (category && category.toLowerCase() !== 'all') {
    where.category = { contains: category, mode: 'insensitive' };
  }
  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' };
  }
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { category: { contains: searchQuery, mode: 'insensitive' } },
      { brand: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where,
      orderBy,
    });
  } catch (err) {
    console.error('[products] DB error:', err);
    products = [];
  }

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-8 pb-24 text-zinc-900">
      <div className="container mx-auto px-4">
        
        {/* Header Banner */}
        <div className="mb-10 bg-white p-6 sm:p-8 rounded-3xl border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
              <Flame className="w-3.5 h-3.5 fill-black" />
              STREET DROP CATALOG
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-900">
              {searchQuery 
                ? `Results for "${searchQuery}"`
                : category ? `${category} Collection` : 'All Street Footwear'}
            </h1>
            <p className="text-zinc-500 font-bold text-sm mt-1">
              Showing {safeProducts.length} {safeProducts.length === 1 ? 'drip item' : 'drip items'} ready to cop
            </p>
          </div>

          {searchQuery && (
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1.5 bg-black text-[#FEE715] hover:bg-zinc-800 text-xs font-black px-4 py-2.5 rounded-full transition-colors border border-[#FEE715]/40"
            >
              Clear Search Filter <X className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-zinc-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-zinc-900 pb-4 border-b border-zinc-100">
                <Filter className="w-5 h-5" />
                <h3 className="font-black text-lg uppercase tracking-tight">Filters &amp; Sort</h3>
              </div>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-black text-zinc-900 mb-3 uppercase text-xs tracking-wider">Categories</h4>
                <ul className="space-y-2">
                  {['All', 'Men', 'Women', 'Kids', 'Sports'].map((cat) => {
                    const catValue = cat.toLowerCase();
                    const isActive = (cat === 'All' && !category) || category === catValue;
                    const catParams = new URLSearchParams();
                    if (cat !== 'All') catParams.set('category', catValue);
                    if (searchQuery) catParams.set('search', searchQuery);
                    if (sort) catParams.set('sort', sort);

                    const href = catParams.toString() ? `/products?${catParams.toString()}` : '/products';
                    
                    return (
                      <li key={cat}>
                        <Link 
                          href={href} 
                          className={`block px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            isActive 
                              ? "bg-[#FEE715] text-black shadow-sm font-black" 
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                          }`}
                        >
                          {cat}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Special Drops Filter */}
              <div className="mb-8 pt-4 border-t border-zinc-100">
                <h4 className="font-black text-zinc-900 mb-3 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-900" /> Curated Drops
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Chunky Sneakers', search: 'chunky' },
                    { label: 'Anime Kicks', search: 'anime' },
                    { label: 'Daily Beaties', search: 'daily' },
                  ].map((drop) => {
                    const isActive = searchQuery.toLowerCase() === drop.search;
                    return (
                      <Link
                        key={drop.label}
                        href={`/products?search=${drop.search}`}
                        className={`block px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-black text-[#FEE715]'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                        }`}
                      >
                        {drop.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              
              {/* Sort By Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-black text-zinc-900 mb-3 uppercase text-xs tracking-wider">Sort By</h4>
                <div className="space-y-2 flex flex-col">
                  {[
                    { label: 'Newest Arrivals', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price_asc' },
                    { label: 'Price: High to Low', value: 'price_desc' }
                  ].map((option) => {
                    const isActive = (sort === option.value) || (!sort && option.value === 'newest');
                    const sortParams = new URLSearchParams();
                    if (category) sortParams.set('category', category);
                    if (brand) sortParams.set('brand', brand);
                    if (searchQuery) sortParams.set('search', searchQuery);
                    sortParams.set('sort', option.value);

                    return (
                      <Link 
                        key={option.value}
                        href={`/products?${sortParams.toString()}`} 
                        className={`block px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          isActive 
                            ? "bg-zinc-900 text-white shadow-sm" 
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                        }`}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {safeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeProducts?.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-28 bg-white rounded-3xl border-2 border-dashed border-zinc-300 p-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-2">No matching kicks found</h3>
                <p className="text-zinc-500 font-medium text-sm mb-6 max-w-sm mx-auto">
                  We couldn't find any footwear matching your filters. Try clearing your search or explore our fresh collections.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-[#FEE715] hover:bg-yellow-400 text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-full text-xs transition shadow-md"
                >
                  Browse All Sneakers
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
