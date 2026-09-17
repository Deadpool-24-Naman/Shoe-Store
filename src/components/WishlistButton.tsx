'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WishlistButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session?.user?.email) {
      fetch('/api/wishlist')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            const exists = data.some((item: any) => item?.id === productId);
            setIsWishlisted(exists);
          }
        })
        .catch(() => {});
    }
  }, [mounted, productId, session?.user?.email]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent('/products')}`);
      return;
    }

    setLoading(true);
    const method = isWishlisted ? 'DELETE' : 'POST';
    try {
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        router.refresh();
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 z-10 ${
        isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label="Toggle Wishlist"
    >
      <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  );
}
