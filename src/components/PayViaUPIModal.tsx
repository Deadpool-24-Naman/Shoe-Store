'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone, CreditCard, Banknote, Check, Loader2, Shield, QrCode } from 'lucide-react';

interface PayViaUPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => Promise<void>;
  totalAmount: number;
}

type PayTab = 'upi' | 'card' | 'netbanking';

export default function PayViaUPIModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  totalAmount,
}: PayViaUPIModalProps) {
  const [activeTab, setActiveTab] = useState<PayTab>('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProcessing(false);
      setProcessingStep(0);
      setSuccess(false);
      setUpiId('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');
    }
  }, [isOpen]);

  const PROCESSING_STEPS = [
    'Initiating secure payment...',
    'Verifying UPI credentials...',
    'Connecting to bank server...',
    'Authorising transaction...',
    'Payment confirmed ✓',
  ];

  const handlePay = async () => {
    if (activeTab === 'upi' && !upiId.trim()) return;
    if (activeTab === 'card' && (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !cardName.trim())) return;

    setProcessing(true);

    // Simulate step-by-step payment processing
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise((res) => setTimeout(res, 700 + i * 200));
    }

    setSuccess(true);
    await new Promise((res) => setTimeout(res, 900));

    // Call parent's checkout POST & redirect
    await onPaymentSuccess();
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-md rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#101820] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FEE715] flex items-center justify-center">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-wider">Secure Payment</p>
              <p className="text-[#FEE715] text-[10px] font-bold">256-bit SSL Encrypted</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 rounded-full hover:bg-white/10 transition text-white disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#FEE715] px-6 py-3 flex items-center justify-between">
          <span className="text-black font-black text-xs uppercase tracking-widest">Amount Payable</span>
          <span className="text-black font-black text-2xl">${totalAmount.toFixed(2)}</span>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b-2 border-zinc-100">
          {([
            { id: 'upi', label: 'UPI / GPay', Icon: Smartphone },
            { id: 'card', label: 'Card', Icon: CreditCard },
            { id: 'netbanking', label: 'Net Banking', Icon: Banknote },
          ] as { id: PayTab; label: string; Icon: any }[]).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              disabled={processing}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition border-b-2 -mb-0.5 ${
                activeTab === id
                  ? 'border-black text-black bg-zinc-50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-5">
          {/* Processing / Success overlay */}
          {processing ? (
            <div className="flex flex-col items-center justify-center py-10 gap-6">
              {success ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-zinc-900 uppercase">Payment Successful!</p>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Redirecting to your order…</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-t-4 border-[#101820] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#101820] animate-spin" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                      {PROCESSING_STEPS[processingStep]}
                    </p>
                    <div className="flex gap-1.5 justify-center mt-3">
                      {PROCESSING_STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i <= processingStep ? 'w-6 bg-[#101820]' : 'w-2 bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === 'upi' ? (
            <div className="space-y-5">
              {/* QR Code Placeholder */}
              <div className="flex flex-col items-center gap-3 p-4 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                <div className="w-28 h-28 bg-white rounded-xl border-2 border-zinc-200 flex flex-col items-center justify-center gap-1 p-2">
                  {/* Simple QR-like grid pattern (decorative) */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-[1px] ${
                          [0,1,2,3,4,5,6,7,13,14,20,21,27,28,29,30,31,34,40,41,42,43,44,45,48].includes(i % 49)
                            ? 'bg-black'
                            : 'bg-zinc-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Scan with any UPI app</p>
                <div className="flex items-center gap-2">
                  {['G Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <span key={app} className="text-[9px] font-black bg-white border border-zinc-200 px-1.5 py-0.5 rounded-md text-zinc-600">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-[10px] font-black text-zinc-400 uppercase">Or enter UPI ID</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                  UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi / phone@paytm"
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                />
              </div>
            </div>
          ) : activeTab === 'card' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold font-mono tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="12/26"
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none text-xs font-bold"
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">
                💡 Test card: <span className="font-mono font-bold">4242 4242 4242 4242</span> · Exp: 12/26 · CVV: 123
              </p>
            </div>
          ) : (
            // Net Banking tab
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setUpiId(bank)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-xs font-black transition ${
                      upiId === bank
                        ? 'border-black bg-[#FEE715] text-black'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pay Now Button */}
          {!processing && (
            <button
              onClick={handlePay}
              disabled={
                (activeTab === 'upi' && !upiId.trim()) ||
                (activeTab === 'card' && (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !cardName.trim())) ||
                (activeTab === 'netbanking' && !upiId.trim())
              }
              className="mt-6 w-full bg-[#101820] hover:bg-black active:scale-[0.98] text-[#FEE715] font-black uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(254,231,21,1)] hover:shadow-[2px_2px_0px_0px_rgba(254,231,21,1)] disabled:bg-zinc-300 disabled:text-zinc-500 disabled:border-zinc-300 disabled:shadow-none"
            >
              <Shield className="w-4 h-4" />
              Pay ${totalAmount.toFixed(2)} Securely
            </button>
          )}

          <p className="text-center text-[10px] text-zinc-400 font-medium mt-3">
            🔒 Your payment is 100% simulated for demo purposes
          </p>
        </div>
      </div>
    </div>
  );
}
