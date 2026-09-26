'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1920&auto=format&fit=crop',
    alt: 'Streetwear sneaker collection on display shelf',
  },
  {
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1920&auto=format&fit=crop',
    alt: 'Lifestyle sneaker photography with urban backdrop',
  },
  {
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1920&auto=format&fit=crop',
    alt: 'Bold high-top sneakers streetwear aesthetic',
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920&auto=format&fit=crop',
    alt: 'Vibrant red sneaker floating on gradient background',
  },
  {
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop',
    alt: 'Classic sneaker pair with warm color tones',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % HERO_SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Slides */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#101820]/90 via-[#101820]/75 to-[#101820]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/80 via-transparent to-[#101820]/40" />

      {/* Arrow Controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              i === current
                ? 'w-8 h-2.5 bg-[#FEE715]'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
