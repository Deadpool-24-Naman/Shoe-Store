'use client';

import { Truck, Package, Box, MapPin, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

// Deterministically derives a courier + tracking ID from the order ID string
function getTrackingMeta(orderId: string) {
  const couriers = [
    'Delhivery',
    'BlueDart',
    'Ekart Logistics',
    'Amazon Logistics',
    'DTDC',
    'Xpressbees',
  ];
  const seed = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const courier = couriers[seed % couriers.length];
  const trackingId = `TRK-KICKS-${orderId.slice(-6).toUpperCase()}`;
  return { courier, trackingId };
}

// Derive a deterministic tracking step (0-4) based on order age in hours
function getTrackingStep(createdAt: string): number {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  if (ageHours < 1) return 0;   // Order Placed
  if (ageHours < 12) return 1;  // Packed
  if (ageHours < 36) return 2;  // Dispatched
  if (ageHours < 72) return 3;  // Out for Delivery
  return 4;                     // Delivered
}

const STEPS = [
  { label: 'Order Placed',      Icon: Package,       color: 'text-[#FEE715]', bg: 'bg-[#FEE715]' },
  { label: 'Packed',            Icon: Box,           color: 'text-blue-400',  bg: 'bg-blue-400'  },
  { label: 'Dispatched',        Icon: Truck,         color: 'text-orange-400',bg: 'bg-orange-400'},
  { label: 'Out for Delivery',  Icon: MapPin,        color: 'text-purple-400',bg: 'bg-purple-400'},
  { label: 'Delivered',         Icon: CheckCircle2,  color: 'text-emerald-400',bg:'bg-emerald-400'},
];

interface OrderTrackerProps {
  orderId: string;
  createdAt: string;
  /** Pass true to use a light (white-bg) variant for /orders page */
  lightMode?: boolean;
}

export default function OrderTracker({ orderId, createdAt, lightMode = false }: OrderTrackerProps) {
  const step = getTrackingStep(createdAt);
  const { courier, trackingId } = getTrackingMeta(orderId);

  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const cardBg    = lightMode ? 'bg-zinc-50 border-zinc-200'                 : 'bg-zinc-900 border-zinc-700';
  const headText  = lightMode ? 'text-zinc-900'                               : 'text-white';
  const metaText  = lightMode ? 'text-zinc-500'                               : 'text-zinc-400';
  const labelText = (active: boolean) =>
    active
      ? lightMode ? 'text-zinc-900 font-black' : 'text-white font-black'
      : lightMode ? 'text-zinc-400 font-semibold' : 'text-zinc-600 font-semibold';

  return (
    <div className={`rounded-2xl border-2 p-5 ${cardBg}`}>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Truck className={`w-4 h-4 ${lightMode ? 'text-zinc-700' : 'text-[#FEE715]'}`} />
          <span className={`font-black text-xs uppercase tracking-wider ${headText}`}>
            Order Tracking
          </span>
        </div>
        <Link
          href={`/track-order?id=${orderId}`}
          className="text-[10px] font-black uppercase tracking-wider text-[#FEE715] bg-[#101820] hover:bg-black border border-[#FEE715]/40 px-2.5 py-1 rounded-lg transition"
        >
          Track Live →
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="relative flex items-start justify-between mb-5">
        {/* Background connector line */}
        <div
          className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-300/30"
          aria-hidden
        />
        {/* Filled connector */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-[#FEE715] transition-all duration-700"
          style={{ width: step > 0 ? `${(step / (STEPS.length - 1)) * 92}%` : '0%' }}
          aria-hidden
        />

        {STEPS.map((s, i) => {
          const done    = i < step;
          const current = i === step;
          const pending = i > step;
          return (
            <div key={s.label} className="flex flex-col items-center gap-1.5 z-10 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  done || current
                    ? `${s.bg} border-transparent shadow-lg`
                    : lightMode
                    ? 'bg-zinc-200 border-zinc-300'
                    : 'bg-zinc-800 border-zinc-600'
                } ${current ? 'ring-4 ring-yellow-400/30 scale-110' : ''}`}
              >
                <s.Icon
                  className={`w-4 h-4 ${done || current ? 'text-black' : lightMode ? 'text-zinc-400' : 'text-zinc-600'}`}
                  strokeWidth={2.5}
                />
              </div>
              <span className={`text-[9px] text-center leading-tight max-w-[60px] ${labelText(!pending)}`}>
                {s.label}
              </span>
              {current && (
                <span className="text-[8px] font-black uppercase text-[#FEE715] bg-[#101820] px-1.5 py-0.5 rounded-full border border-[#FEE715]/30">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Meta info row */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-xl p-2.5 ${lightMode ? 'bg-white border border-zinc-200' : 'bg-zinc-800 border border-zinc-700'}`}>
          <p className={`text-[9px] font-black uppercase tracking-wider mb-0.5 ${metaText}`}>Tracking ID</p>
          <p className={`text-[11px] font-black font-mono ${headText}`}>{trackingId}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${lightMode ? 'bg-white border border-zinc-200' : 'bg-zinc-800 border border-zinc-700'}`}>
          <p className={`text-[9px] font-black uppercase tracking-wider mb-0.5 ${metaText}`}>Courier</p>
          <p className={`text-[11px] font-black truncate ${headText}`}>{courier}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${lightMode ? 'bg-white border border-zinc-200' : 'bg-zinc-800 border border-zinc-700'}`}>
          <p className={`text-[9px] font-black uppercase tracking-wider mb-0.5 ${metaText}`}>Est. Delivery</p>
          <p className={`text-[11px] font-black ${step === 4 ? 'text-emerald-500' : headText}`}>
            {step === 4 ? 'Delivered ✓' : formattedDelivery}
          </p>
        </div>
      </div>

      {/* Live status badge */}
      <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 ${lightMode ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-black uppercase tracking-wider ${lightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {STEPS[step].label}
          </p>
          <p className={`text-[9px] font-medium ${lightMode ? 'text-emerald-600' : 'text-zinc-400'}`}>
            {step < 4
              ? `Next: ${STEPS[Math.min(step + 1, 4)].label}`
              : 'Your order has been delivered!'}
          </p>
        </div>
        <Clock className={`w-3.5 h-3.5 shrink-0 ${lightMode ? 'text-emerald-600' : 'text-zinc-500'}`} />
      </div>
    </div>
  );
}
