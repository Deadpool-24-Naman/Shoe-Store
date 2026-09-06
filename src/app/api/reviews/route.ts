import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET reviews for a product (public)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId query required' }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

// POST a new review (authenticated)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const { productId, rating, comment } = await req.json();
  if (!productId || !rating) {
    return NextResponse.json({ error: 'productId and rating required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await prisma.review.create({
    data: {
      userId: user.id,
      productId,
      rating: Number(rating),
      comment: comment || '',
    },
  });
  return NextResponse.json({ success: true });
}
