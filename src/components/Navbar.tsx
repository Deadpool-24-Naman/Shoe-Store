'use client';
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 hover:opacity-80 transition-opacity">
          KICKS<span className="text-blue-600">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-wide uppercase text-gray-600">
          <Link href="/products" className="hover:text-black transition-colors">All Shoes</Link>
          <Link href="/products?category=men" className="hover:text-black transition-colors">Men</Link>
          <Link href="/products?category=women" className="hover:text-black transition-colors">Women</Link>
          <Link href="/products?category=kids" className="hover:text-black transition-colors">Kids</Link>
          <Link href="/products?category=sports" className="hover:text-black transition-colors">Sports</Link>
        </div>

        <div className="flex items-center gap-5">
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
          <Link 
            href="/login" 
            className="p-2.5 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
