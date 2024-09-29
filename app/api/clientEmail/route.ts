import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    const clientEmail = await client.fetch(`*[_type == "clientEmail"][0].email`)
    return NextResponse.json({ email: clientEmail })
  } catch (error) {
    console.error('Error fetching client email:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch client email', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Failed to fetch client email', details: 'An unknown error occurred' }, { status: 500 })
    }
  }
}