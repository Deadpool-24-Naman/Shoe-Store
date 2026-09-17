'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { Plus, Check, Sparkles, Flame, ShoppingBag, ArrowRight } from 'lucide-react';

interface AccessoryItem {
  id: string;
  name: string;
  price: number;
  image: string;
  tagline: string;
  badge: string;
}

const STREETWEAR_ACCESSORIES: AccessoryItem[] = [
  {
    id: 'acc-socks-cyber',
    name: 'Cyberpunk Ribbed Crew Socks (3-Pack)',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&auto=format&fit=crop',
    tagline: 'Cushioned heel & breathable streetwear weave',
    badge: 'MUST HAVE',
  },
  {
    id: 'acc-rope-laces',
    name: 'Oversized Streetwear Chunky Rope Laces',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400&auto=format&fit=crop',
    tagline: 'Heavy-duty 8mm thick custom lace upgrade',
    badge: 'POPULAR',
  },
  {
    id: 'acc-care-kit',
    name: 'Sneaker Shield & Foam Cleaner Kit',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop',
    tagline: 'Waterproof repellent spray + horsehair brush',
    badge: 'ESSENTIAL',
  },
  {
    id: 'acc-dubraes',
    name: 'Reflective Sneaker Dubraes & Lace Charms',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop',
    tagline: 'Metallic streetwear tags for personalized drip',
    badge: 'STYLE DROP',
  },
];

export default function StyleMatcherSection({ mainProductName }: { mainProductName: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [bundleAdded, setBundleAdded] = useState(false);

  const handleAddSingle = (item: AccessoryItem) => {
    addItem({
      id: `${item.id}-default`,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'One Size',
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  const handleAddAllBundle = () => {
    STREETWEAR_ACCESSORIES.forEach((item) => {
      addItem({
        id: `${item.id}-default`,
        productId: item.id,
        name: item.name,
        price: Number((item.price * 0.85).toFixed(2)), // 15% bundle discount
        image: item.image,
        size: 'One Size',
        quantity: 1,
      });
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  const bundleTotal = STREETWEAR_ACCESSORIES.reduce((s, i) => s + i.price, 0);
  const bundleDiscounted = (bundleTotal * 0.85).toFixed(2);

  return (
    <div className="mt-16 bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-10 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
            <Flame className="w-3.5 h-3.5 fill-black" />
            STYLE MATCHER
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
            Complete The <span className="underline decoration-[#FEE715] decoration-4">Streetwear Drip</span>
          </h2>
          <p className="text-xs font-bold text-zinc-500 mt-1">
            Curated accessories engineered to rock with <span className="text-black">{mainProductName}</span>
          </p>
        </div>

        {/* Bundle Add CTA */}
        <button
          type="button"
          onClick={handleAddAllBundle}
          className="bg-[#101820] hover:bg-black text-[#FEE715] font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition border border-black shadow-[3px_3px_0px_0px_rgba(254,231,21,1)] flex items-center gap-2"
        >
          {bundleAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> BUNDLE ADDED TO BAG!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#FEE715]" /> ADD ALL 4 (SAVE 15% • ${bundleDiscounted})
            </>
          )}
        </button>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STREETWEAR_ACCESSORIES.map((item) => {
          const isAdded = addedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-zinc-50 rounded-2xl border-2 border-zinc-200 hover:border-black p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-white p-2 mb-3 border border-zinc-200 flex items-center justify-center">
                  <span className="absolute top-2 left-2 bg-black text-[#FEE715] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm z-10">
                    {item.badge}
                  </span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-extrabold text-sm text-zinc-900 line-clamp-1 mb-0.5">{item.name}</h3>
                <p className="text-[11px] font-medium text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between mt-auto">
                <span className="text-base font-black text-zinc-950">${item.price.toFixed(2)}</span>

                <button
                  type="button"
                  onClick={() => handleAddSingle(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FEE715] hover:bg-yellow-400 text-black border border-black shadow-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Add
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
