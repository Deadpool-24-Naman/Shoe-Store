'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 hover:opacity-80 transition-opacity shrink-0">
          KICKS<span className="text-blue-600">.</span>
        </Link>

        {/* Category Links */}
        <div className="hidden lg:flex items-center gap-7 font-semibold text-xs tracking-wider uppercase text-gray-600 shrink-0">
          <Link href="/products" className="hover:text-black transition-colors">All Shoes</Link>
          <Link href="/products?category=men" className="hover:text-black transition-colors">Men</Link>
          <Link href="/products?category=women" className="hover:text-black transition-colors">Women</Link>
          <Link href="/products?category=kids" className="hover:text-black transition-colors">Kids</Link>
          <Link href="/products?category=sports" className="hover:text-black transition-colors">Sports</Link>
        </div>

        {/* Real-time Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs md:max-w-sm relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shoes, brands, categories..."
              className="w-full bg-gray-100 hover:bg-gray-200/70 focus:bg-white text-gray-900 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button type="submit" aria-label="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Orders Link (for logged-in users) */}
          {mounted && session?.user && (
            <Link
              href="/orders"
              className="hidden sm:flex items-center gap-1.5 p-2 px-3 rounded-full text-xs font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-gray-100"
              aria-label="My Orders"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span>Orders</span>
            </Link>
          )}

          {/* User Account / Profile */}
          <Link
            href={session?.user ? "/profile" : "/login"}
            className="flex items-center gap-2 p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
            {mounted && session?.user && (
              <span className="hidden xl:inline-block text-xs font-bold text-gray-900 max-w-[90px] truncate">
                {session.user.name || session.user.email?.split('@')[0]}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
