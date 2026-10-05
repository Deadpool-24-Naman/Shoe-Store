export const dynamic = 'force-dynamic';

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Flame, Sparkles, Zap, ShieldCheck, Truck, RefreshCcw, Tag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CountdownBanner from "@/components/CountdownBanner";
import HeroSlider from "@/components/HeroSlider";

const FEATURED_COLLECTIONS = [
  {
    title: "Chunky Sneakers",
    tagline: "Oversized silhouettes & bold 90s platform drip",
    badge: "🔥 HYPER TRENDING",
    badgeColor: "bg-[#FEE715] text-black",
    link: "/products?search=chunky",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    accentBorder: "hover:border-[#FEE715]",
  },
  {
    title: "Anime Kicks",
    tagline: "Cyberpunk colorways & bold manga aesthetics",
    badge: "⚡ LIMITED DROP",
    badgeColor: "bg-purple-600 text-white",
    link: "/products?search=anime",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    accentBorder: "hover:border-purple-500",
  },
  {
    title: "Daily Beaties",
    tagline: "Ultra-comfy, versatile beaters built for everyday fits",
    badge: "👟 EVERYDAY STAPLE",
    badgeColor: "bg-emerald-400 text-black",
    link: "/products?search=daily",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    accentBorder: "hover:border-emerald-400",
  },
];

const STREET_CATEGORIES = [
  { name: 'Men', link: '/products?category=men', count: '120+ Styles', bg: 'from-blue-600/90 to-black' },
  { name: 'Women', link: '/products?category=women', count: '90+ Styles', bg: 'from-pink-600/90 to-black' },
  { name: 'Kids', link: '/products?category=kids', count: '45+ Styles', bg: 'from-amber-500/90 to-black' },
  { name: 'Sports', link: '/products?category=sports', count: '75+ Styles', bg: 'from-emerald-600/90 to-black' },
];

