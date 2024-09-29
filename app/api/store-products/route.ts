import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';

export async function GET() {
  try {
    const storeProducts = await client.fetch(`*[_type == "storeProduct"] {
      _id,
      name,
      description,
      price,
      "imageUrl": image.asset->url,
      url
    }`);

    console.log('Fetched store products:', JSON.stringify(storeProducts, null, 2));

    return NextResponse.json({ products: storeProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching store products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch store products', details: errorMessage }, { status: 500 });
  }
}