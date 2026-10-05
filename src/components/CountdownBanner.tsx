'use client';

import { useState, useEffect } from 'react';
import { Flame, Zap, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const updateCountdown = () => {
      const current = new Date();
      const diff = endOfDay.getTime() - current.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#101820] text-[#FEE715] py-2 px-3 font-black text-[11px] sm:text-xs uppercase tracking-widest border-b-2 border-[#FEE715]/40 flex items-center justify-center">
        <span>⚡ LIMITED DROP FLASH SALE LIVE • 40% OFF</span>
      </div>
    );
  }

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-[#101820] text-white border-b-2 border-[#FEE715] py-2 px-3 sm:px-4 sticky top-0 z-40 shadow-md">
      <div className="container mx-auto">
        
        {/* MOBILE VIEW (< md / < 430px): Concise Single-Line Streetwear Marquee Banner */}
        <div className="md:hidden flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-wider text-[#FEE715]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEE715] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FEE715]"></span>
            </span>
            <Flame className="w-3.5 h-3.5 fill-[#FEE715] shrink-0" />
            <span className="truncate">FLAT 40% OFF • FREE SHIP OVER $99</span>
          </div>
          <Link
            href="/products"
            className="text-black bg-[#FEE715] hover:bg-yellow-400 px-2.5 py-0.5 rounded text-[10px] font-black shrink-0 flex items-center gap-0.5"
          >
            SHOP <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* DESKTOP & TABLET VIEW (md:flex): Full Countdown Timer with Blocks */}
        <div className="hidden md:flex items-center justify-between gap-3 text-xs font-black">
          
          {/* Left: Tagline */}
          <div className="flex items-center gap-2 text-[#FEE715] uppercase tracking-wider">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEE715] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FEE715]"></span>
            </span>
            <Flame className="w-4 h-4 fill-[#FEE715]" />
            <span>LIMITED DROP FLASH SALE:</span>
            <span className="text-white font-medium">UP TO 40% OFF STREET DROPS</span>
          </div>

          {/* Center: Live Countdown Timer */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[11px] hidden lg:inline-block">
              ENDS IN:
            </span>
            
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {/* Hours */}
              <div className="bg-zinc-800 text-[#FEE715] border border-[#FEE715]/40 px-2 py-1 rounded-md shadow-inner flex items-center gap-1">
                <span className="text-sm font-black">{formatDigit(timeLeft.hours)}</span>
                <span className="text-[9px] text-zinc-400 uppercase">H</span>
              </div>
              <span className="text-[#FEE715] font-black">:</span>
              
              {/* Minutes */}
              <div className="bg-zinc-800 text-[#FEE715] border border-[#FEE715]/40 px-2 py-1 rounded-md shadow-inner flex items-center gap-1">
                <span className="text-sm font-black">{formatDigit(timeLeft.minutes)}</span>
                <span className="text-[9px] text-zinc-400 uppercase">M</span>
              </div>
              <span className="text-[#FEE715] font-black">:</span>
              
              {/* Seconds */}
              <div className="bg-[#FEE715] text-black px-2 py-1 rounded-md shadow-inner flex items-center gap-1">
                <span className="text-sm font-black">{formatDigit(timeLeft.seconds)}</span>
                <span className="text-[9px] text-zinc-900 uppercase">S</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Code */}
          <div className="flex items-center gap-2.5">
            <span className="bg-zinc-800 border border-zinc-700 text-[#FEE715] px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">
              USE: DRIP15
            </span>
            <Link
              href="/products"
              className="text-black bg-[#FEE715] hover:bg-yellow-400 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1 hover:translate-x-0.5"
            >
              CLAIM DRIP <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
