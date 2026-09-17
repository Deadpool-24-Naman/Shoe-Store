import Link from 'next/link';
import { Flame, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#101820] text-zinc-300 pt-16 pb-12 border-t-4 border-[#FEE715]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="bg-[#FEE715] text-black font-black text-2xl tracking-tighter px-3 py-1 rounded-xl">
                KICKS.
              </span>
              <span className="bg-zinc-800 text-[#FEE715] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-700">
                STREETWEAR
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm mb-6 font-medium leading-relaxed">
              India's unapologetic streetwear sneaker hub. Delivering high-voltage chunky silhouettes, anime kicks, and daily beaters for the new generation.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-[#FEE715]">
              <Flame className="w-4 h-4 fill-[#FEE715]" /> OVER 50,000+ SNEAKERHEADS TRUST US
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-[#FEE715] text-[#FEE715]" /> Hot Drops
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <li><Link href="/products?search=chunky" className="hover:text-[#FEE715] transition-colors">Chunky Sneakers</Link></li>
              <li><Link href="/products?search=anime" className="hover:text-[#FEE715] transition-colors">Anime Kicks</Link></li>
              <li><Link href="/products?search=daily" className="hover:text-[#FEE715] transition-colors">Daily Beaties</Link></li>
              <li><Link href="/products?sort=newest" className="hover:text-[#FEE715] transition-colors">Fresh Arrivals</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <li><Link href="/products?category=men" className="hover:text-[#FEE715] transition-colors">Men Footwear</Link></li>
              <li><Link href="/products?category=women" className="hover:text-[#FEE715] transition-colors">Women Footwear</Link></li>
              <li><Link href="/products?category=kids" className="hover:text-[#FEE715] transition-colors">Kids Drops</Link></li>
              <li><Link href="/products?category=sports" className="hover:text-[#FEE715] transition-colors">Sports &amp; Gym</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <li><Link href="/orders" className="hover:text-[#FEE715] transition-colors">Track Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#FEE715] transition-colors">My Wishlist</Link></li>
              <li><span className="text-zinc-500">7-Day Free Returns</span></li>
              <li><span className="text-zinc-500">100% Genuine Guarantee</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-500">
          <p>© {new Date().getFullYear()} KICKS STREETWEAR CORP. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">AUTHENTICITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
