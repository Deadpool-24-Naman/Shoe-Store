'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Package, Heart, Flame, Command } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SearchModal from '@/components/SearchModal';

export default function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Fetch wishlist count once the client mounts and user is logged in
  useEffect(() => {
    if (!mounted) return;
    if (session?.user?.email) {
      fetch('/api/wishlist')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setWishlistCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  }, [mounted, session?.user?.email]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-zinc-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo - Bewakoof/Gen-Z Streetwear Style */}
        <Link href="/" className="flex items-center gap-1.5 group shrink-0">
          <div className="bg-[#101820] text-[#FEE715] font-black text-2xl tracking-tighter px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            KICKS<span className="text-[#FEE715]">.</span>
          </div>
          <span className="hidden sm:inline-block bg-[#FEE715] text-black text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-black">
            STREET
          </span>
        </Link>

        {/* Category Links */}
        <div className="hidden lg:flex items-center gap-6 font-black text-xs tracking-wider uppercase text-zinc-700 shrink-0">
          <Link href="/products" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors">
            All Kicks
          </Link>
          <Link href="/products?search=chunky" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Chunky
          </Link>
          <Link href="/products?search=anime" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors">
            Anime
          </Link>
          <Link href="/products?category=men" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors">
            Men
          </Link>
          <Link href="/products?category=women" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors">
            Women
          </Link>
          <Link href="/products?category=sports" className="hover:text-black hover:underline decoration-[#FEE715] decoration-2 transition-colors">
            Sports
          </Link>
        </div>

        {/* Command Palette Live Search Trigger Bar */}
        <div className="flex-1 max-w-xs md:max-w-sm relative">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 pl-10 pr-3 py-2.5 rounded-full text-xs font-bold border border-zinc-200 flex items-center justify-between transition-all group shadow-2xs cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-black shrink-0" />
              <span className="text-zinc-400 group-hover:text-zinc-700 truncate">
                Search kicks, brands...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-white border border-zinc-300 text-zinc-500 group-hover:text-zinc-900 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-2xs shrink-0">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>
        </div>

        {/* Global Command Palette / Live Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Action Icons */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* ❤️ Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2.5 rounded-2xl text-zinc-800 hover:text-red-600 hover:bg-zinc-100 transition-all duration-200 border border-transparent hover:border-zinc-200"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${mounted && wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`}
            />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#101820] text-[#FEE715] border border-[#FEE715] text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🛒 Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-2xl text-zinc-800 hover:text-black hover:bg-zinc-100 transition-all duration-200 border border-transparent hover:border-zinc-200"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FEE715] text-black font-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-md border border-black animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* 📦 Orders Link */}
          {mounted && session?.user && (
            <Link
              href="/orders"
              className="hidden sm:flex items-center gap-1.5 p-2 px-3.5 rounded-2xl text-xs font-black text-zinc-900 bg-zinc-100 hover:bg-[#FEE715] hover:text-black transition-all duration-200 border border-zinc-200"
              aria-label="My Orders"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          )}

          {/* 👤 User Account / Profile */}
          <Link
            href={session?.user ? '/profile' : '/login'}
            className="flex items-center gap-2 p-2 rounded-2xl text-zinc-800 hover:text-black hover:bg-zinc-100 transition-all duration-200 border border-transparent hover:border-zinc-200"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
            {mounted && session?.user && (
              <span className="hidden xl:inline-block text-xs font-black text-zinc-900 max-w-[90px] truncate">
                {session.user.name || session.user.email?.split('@')[0]}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
