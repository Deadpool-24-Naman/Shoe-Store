import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/orders - Fetch logged in user's order history
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found in database.' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Directly create an order record for authenticated user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to create an order.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    });

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Authenticated user not found in database.' },
        { status: 401 }
      );
    }

    const userId: string = user.id; // STRICTLY NON-NULL USER ID

    const body = await req.json();
    const { items, total, stripeSessionId, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart items required' }, { status: 400 });
    }

    const totalAmount = total || items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const sessionRef = stripeSessionId || `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const order = await prisma.order.create({
      data: {
        userId, // Strictly non-null
        total: totalAmount,
        status: 'PAID',
        items: typeof items === 'string' ? items : JSON.stringify(items),
        stripeSessionId: sessionRef,
        shippingAddress: shippingAddress ? (typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress)) : null,
      },
    });

    return NextResponse.json({ message: 'Order created successfully', order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
