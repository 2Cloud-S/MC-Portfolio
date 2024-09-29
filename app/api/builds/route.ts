import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    const builds = await client.fetch(`*[_type == "build"] | order(date desc) {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      date
    }`, {}, { cache: 'no-store' })

    console.log('Fetched builds:', JSON.stringify(builds, null, 2))

    if (!Array.isArray(builds)) {
      throw new Error('Fetched data is not an array')
    }

    return NextResponse.json({ builds }, { status: 200, headers: {
      'Cache-Control': 'no-store, max-age=0',
    }})
  } catch (error) {
    console.error('Error fetching builds:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: 'Failed to fetch builds', details: errorMessage }, { status: 500 })
  }
}