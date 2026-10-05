'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Package, Heart, Flame, Command, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SearchModal from '@/components/SearchModal';

const NAV_LINKS = [
  { name: 'ALL KICKS', href: '/products' },
  { name: 'CHUNKY', href: '/products?search=chunky', isChunky: true },
  { name: 'ANIME', href: '/products?search=anime' },
  { name: 'MEN', href: '/products?category=men' },
  { name: 'WOMEN', href: '/products?category=women' },
  { name: 'SPORTS', href: '/products?category=sports' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-zinc-200 shadow-sm transition-all duration-300">
      <div className="w-full px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between relative">

        {/* LEFT SECTION: Category Navigation Links & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-1 justify-start">
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-black text-[11px] xl:text-xs tracking-wider uppercase text-zinc-800">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-black hover:underline decoration-[#FEE715] decoration-4 underline-offset-4 transition-all flex items-center gap-1 shrink-0"
              >
                {link.isChunky && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* EXACT CENTER SECTION: Prominent 'KICKS.' Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <div className="flex items-center">
              <span className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter uppercase text-zinc-950 group-hover:scale-105 transition-transform duration-200">
                KICKS<span className="text-[#FEE715] text-3xl sm:text-4xl md:text-5xl leading-none">.</span>
              </span>
            </div>
            <span className="hidden md:inline-block bg-[#FEE715] text-black text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              STREET
            </span>
          </Link>
        </div>

        {/* RIGHT SECTION: Search, Wishlist, Cart, Orders & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-1 justify-end">
          
          {/* Mobile Search Icon Trigger (< 640px) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5 text-zinc-700" />
          </button>

          {/* Desktop Live Search Trigger Pill (>= 640px) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 pl-3.5 pr-2.5 sm:pr-3 py-2 sm:py-2.5 rounded-full text-xs font-bold border border-zinc-200/90 items-center gap-2 transition-all group shadow-2xs cursor-pointer max-w-[170px] md:max-w-[210px]"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-black shrink-0" />
            <span className="text-zinc-400 group-hover:text-zinc-700 truncate text-xs">
              Search kicks...
            </span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 bg-white border border-zinc-300 text-zinc-500 group-hover:text-zinc-900 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-2xs ml-auto shrink-0">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-xl text-zinc-800 hover:text-red-600 hover:bg-zinc-100 transition-all duration-200"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${mounted && wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`}
            />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#101820] text-[#FEE715] border border-[#FEE715] text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-zinc-800 hover:text-black hover:bg-zinc-100 transition-all duration-200"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#FEE715] text-black font-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow-md border border-black animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Orders Link (Desktop) */}
          {mounted && session?.user && (
            <Link
              href="/orders"
              className="hidden xl:flex items-center gap-1.5 p-2 px-3 rounded-2xl text-xs font-black text-zinc-900 bg-zinc-100 hover:bg-[#FEE715] hover:text-black transition-all duration-200 border border-zinc-200"
              aria-label="My Orders"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          )}

          {/* User Account / Profile */}
          <Link
            href={session?.user ? '/profile' : '/login'}
            className="hidden xs:flex p-2 rounded-xl text-zinc-800 hover:text-black hover:bg-zinc-100 transition-all duration-200"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-zinc-100 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 hover:bg-[#FEE715] text-zinc-900 font-black text-xs uppercase tracking-wider border border-zinc-200 transition-colors"
              >
                {link.isChunky && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-black uppercase text-zinc-800">
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1"
            >
              Track Order
            </Link>
            {mounted && session?.user ? (
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-black py-1"
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-black py-1"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Global Command Palette / Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
