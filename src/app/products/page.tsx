import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; brand?: string; sort?: string };
}) {
  const { category, brand, sort } = await searchParams;

  const where: any = {};
  if (category) where.category = category;
  if (brand) where.brand = brand;

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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 capitalize">
            {category ? `${category} Footwear` : 'All Footwear'}
          </h1>
          <p className="text-gray-500 text-lg">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
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
                    const href = cat === 'All' ? '/products' : `/products?category=${catValue}`;
                    
                    return (
                      <li key={cat}>
                        <Link 
                          href={href} 
                          className={`block transition-colors ${isActive ? "font-bold text-blue-600" : "text-gray-600 hover:text-black"}`}
                        >
                          {cat}
                        </Link>
                      </li>
                    )
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
                    return (
                      <Link 
                        key={option.value}
                        href={`/products?${new URLSearchParams({...await searchParams, sort: option.value}).toString()}`} 
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
