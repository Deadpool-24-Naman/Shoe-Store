'use client';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
        ✓
      </div>
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your order. We've received your payment and will begin processing it shortly.
      </p>
      <Link href="/products" className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full transition inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
