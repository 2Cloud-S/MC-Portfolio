import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    console.log('Fetching inventory items from Sanity...')
    const inventoryItems = await client.fetch(`*[_type == "inventoryItem"] {
      _id,
      name,
      level,
      icon
    } | order(name asc)`)
    console.log('Fetched inventory items from Sanity:', JSON.stringify(inventoryItems, null, 2))
    return NextResponse.json(inventoryItems)
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch inventory items', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Failed to fetch inventory items', details: 'An unknown error occurred' }, { status: 500 })
    }
  }
}