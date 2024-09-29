import { PortfolioDashboard } from '@/components/portfolio-dashboard'
import { client } from '@/lib/sanity.client'
import { SanityBuild, SanityInventoryItem, SanityAbout, SanityStoreProduct } from '@/types/sanity'

async function getServerSideData() {
  const builds = await client.fetch<SanityBuild[]>(`*[_type == "build"] | order(date desc) {
    _id,
    title,
    description,
    "imageUrl": image.asset->url,
    date
  }`)

  const inventoryItems = await client.fetch<SanityInventoryItem[]>(`*[_type == "inventoryItem"] {
    _id,
    name,
    level,
    icon
  }`)

  const about = await client.fetch<SanityAbout>(`*[_type == "about"][0] {
    title,
    content,
    "imageUrl": image.asset->url
  }`)

  const clientEmail = await client.fetch<string>(`*[_type == "clientEmail"][0].email`)

  const storeProducts = await client.fetch<SanityStoreProduct[]>(`*[_type == "storeProduct"] {
    _id,
    name,
    description,
    price,
    "imageUrl": image.asset->url,
    url
  }`)

  return {
    builds,
    inventoryItems,
    about,
    contactEmail: clientEmail,
    storeProducts,
  }
}

export default async function Home() {
  const { builds, inventoryItems, about, contactEmail, storeProducts } = await getServerSideData()

  return (
    <PortfolioDashboard 
      initialBuilds={builds} 
      initialInventoryItems={inventoryItems} 
      initialAbout={about} 
      initialContactEmail={contactEmail} 
      initialStoreProducts={storeProducts}
    />
  )
}