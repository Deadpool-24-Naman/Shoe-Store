'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const rating = Number((form.elements.namedItem('rating') as HTMLSelectElement).value);
    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });
      form.reset();
      setSubmitted(true);
      await fetchReviews();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        {avgRating && (
          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full border border-yellow-200">
            ★ {avgRating} / 5 &nbsp;·&nbsp; {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Existing Reviews */}
      {loading ? (
        <p className="text-gray-400 text-sm mb-6">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm mb-6">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-5 mb-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 text-sm">
                  {rev.user?.name || rev.user?.email?.split('@')[0] || 'Anonymous'}
                </p>
                <p className="text-[11px] text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-yellow-500 text-sm mb-1">
                {'★'.repeat(rev.rating)}
                <span className="text-gray-200">{'★'.repeat(5 - rev.rating)}</span>
              </p>
              <p className="text-gray-700 text-sm">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submit Review */}
      {session?.user ? (
        submitted ? (
          <p className="text-green-600 font-medium">✓ Thanks for your review!</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900">Write a Review</h3>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Rating</span>
              <select
                name="rating"
                defaultValue="5"
                className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {'★'.repeat(v)} {v} star{v > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Comment</span>
              <textarea
                name="comment"
                rows={3}
                placeholder="Share your thoughts about this shoe…"
                className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )
      ) : (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent('/products/' + productId)}`}
            className="text-blue-600 font-semibold underline"
          >
            Log in
          </Link>{' '}
          to leave a review.
        </p>
      )}
    </div>
  );
}