export default async function Home() {
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('[home] DB error:', err);
    featuredProducts = [];
  }

  const safeFeatured = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="bg-[#FAFAFA] text-zinc-900 overflow-hidden font-sans">
      
      {/* Sleek Flash Sale Countdown Timer Banner */}
      <CountdownBanner />

      {/* Streetwear Announcement Ticker */}
      <div className="bg-[#101820] text-[#FEE715] py-2.5 px-4 font-black text-xs uppercase tracking-widest overflow-hidden border-b-2 border-[#FEE715]/40 flex items-center justify-around flex-wrap gap-4 shadow-sm">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-[#FEE715]" /> FLAT 40% OFF ON NEW DROPS
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 fill-[#FEE715]" /> STREETWEAR EDITIONS LIVE
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> FREE EXPRESS SHIPPING OVER $99
        </span>
        <span className="hidden lg:flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> USE CODE: <span className="underline decoration-2">DRIP15</span>
        </span>
      </div>

      {/* Hero Section with Background Image Slider */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] lg:min-h-[90vh] text-white overflow-hidden border-b-4 border-[#FEE715] flex items-center">
        {/* Full-width Background Image Slider */}
        <HeroSlider />

        <div className="container mx-auto px-4 relative z-10 py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto lg:mx-0">

            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-sm border border-[#FEE715]/40 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-4 sm:mb-6 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#FEE715] shadow-inner">
                <Flame className="w-3.5 h-3.5 fill-[#FEE715] shrink-0" />
                <span>GEN-Z STREETWEAR DROP • 2026 EDITION</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                UNAPOLOGETIC <br />
                <span className="text-[#FEE715] bg-clip-text">STREET DRIP</span> &amp; KICKS.
              </h1>

              <p className="text-zinc-200 text-sm sm:text-lg md:text-xl font-medium max-w-xl mb-6 sm:mb-10 leading-relaxed mx-auto lg:mx-0 drop-shadow-md">
                Bold chunky silhouettes, crazy anime-inspired drops, and everyday beaters crafted for the culture.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-[#FEE715] hover:bg-yellow-400 text-black font-black uppercase tracking-wider px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.9)] hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Flame className="w-4 h-4 fill-black" />
                  SHOP ALL DROPS
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products?search=chunky"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-black uppercase tracking-wider px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm border border-white/30 hover:border-[#FEE715] transition-all text-center"
                >
                  CHUNKY KICKS 👟
                </Link>
              </div>

              {/* Street Trust Badges with mobile bottom clearance */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[11px] sm:text-xs font-bold text-zinc-300 pb-10 sm:pb-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FEE715]" />
                  <span>100% Street Certified</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400" />
                  <span>50K+ Pairs Delivered</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400" />
                  <span>Exclusive Limited Drops</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Category Collection Banners */}
      <section className="py-20 bg-zinc-100 border-b border-zinc-200">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                CURATED STREET CATEGORIES
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-900">
                SIGNATURE <span className="bg-[#FEE715] px-2 py-0.5 rounded-lg border-2 border-black">COLLECTIONS</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="font-black text-xs uppercase tracking-wider text-black bg-white hover:bg-zinc-900 hover:text-white px-5 py-2.5 rounded-full border-2 border-black transition-all flex items-center gap-1.5"
            >
              View All Shoes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Featured Collection Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COLLECTIONS.map((col) => (
              <Link
                key={col.title}
                href={col.link}
                className={`group bg-white rounded-3xl overflow-hidden border-2 border-zinc-300 ${col.accentBorder} shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col`}
              >
                <div className="relative h-72 overflow-hidden bg-zinc-900 p-6 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${col.badgeColor}`}>
                      {col.badge}
                    </span>
                  </div>
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{col.title}</h3>
                    <p className="text-xs text-zinc-300 font-medium line-clamp-1">{col.tagline}</p>
                  </div>
                </div>

                <div className="p-5 bg-white flex items-center justify-between border-t-2 border-zinc-100">
                  <span className="text-xs font-black uppercase tracking-wider text-black group-hover:text-blue-600 transition-colors">
                    EXPLORE COLLECTION
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-[#FEE715] group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Category Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {STREET_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.link}
                className="bg-white hover:bg-black hover:text-white p-4 rounded-2xl border-2 border-zinc-200 hover:border-black transition-all group flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-black text-base uppercase tracking-tight">{cat.name}</h4>
                  <p className="text-[11px] font-bold text-zinc-400 group-hover:text-[#FEE715] transition-colors">{cat.count}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#FEE715] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Featured / Trending Product Drops Grid */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
                <Flame className="w-3.5 h-3.5 fill-black" />
                FRESH HEAT
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-900">
                TRENDING <span className="underline decoration-[#FEE715] decoration-4">STREET DROPS</span>
              </h2>
            </div>
            
            <Link
              href="/products"
              className="bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md flex items-center gap-2"
            >
              BROWSE ALL SNEAKERS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {safeFeatured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {safeFeatured.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-300">
              <p className="text-zinc-500 font-bold mb-4">No drops available at the moment.</p>
              <Link
                href="/products"
                className="inline-block bg-black text-[#FEE715] font-black px-6 py-3 rounded-xl text-sm"
              >
                Browse Catalog
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Bewakoof Style Promo Banner / VIP Club */}
      <section className="py-16 bg-[#101820] text-white border-b-4 border-[#FEE715]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-[2.5rem] p-8 sm:p-12 border-2 border-[#FEE715]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block bg-[#FEE715] text-black font-black text-xs uppercase tracking-widest px-3 py-1 rounded-md mb-4">
                👑 VIP STREETWEAR CLUB
              </span>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
                UNLOCK <span className="text-[#FEE715]">15% OFF</span> YOUR FIRST DROP
              </h3>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                Join 50,000+ sneakerheads getting early access to limited edition colorways, restock alerts, and secret member pricing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="bg-black/80 border-2 border-[#FEE715] text-[#FEE715] font-black tracking-widest text-center px-6 py-3.5 rounded-2xl text-lg">
                USE CODE: DRIP15
              </div>
              <Link
                href="/products"
                className="w-full sm:w-auto bg-[#FEE715] hover:bg-yellow-400 text-black font-black uppercase tracking-wider px-8 py-4 rounded-2xl text-sm transition-all text-center shadow-lg"
              >
                CLAIM DISCOUNT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Streetwear Perks / Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEE715] text-black flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-zinc-900 mb-1">Express Delivery</h4>
                <p className="text-xs text-zinc-500 font-medium">Fast tracked doorstep delivery across all orders.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-black text-[#FEE715] flex items-center justify-center shrink-0 shadow-sm font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-zinc-900 mb-1">100% Legit Streetwear</h4>
                <p className="text-xs text-zinc-500 font-medium">Every sneaker pair verified authentic &amp; premium.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-zinc-900 mb-1">7-Day Free Swaps</h4>
                <p className="text-xs text-zinc-500 font-medium">Hassle-free size exchange and easy returns.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400 text-black flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Zap className="w-6 h-6 fill-black" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-zinc-900 mb-1">Secure Checkout</h4>
                <p className="text-xs text-zinc-500 font-medium">Encrypted transactions &amp; instant order tracking.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
