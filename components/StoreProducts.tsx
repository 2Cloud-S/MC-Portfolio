import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { SanityStoreProduct } from '@/types/sanity'

interface StoreProductsProps {
  initialProducts: SanityStoreProduct[]
}

export default function StoreProducts({ initialProducts }: StoreProductsProps) {
  const [storeProducts, setStoreProducts] = useState<SanityStoreProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStoreProducts() {
      setIsLoading(true)
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/store-products?t=${timestamp}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched store products:', data)
        if (Array.isArray(data.products)) {
          setStoreProducts(data.products)
        } else {
          throw new Error('Received data is not an array')
        }
      } catch (error) {
        console.error('Error fetching store products:', error)
        setError(`Failed to load store products: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreProducts()
  }, [])

  if (isLoading) {
    return <p className="text-center text-xl">Loading store products...</p>
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">{error}</p>
  }

  if (storeProducts.length === 0) {
    return <p className="text-center text-xl">No store products found.</p>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {storeProducts.map((product) => (
          <motion.div
            key={product._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative h-48">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-400">${product.price.toFixed(2)}</span>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}