import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Common brand aliases & misspellings dictionary
const BRAND_ALIASES: Record<string, string> = {
  nik: 'Nike',
  nike: 'Nike',
  nikes: 'Nike',
  jordan: 'Jordan',
  jordans: 'Jordan',
  aj1: 'Jordan',
  aj4: 'Jordan',
  adida: 'Adidas',
  adidas: 'Adidas',
  addidas: 'Adidas',
  puma: 'Puma',
  pumas: 'Puma',
  nb: 'New Balance',
  newbalance: 'New Balance',
  'new balance': 'New Balance',
  vans: 'Vans',
  van: 'Vans',
  converse: 'Converse',
  chuck: 'Converse',
  chucks: 'Converse',
  allstar: 'Converse',
  asics: 'Asics',
  asic: 'Asics',
  asix: 'Asics',
  fila: 'Fila',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || searchParams.get('query') || '').trim();

    // If query is empty, return popular trending recommendations
    if (!query) {
      const trending = await prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({
        results: trending,
        isFallback: false,
        total: trending.length,
      });
    }

    const lowerQuery = query.toLowerCase();

    // Check for "under 100", "under $100", "< 100", "under 150", etc.
    const underPriceMatch = lowerQuery.match(/under\s*\$?(\d+)|<\s*\$?(\d+)/i);
    const maxPrice = underPriceMatch ? parseFloat(underPriceMatch[1] || underPriceMatch[2]) : null;

    // Check for brand alias
    const matchedBrand = Object.entries(BRAND_ALIASES).find(([alias]) =>
      lowerQuery.includes(alias)
    )?.[1];

    // Build search conditions
    const orConditions: any[] = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } },
    ];

    if (matchedBrand) {
      orConditions.push({ brand: { contains: matchedBrand, mode: 'insensitive' } });
    }

    // Split words for multi-term matching (e.g. "nike running", "jordan retro")
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 1);
    if (words.length > 1) {
      words.forEach((word) => {
        orConditions.push(
          { name: { contains: word, mode: 'insensitive' } },
          { brand: { contains: word, mode: 'insensitive' } },
          { category: { contains: word, mode: 'insensitive' } }
        );
      });
    }

    const where: any = { OR: orConditions };

    if (maxPrice !== null) {
      where.price = { lte: maxPrice };
    }

    let results = await prisma.product.findMany({
      where,
      take: 8,
      orderBy: { price: 'asc' },
    });

    // If no results, fetch recommended bestsellers as fallback
    let isFallback = false;
    if (results.length === 0) {
      isFallback = true;
      results = await prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      results,
      isFallback,
      total: results.length,
      query,
    });
  } catch (error) {
    console.error('[search-api] Error:', error);
    return NextResponse.json({ results: [], isFallback: false, total: 0 }, { status: 500 });
  }
}
