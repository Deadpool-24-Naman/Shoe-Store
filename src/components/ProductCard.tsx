'use client';

import Link from 'next/link';
import { ArrowRight, Star, Zap, Flame, Sparkles, Crown } from 'lucide-react';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    brand: string;
    stock: number;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  let images = ['/placeholder.png'];
  try {
    images = JSON.parse(product?.images || '[]');
  } catch {
    images = ['/placeholder.png'];
  }
  const firstImage = images?.[0] || '/placeholder.png';
  const isOutOfStock = (product?.stock ?? 0) <= 0;
  const isLowStock = !isOutOfStock && (product?.stock ?? 0) <= 3;
  const price = typeof product?.price === 'number' ? product.price : 0;
  const originalPrice = (price * 1.35).toFixed(2);
  const discountPercent = 25;

  // Gen-Z Streetwear Badges (Bewakoof style)
  const getBadge = () => {
    if (isOutOfStock) {
      return {
        text: 'OUT OF STOCK',
        className: 'bg-zinc-900 text-red-400 border border-red-500/30',
        icon: null,
      };
    }
    if (isLowStock) {
      return {
        text: `ONLY ${product.stock} LEFT!`,
        className: 'bg-amber-400 text-black font-black animate-pulse',
        icon: <Zap className="w-3 h-3 fill-black" />,
      };
    }

    const badgeTypes = [
      { text: 'HOT SELLING', className: 'bg-[#FEE715] text-black font-black', icon: <Flame className="w-3 h-3 fill-black" /> },
      { text: 'TRENDING', className: 'bg-black text-[#FEE715] border border-[#FEE715]/50 font-black', icon: <Sparkles className="w-3 h-3 text-[#FEE715]" /> },
      { text: 'LIMITED DROP', className: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black', icon: <Crown className="w-3 h-3 text-yellow-300" /> },
      { text: 'BESTSELLER', className: 'bg-emerald-400 text-black font-black', icon: <Star className="w-3 h-3 fill-black" /> },
    ];

    return badgeTypes[index % badgeTypes.length];
  };

  const badge = getBadge();
  const rating = (4.4 + ((index * 3) % 6) / 10).toFixed(1);
  const reviewsCount = 40 + ((index * 73) % 350);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border-2 border-zinc-200/90 hover:border-black shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col relative">
      
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-[#F4F4F5] p-5 flex items-center justify-center">
        {/* Streetwear Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${badge.className}`}
          >
            {badge.icon}
            {badge.text}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <WishlistButton productId={product.id} />

        {/* Shoe Image */}
        <Link href={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={firstImage}
            alt={product?.name || 'Streetwear Footwear'}
            className="object-contain w-full h-full group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 mix-blend-multiply"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand & Category Pill */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              {product?.brand || 'STREET'}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              <span className="text-zinc-400 text-[10px]">({reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-extrabold text-lg text-zinc-900 group-hover:text-black group-hover:underline transition-colors line-clamp-1 mb-1">
              {product?.name || 'Streetwear Sneakers'}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-zinc-500 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
            {product?.description || 'Engineered for high comfort, bold style and daily drip.'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-zinc-950">${price.toFixed(2)}</span>
              <span className="text-xs font-semibold text-zinc-400 line-through">${originalPrice}</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="w-10 h-10 rounded-2xl bg-zinc-900 group-hover:bg-[#FEE715] group-hover:text-black text-white flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="View product"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
