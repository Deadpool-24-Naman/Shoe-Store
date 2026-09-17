import { NextResponse } from 'next/server';

interface CouponDefinition {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10 for 10%) or fixed amount in USD
  minOrder?: number;
  description: string;
}

const AVAILABLE_COUPONS: Record<string, CouponDefinition> = {
  FIRST10: {
    code: 'FIRST10',
    type: 'percentage',
    value: 10,
    description: '10% off your entire order',
  },
  DRIP15: {
    code: 'DRIP15',
    type: 'percentage',
    value: 15,
    description: '15% Streetwear VIP Club discount',
  },
  STREET20: {
    code: 'STREET20',
    type: 'percentage',
    value: 20,
    minOrder: 100,
    description: '20% off on orders over $100',
  },
  BEWAKOOF: {
    code: 'BEWAKOOF',
    type: 'percentage',
    value: 25,
    description: '25% Gen-Z Streetwear drop discount',
  },
  FLAT30: {
    code: 'FLAT30',
    type: 'fixed',
    value: 30,
    minOrder: 120,
    description: '$30 flat discount on orders over $120',
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, subtotal = 0 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Please provide a valid coupon code.' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[normalizedCode];

    if (!coupon) {
      return NextResponse.json(
        {
          valid: false,
          error: `Coupon code "${normalizedCode}" is invalid or expired. Try "FIRST10" or "DRIP15".`,
        },
        { status: 400 }
      );
    }

    // Check minimum order amount if required
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `Coupon "${coupon.code}" requires a minimum order subtotal of $${coupon.minOrder.toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: Number(discountAmount.toFixed(2)),
      description: coupon.description,
      message: `🎉 Success! ${coupon.description} has been applied.`,
    });
  } catch (err: any) {
    console.error('[coupon-validate] Error:', err);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon code.' },
      { status: 500 }
    );
  }
}
