import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Filter, Search, X } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; brand?: string; sort?: string; search?: string; q?: string };
}) {
  const { category, brand, sort, search, q } = await searchParams;
  const searchQuery = (search || q || '').trim();

  const where: any = {};
  if (category) where.category = category;
  if (brand) where.brand = brand;
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

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 capitalize">
            {searchQuery 
              ? `Results for "${searchQuery}"`
              : category ? `${category} Footwear` : 'All Footwear'}
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-lg">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            {searchQuery && (
              <Link 
                href="/products" 
                className="inline-flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-3 py-1 rounded-full transition-colors"
              >
                Clear Search <X className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900">
                <Filter className="w-5 h-5" />
                <h3 className="font-bold text-lg">Filters & Sort</h3>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Categories</h4>
                <ul className="space-y-3">
                  {['All', 'Men', 'Women', 'Kids', 'Sports'].map(cat => {
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
                          className={`block transition-colors ${isActive ? "font-bold text-blue-600" : "text-gray-600 hover:text-black"}`}
                        >
                          {cat}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Sort By</h4>
                <div className="space-y-3 flex flex-col">
                  {[
                    { label: 'Newest Arrivals', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price_asc' },
                    { label: 'Price: High to Low', value: 'price_desc' }
                  ].map(option => {
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
                        className={`block transition-colors ${isActive ? "font-bold text-blue-600" : "text-gray-600 hover:text-black"}`}
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
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const images = JSON.parse(product.images);
                  return (
                    <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="relative h-64 overflow-hidden bg-gray-100 p-4">
                        {/* Wishlist Heart Toggle */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const method = 'POST';
                            try {
                              await fetch('/api/wishlist', {
                                method,
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ productId: product.id }),
                              });
                            } catch (err) {
                              console.error('Wishlist error', err);
                            }
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow transition-colors text-gray-400 hover:text-red-600"
                        >
                          🤍
                        </button>
                        {/* Stock Badge */}
                        {product.stock === 0 && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</div>
                        )}
                        <img 
                          src={images[0]} 
                          alt={product.name} 
                          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">{product.brand}</p>
                          <h3 className="font-bold text-xl mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <p className="font-bold text-xl">${product.price.toFixed(2)}</p>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-300">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any footwear matching your search.</p>
                <Link href="/products" className="inline-block bg-black text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition">
                  Browse All Shoes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
