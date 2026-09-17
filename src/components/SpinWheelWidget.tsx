'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Gift, X, Check, ArrowRight, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';

interface WheelReward {
  label: string;
  code: string;
  color: string;
  textColor: string;
  discount: string;
}

const REWARDS: WheelReward[] = [
  { label: '15% OFF', code: 'DRIP15', color: '#FEE715', textColor: '#000000', discount: '15% Off VIP Club' },
  { label: 'FREE SHIP', code: 'FREESHIP', color: '#8B5CF6', textColor: '#FFFFFF', discount: 'Free Shipping + $15 Off' },
  { label: '20% OFF', code: 'SPIN20', color: '#101820', textColor: '#FEE715', discount: '20% Off Streetwear Drop' },
  { label: '10% OFF', code: 'FIRST10', color: '#10B981', textColor: '#000000', discount: '10% Off Everything' },
  { label: '25% OFF', code: 'BEWAKOOF', color: '#FF3E6C', textColor: '#FFFFFF', discount: '25% Off Gen-Z Drop' },
  { label: '15% OFF', code: 'DRIP15', color: '#F59E0B', textColor: '#000000', discount: '15% Streetwear Discount' },
];

export default function SpinWheelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<WheelReward | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-prompt after 5 seconds on first visit if not spun yet
    const timer = setTimeout(() => {
      const alreadySpun = localStorage.getItem('kicks_has_spun');
      if (!alreadySpun) {
        setIsOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonReward(null);

    // Pick a winning index (0 to 5)
    const winningIndex = Math.floor(Math.random() * REWARDS.length);
    const segmentAngle = 360 / REWARDS.length;
    
    // We want the wheel to spin at least 5 full rotations (1800 deg) plus landing on segment
    // Arrow is at the top (270 deg or 0 deg).
    const extraRounds = 5 * 360;
    const targetAngle = extraRounds + (360 - winningIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonReward(REWARDS[winningIndex]);
      setHasSpun(true);
      try {
        localStorage.setItem('kicks_has_spun', 'true');
        localStorage.setItem('kicks_saved_coupon', REWARDS[winningIndex].code);
      } catch {}
    }, 4000);
  };

  const handleCopyCode = () => {
    if (wonReward) {
      navigator.clipboard.writeText(wonReward.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <>
      {/* Floating Bottom-Left Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#101820] text-[#FEE715] hover:bg-black p-3.5 sm:px-5 sm:py-3.5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)] transition-all hover:scale-105"
          aria-label="Spin the Wheel Discount"
        >
          <div className="relative">
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEE715] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FEE715]"></span>
            </span>
          </div>
          <span className="hidden sm:inline-block font-black text-xs uppercase tracking-wider">
            SPIN &amp; WIN
          </span>
        </button>
      </div>

      {/* Pop-up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white text-zinc-900 w-full max-w-lg rounded-3xl border-2 border-black shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-[#101820] text-white p-6 pb-5 flex items-center justify-between border-b-2 border-[#FEE715]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FEE715] text-black flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Streetwear Lucky Wheel</h2>
                  <p className="text-xs text-zinc-400 font-medium">Spin to unlock secret promo codes</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              
              {!wonReward ? (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 border border-black">
                    <Sparkles className="w-3.5 h-3.5 fill-black" /> 100% CHANCE TO WIN
                  </div>

                  {/* Wheel Container */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
                    
                    {/* Center Top Needle Arrow */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-8 border-x-transparent border-t-[18px] border-t-red-600 filter drop-shadow-md" />

                    {/* Rotating SVG Wheel */}
                    <div
                      className="w-full h-full rounded-full border-4 border-black shadow-xl overflow-hidden transition-transform duration-[4000ms] ease-out"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {REWARDS.map((reward, i) => {
                          const angle = 360 / REWARDS.length;
                          const startAngle = i * angle;
                          const endAngle = startAngle + angle;
                          
                          // SVG Pie slice path
                          const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                          const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                          const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                          const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                          const textAngle = startAngle + angle / 2;
                          const textX = 50 + 32 * Math.cos((Math.PI * textAngle) / 180);
                          const textY = 50 + 32 * Math.sin((Math.PI * textAngle) / 180);

                          return (
                            <g key={i}>
                              <path
                                d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                                fill={reward.color}
                                stroke="#101820"
                                strokeWidth="0.8"
                              />
                              <text
                                x={textX}
                                y={textY}
                                fill={reward.textColor}
                                fontSize="4.2"
                                fontWeight="900"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                              >
                                {reward.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Center Knob */}
                    <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#101820] border-4 border-[#FEE715] flex items-center justify-center shadow-lg z-10">
                      <Sparkles className="w-6 h-6 text-[#FEE715]" />
                    </div>
                  </div>

                  {/* Spin CTA Button */}
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={handleSpin}
                    className="w-full mt-6 bg-[#101820] hover:bg-black active:scale-[0.98] text-[#FEE715] font-black uppercase tracking-wider py-4 px-8 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)] disabled:opacity-60"
                  >
                    {isSpinning ? 'SPINNING THE DRIP WHEEL...' : 'SPIN WHEEL NOW 🎡'}
                  </button>

                  <p className="text-[11px] text-zinc-400 font-bold mt-3">
                    Valid for 1 spin per shopper. Code applies automatically at checkout.
                  </p>
                </>
              ) : (
                /* Celebration View on Win */
                <div className="space-y-5 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 rounded-3xl bg-[#FEE715] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                      🎉 CONGRATULATIONS!
                    </span>
                    <h3 className="text-3xl font-black uppercase text-zinc-900">
                      YOU WON {wonReward.label}!
                    </h3>
                    <p className="text-zinc-500 font-medium text-xs mt-1">
                      {wonReward.discount}
                    </p>
                  </div>

                  {/* Coupon Code Pill */}
                  <div className="bg-zinc-100 border-2 border-dashed border-black p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">YOUR COUPON CODE</p>
                      <p className="text-2xl font-black font-mono tracking-widest text-black">{wonReward.code}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="bg-[#101820] hover:bg-black text-[#FEE715] font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl border border-black transition flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" /> COPIED!
                        </>
                      ) : (
                        'COPY CODE'
                      )}
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/cart`}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-[#FEE715] hover:bg-yellow-400 text-black font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 border-2 border-black shadow-md transition"
                    >
                      GO TO BAG &amp; APPLY <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-600 hover:text-black border-2 border-zinc-200 rounded-2xl transition"
                    >
                      Keep Browsing
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}
