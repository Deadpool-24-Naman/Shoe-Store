import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_replace_me', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    // 1. Verify authenticated user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to place an order.' },
        { status: 401 }
      );
    }

    // 2. Fetch authenticated user from Neon database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    });

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Authenticated user profile not found in database.' },
        { status: 401 }
      );
    }

    const userId: string = user.id; // STRICTLY NON-NULL USER ID

    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total price
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const origin =
      req.headers.get('origin') ||
      process.env.NEXTAUTH_URL ||
      'http://localhost:3000';

    let stripeSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    let redirectUrl = `${origin}/success?session_id=${stripeSessionId}`;

    // Try creating real Stripe checkout session if valid secret key exists
    if (
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY !== 'sk_test_replace_me'
    ) {
      try {
        const lineItems = items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.name} - Size ${item.size}`,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
        });

        stripeSessionId = stripeSession.id;
        if (stripeSession.url) {
          redirectUrl = stripeSession.url;
        }
      } catch (stripeErr) {
        console.warn('Stripe checkout creation failed fallback to demo session:', stripeErr);
      }
    }

    // 3. EXPLICITLY CREATE ORDER IN NEON DATABASE WITH STRICT USER ID
    const order = await prisma.order.create({
      data: {
        userId, // Strictly non-null authenticated User ID
        total: totalAmount,
        status: 'PAID',
        items: JSON.stringify(items),
        stripeSessionId,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
      },
    });

    console.log(`Order successfully created for authenticated user! Order ID: ${order.id}, User ID: ${userId}`);

    return NextResponse.json({
      url: redirectUrl,
      orderId: order.id,
      stripeSessionId,
      total: totalAmount,
    });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
