'use client';

import { useState } from 'react';
import { X, Ruler, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  currentSelectedSize?: string;
}

interface SizeMapping {
  cm: number;
  us: string;
  uk: string;
  eu: string;
  inches: string;
}

const SIZE_CHART: SizeMapping[] = [
  { cm: 24.0, us: 'US 6', uk: 'UK 5.5', eu: 'EU 38.5', inches: '9.4"' },
  { cm: 24.5, us: 'US 6.5', uk: 'UK 6', eu: 'EU 39', inches: '9.6"' },
  { cm: 25.0, us: 'US 7', uk: 'UK 6', eu: 'EU 40', inches: '9.8"' },
  { cm: 25.5, us: 'US 7.5', uk: 'UK 6.5', eu: 'EU 40.5', inches: '10.0"' },
  { cm: 26.0, us: 'US 8', uk: 'UK 7', eu: 'EU 41', inches: '10.2"' },
  { cm: 26.5, us: 'US 8.5', uk: 'UK 7.5', eu: 'EU 42', inches: '10.4"' },
  { cm: 27.0, us: 'US 9', uk: 'UK 8', eu: 'EU 42.5', inches: '10.6"' },
  { cm: 27.5, us: 'US 9.5', uk: 'UK 8.5', eu: 'EU 43', inches: '10.8"' },
  { cm: 28.0, us: 'US 10', uk: 'UK 9', eu: 'EU 44', inches: '11.0"' },
  { cm: 28.5, us: 'US 10.5', uk: 'UK 9.5', eu: 'EU 44.5', inches: '11.2"' },
  { cm: 29.0, us: 'US 11', uk: 'UK 10', eu: 'EU 45', inches: '11.4"' },
  { cm: 29.5, us: 'US 11.5', uk: 'UK 10.5', eu: 'EU 45.5', inches: '11.6"' },
  { cm: 30.0, us: 'US 12', uk: 'UK 11', eu: 'EU 46', inches: '11.8"' },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
  onSelectSize,
  currentSelectedSize,
}: SizeGuideModalProps) {
  const [footCm, setFootCm] = useState<number>(27.0);

  if (!isOpen) return null;

  // Find closest size match
  const recommended = SIZE_CHART.reduce((prev, curr) => {
    return Math.abs(curr.cm - footCm) < Math.abs(prev.cm - footCm) ? curr : prev;
  });

  const handleApplySize = () => {
    if (onSelectSize) {
      onSelectSize(recommended.us);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-zinc-900 w-full max-w-xl rounded-3xl border-2 border-black shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#101820] text-white p-6 flex items-center justify-between border-b-2 border-[#FEE715]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEE715] text-black flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Find Your Perfect Fit</h2>
              <p className="text-xs text-zinc-400 font-medium">Smart Foot Length to UK/US Size Calculator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Interactive Foot Length Slider & Input */}
          <div className="bg-zinc-50 p-6 rounded-2xl border-2 border-zinc-200">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-800">
                Enter Your Foot Length (Heel to Toe):
              </label>
              <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 rounded-xl shadow-sm">
                <span className="text-lg font-black text-black">{footCm.toFixed(1)}</span>
                <span className="text-xs font-bold text-zinc-500">CM</span>
              </div>
            </div>

            <input
              type="range"
              min="24.0"
              max="30.0"
              step="0.5"
              value={footCm}
              onChange={(e) => setFootCm(parseFloat(e.target.value))}
              className="w-full accent-black cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
            />

            <div className="flex justify-between text-[11px] font-bold text-zinc-400 mt-2">
              <span>24.0 cm (US 6)</span>
              <span>27.0 cm (US 9)</span>
              <span>30.0 cm (US 12)</span>
            </div>
          </div>

          {/* Recommended Size Box */}
          <div className="bg-[#101820] text-white p-6 rounded-2xl border-2 border-[#FEE715] shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1 bg-[#FEE715] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 fill-black" /> RECOMMENDED SIZE
              </span>
              <span className="text-xs text-zinc-400 font-bold">{recommended.inches} Foot Length</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-5">
              <div className="bg-zinc-900/90 border border-zinc-700 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">US SIZE</p>
                <p className="text-2xl font-black text-[#FEE715]">{recommended.us}</p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-700 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">UK SIZE</p>
                <p className="text-2xl font-black text-white">{recommended.uk}</p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-700 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">EU SIZE</p>
                <p className="text-2xl font-black text-white">{recommended.eu}</p>
              </div>
            </div>

            <button
              onClick={handleApplySize}
              className="w-full bg-[#FEE715] hover:bg-yellow-400 text-black font-black uppercase tracking-wider py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" /> Select {recommended.us} for This Shoe
            </button>
          </div>

          {/* Fit Tip */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 font-medium">
            <p className="font-bold mb-0.5">💡 Streetwear Fit Recommendation:</p>
            <p>
              For chunky soles or wide feet, we suggest ordering <strong>half a size up (+0.5)</strong> for optimal comfort.
            </p>
          </div>

          {/* Size Conversion Chart Table */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 mb-3">
              Full Size Chart Reference
            </h4>
            <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-xl text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-100 sticky top-0 font-black uppercase text-[10px] text-zinc-700">
                  <tr>
                    <th className="p-2.5">Foot (CM)</th>
                    <th className="p-2.5">US</th>
                    <th className="p-2.5">UK</th>
                    <th className="p-2.5">EU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
                  {SIZE_CHART.map((s) => (
                    <tr
                      key={s.cm}
                      className={`hover:bg-zinc-50 ${
                        recommended.cm === s.cm ? 'bg-yellow-50 font-bold text-black' : ''
                      }`}
                    >
                      <td className="p-2.5">{s.cm.toFixed(1)} cm</td>
                      <td className="p-2.5">{s.us}</td>
                      <td className="p-2.5">{s.uk}</td>
                      <td className="p-2.5">{s.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
