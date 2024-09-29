import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    const clientEmail = await client.fetch(`*[_type == "clientEmail"][0].email`, {}, { cache: 'no-store' })

    console.log('Fetched contact email:', clientEmail)

    return NextResponse.json({ contactEmail: clientEmail }, { status: 200, headers: {
      'Cache-Control': 'no-store, max-age=0',
    }})
  } catch (error) {
    console.error('Error fetching contact email:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: 'Failed to fetch contact email', details: errorMessage }, { status: 500 })
  }
}