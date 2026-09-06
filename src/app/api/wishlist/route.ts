import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
    include: { wishlists: { include: { product: true } } },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const items = user.wishlists.map(w => w.product);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await prisma.wishlist.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: {},
    create: { userId: user.id, productId },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await prisma.wishlist.deleteMany({
    where: { userId: user.id, productId },
  });
  return NextResponse.json({ success: true });
}
