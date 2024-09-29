import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    const about = await client.fetch(`*[_type == "about"][0] {
      title,
      content,
      "imageUrl": image.asset->url
    }`, {}, { cache: 'no-store' })

    console.log('Fetched about:', JSON.stringify(about, null, 2))

    return NextResponse.json({ about }, { status: 200, headers: {
      'Cache-Control': 'no-store, max-age=0',
    }})
  } catch (error) {
    console.error('Error fetching about:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: 'Failed to fetch about', details: errorMessage }, { status: 500 })
  }
}