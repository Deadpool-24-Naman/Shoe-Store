'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Ruler, Sparkles } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

export default function AddToCart({ product, stock }: { product: any; stock: number }) {
  let sizes: string[] = ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'];
  try {
    const parsed = typeof product?.sizes === 'string' ? JSON.parse(product.sizes) : product?.sizes;
    if (Array.isArray(parsed) && parsed.length > 0) {
      sizes = parsed;
    }
  } catch {}

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || 'US 9');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    let image = '/placeholder.png';
    try {
      const parsedImages = typeof product?.images === 'string' ? JSON.parse(product.images) : product?.images;
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        image = parsedImages[0];
      }
    } catch {}

    addItem({
      id: `${product?.id}-${selectedSize}`,
      productId: product?.id,
      name: product?.name || 'Shoe',
      price: product?.price ?? 0,
      image,
      size: selectedSize,
      quantity: 1,
    });
    alert(`🎉 Added "${product?.name}" (${selectedSize}) to your bag!`);
  };

  return (
    <div>
      {/* Size Selector Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-zinc-900">
            Select Size: <span className="text-black bg-[#FEE715] px-2 py-0.5 rounded ml-1">{selectedSize}</span>
          </h3>
          
          {/* Find Your Size Guide Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-zinc-100 hover:bg-[#FEE715] px-3 py-1.5 rounded-full border border-zinc-300 transition-all shadow-sm hover:scale-105"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Find Your Size (CM)</span>
          </button>
        </div>

        {/* Size Pill Buttons */}
        <div className="flex flex-wrap gap-2.5">
          {sizes.map((size: string) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[4rem] h-12 px-3 flex items-center justify-center rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'border-2 border-black bg-[#101820] text-[#FEE715] shadow-[3px_3px_0px_0px_rgba(254,231,21,1)] scale-105'
                    : 'border-2 border-zinc-200 text-zinc-700 bg-white hover:border-black hover:bg-zinc-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Add to Cart CTA */}
      <button 
        type="button"
        disabled={(stock ?? 0) <= 0}
        onClick={handleAddToCart}
        className="w-full bg-[#101820] hover:bg-black active:scale-[0.98] text-[#FEE715] font-black uppercase tracking-wider py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)] disabled:bg-zinc-400 disabled:border-zinc-400 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed text-base"
      >
        <ShoppingCart className="w-5 h-5 fill-[#FEE715]" />
        {(stock ?? 0) > 0 ? 'COP THIS DROP • ADD TO BAG' : 'OUT OF STOCK'}
      </button>

      {/* Size Recommendation Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        currentSelectedSize={selectedSize}
      />
    </div>
  );
}
