'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Play, Search, Bell, Settings, ChevronRight, Youtube, Twitter, Mail, Loader, X, Copy, CheckCircle, DollarSign, ShoppingCart } from 'lucide-react'
import { getYouTubeData } from '@/lib/youtube'
import { SanityBuild, SanityInventoryItem, YouTubeChannelInfo, SanityAbout, SanityStoreProduct } from '@/types/sanity'
import { PortableText } from '@portabletext/react'
import { getYouTubeStoreProducts } from '@/lib/youtube'
import dynamic from 'next/dynamic'
import Image from 'next/image'

interface FloatingBlockProps {
  x: number;
  y: number;
  size: number;
  color: string;
}

const FloatingBlock: React.FC<FloatingBlockProps> = ({ x, y, size, color }) => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      y: [y, y - 20, y],
      opacity: [0, 1, 0],
      transition: { duration: 3, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }
    })
  }, [controls, y])

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{ left: x, width: size, height: size, backgroundColor: color }}
      animate={controls}
    />
  )
}

const RainEffect = () => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-blue-400 w-0.5 h-10"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${0.2 + Math.random() * 0.3}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
)

const SnowEffect = () => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full w-2 h-2"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
)

const FogEffect = () => (
  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 pointer-events-none" />
)

const LightningEffect = () => (
  <div className="absolute inset-0 bg-white bg-opacity-90 pointer-events-none" />
)

// Add this interface to define the shape of a floating block
interface FloatingBlock {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const DynamicStoreProducts = dynamic(() => import('./StoreProducts'), {
  loading: () => <p>Loading store products...</p>,
  ssr: false
})

interface PortfolioDashboardProps {
  initialBuilds: SanityBuild[]
  initialInventoryItems: SanityInventoryItem[]
  initialAbout: SanityAbout
  initialContactEmail: string
  initialStoreProducts: SanityStoreProduct[]
}

export function PortfolioDashboard({
  initialBuilds,
  initialInventoryItems,
  initialAbout,
  initialContactEmail,
  initialStoreProducts
}: PortfolioDashboardProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])
  const [activeTab, setActiveTab] = useState('videos')
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [isDay, setIsDay] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [floatingBlocks, setFloatingBlocks] = useState<FloatingBlock[]>([])
  const [isRaining, setIsRaining] = useState(false)
  const [videos, setVideos] = useState<any[]>([]) // Explicitly type videos as an array
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo | null>(null)
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [builds, setBuilds] = useState(initialBuilds)
  const [about, setAbout] = useState(initialAbout)
  const [selectedBuild, setSelectedBuild] = useState<SanityBuild | null>(null)
  const [inventoryItems, setInventoryItems] = useState<SanityInventoryItem[]>(initialInventoryItems)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [contactEmail, setContactEmail] = useState(initialContactEmail)
  const [weather, setWeather] = useState('clear')
  const [showLightning, setShowLightning] = useState(false)
  const [storeProducts, setStoreProducts] = useState(initialStoreProducts)
  const [searchTerm, setSearchTerm] = useState('')

  const navItems = [
    { name: 'Videos', icon: Play },
    { name: 'Builds', icon: Search },
    { name: 'About', icon: Bell },
    { name: 'Contact', icon: Mail },
    { name: 'Store', icon: ShoppingCart }, // Add this line
  ]

  const featuredBuilds = [
    { title: 'Medieval Castle', image: '/placeholder.svg?height=200&width=300' },
    { title: 'Futuristic City', image: '/placeholder.svg?height=200&width=300' },
    { title: 'Underwater Base', image: '/placeholder.svg?height=200&width=300' },
  ]

  useEffect(() => {
    async function fetchYouTubeData() {
      setIsLoadingVideos(true)
      try {
        const channelId = 'UCt_21sH4L0R4QGbp9NZNNMg' // BluJayMC's actual channel ID
        const data = await getYouTubeData(channelId, 5) // Explicitly request 5 videos
        setVideos(data.videos || [])
        setChannelInfo(data.channelInfo || null)
      } catch (err) {
        console.error('Error fetching YouTube data:', err)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setIsLoadingVideos(false)
      }
    }

    fetchYouTubeData()
  }, [])

  useEffect(() => {
    const createParticle = () => {
      return {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 10 + 5,
        color: ['#8B4513', '#228B22', '#4682B4'][Math.floor(Math.random() * 3)],
      }
    }

    const initialParticles = Array.from({ length: 20 }, createParticle)
    setParticles(initialParticles)

    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        const newParticles = prevParticles.map((particle) => ({
          ...particle,
          y: particle.y < window.innerHeight ? particle.y + 1 : -particle.size,
        }))
        return newParticles
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const dayNightCycle = setInterval(() => {
      setIsDay((prev) => !prev)
      const weatherTypes = ['clear', 'rain', 'snow', 'fog']
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
      setWeather(newWeather)

      // Chance for lightning during rain
      if (newWeather === 'rain' && Math.random() > 0.7) {
        setShowLightning(true)
        setTimeout(() => setShowLightning(false), 100)
      }
    }, 30000) // Change every 30 seconds

    return () => clearInterval(dayNightCycle)
  }, [])

  useEffect(() => {
    const createFloatingBlock = (): FloatingBlock => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 10,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    });

    const initialBlocks = Array.from({ length: 5 }, createFloatingBlock);
    setFloatingBlocks(initialBlocks);

    const interval = setInterval(() => {
      setFloatingBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks]
        const indexToReplace = Math.floor(Math.random() * newBlocks.length)
        newBlocks[indexToReplace] = createFloatingBlock()
        return newBlocks
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchLatestData() {
      try {
        const [buildsResponse, aboutResponse, contactResponse, storeResponse] = await Promise.all([
          fetch('/api/builds'),
          fetch('/api/about'),
          fetch('/api/contact'),
          fetch('/api/store-products')
        ])

        const buildsData = await buildsResponse.json()
        const aboutData = await aboutResponse.json()
        const contactData = await contactResponse.json()
        const storeData = await storeResponse.json()

        setBuilds(buildsData.builds)
        setAbout(aboutData.about)
        setContactEmail(contactData.contactEmail)
        setStoreProducts(storeData.products)
      } catch (error) {
        console.error('Error fetching latest data:', error)
      }
    }

    fetchLatestData()
  }, [])

  useEffect(() => {
    async function fetchInventoryItems() {
      try {
        console.log('Fetching inventory items...')
        const response = await fetch('/api/inventory')
        const data = await response.json()
        console.log('Fetched inventory items:', data)
        setInventoryItems(data)
      } catch (error) {
        console.error('Error fetching inventory items:', error)
      }
    }

    fetchInventoryItems()
  }, [])

  useEffect(() => {
    console.log('Current builds state:', builds)
  }, [builds])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleBlockClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    target.style.transition = 'all 0.5s'
    target.style.opacity = '0'
    target.style.transform = 'scale(0.8)'
    setTimeout(() => {
      target.style.opacity = '1'
      target.style.transform = 'scale(1)'
    }, 500)
  }, [])

  const handleBuildClick = (build: SanityBuild) => {
    setSelectedBuild(build)
  }

  const closeModal = () => {
    setSelectedBuild(null)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleEmailClick = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`, '_blank')
  }

  // Memoize the filtered videos based on the search term
  const filteredVideos = useMemo(() => {
    return videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [videos, searchTerm]);

  // Memoize the sorted builds
  const sortedBuilds = useMemo(() => {
    return [...builds].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [builds]);

  // Add this useEffect for logging
  useEffect(() => {
    console.log('Rendered builds:', builds)
  }, [builds])

  return (
    <div 
      className={`min-h-screen p-6 relative overflow-hidden transition-colors duration-5000 ${isDay ? 'bg-sky-200' : 'bg-gray-900'}`}
      onClick={handleBlockClick}
    >
      {/* Minecraft-inspired background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-sm"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                left: particle.x,
                top: particle.y,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Floating blocks */}
      {floatingBlocks.map((block) => (
        <FloatingBlock key={block.id} x={block.x} y={block.y} size={block.size} color={block.color} />
      ))}

      {/* Rain effect */}
      {!isDay && isRaining && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, index) => (
            <div
              key={index}
              className="absolute bg-blue-200 w-px h-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
                animation: `fall ${Math.random() * 0.5 + 0.5}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}

      <header className="flex justify-between items-center mb-8 relative z-10">
        <h1 className={`text-3xl font-bold pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>BluJayMC</h1>
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <motion.button
                  className="flex flex-col items-center"
                  onHoverStart={() => setHoveredIcon(item.name)}
                  onHoverEnd={() => setHoveredIcon(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                >
                  <item.icon
                    className={`w-8 h-8 ${
                      hoveredIcon === item.name ? 'text-blue-400' : isDay ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                  <span className={`text-sm mt-1 ${isDay ? 'text-gray-800' : 'text-white'}`}>{item.name}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mb-12">
          <div className="relative h-80 rounded-lg overflow-hidden mb-4">
            <Image
              src={channelInfo?.thumbnailUrl || "/placeholder.svg?height=320&width=1280"}
              alt="BluJayMC banner"
              layout="fill"
              objectFit="cover"
              className="pixelated"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
            <div className="absolute bottom-6 left-6 flex items-center">
              <Image
                src={channelInfo?.thumbnailUrl || "/placeholder.svg?height=80&width=80"}
                alt="BluJayMC avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-white pixelated"
              />
              <div className="ml-4">
                <h2 className="text-4xl font-bold mb-2 pixelated text-white">{channelInfo?.title || "BluJayMC"}</h2>
                <p className="text-xl text-white">Minecraft Builder & YouTuber</p>
                {channelInfo && (
                  <p className="text-sm text-white">{channelInfo.subscriberCount} subscribers • {channelInfo.videoCount} videos</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <motion.a
              href="https://www.youtube.com/@BluJayMC/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 mr-2" />
              Watch Latest Videos
            </motion.a>
            <motion.button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInventoryOpen(!inventoryOpen)}
            >
              <Search className="w-6 h-6 mr-2" />
              Toggle Inventory
            </motion.button>
          </div>
        </section>

        {activeTab === 'videos' && (
          <section className="mb-12">
            <h3 className={`text-2xl font-bold mb-4 pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>Latest Videos</h3>
            {isLoadingVideos ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <p className={`text-lg ${isDay ? 'text-red-600' : 'text-red-400'}`}>{error}</p>
            ) : videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold mb-2 pixelated text-white">{video.title}</h4>
                      <p className="text-sm text-gray-400">{new Date(video.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-lg ${isDay ? 'text-gray-800' : 'text-white'}`}>No videos found.</p>
            )}
          </section>
        )}

        {activeTab === 'builds' && (
          <section className="mb-12">
            <h3 className={`text-2xl font-bold mb-4 pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>Builds</h3>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : builds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedBuilds.map((build) => (
                  <motion.div
                    key={build._id}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBuild(build)}
                  >
                    {build.imageUrl && (
                      <Image
                        src={build.imageUrl}
                        alt={build.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="text-xl font-bold mb-2 text-white">{build.title}</h4>
                      <p className="text-gray-300">{build.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No builds found.</p>
            )}
          </section>
        )}

        {activeTab === 'about' && (
          <section className="mb-12">
            <h3 className={`text-2xl font-bold mb-4 pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>About BluJayMC</h3>
            <div className="bg-gray-800 rounded-lg p-6">
              {about ? (
                <>
                  <h4 className="text-xl font-bold mb-2 text-white">{about.title}</h4>
                  <div className="text-white mb-4">
                    <PortableText value={about.content} />
                  </div>
                  {about.image && about.image.asset && (
                    <Image
                      src={about.image.asset.url}
                      alt="About BluJayMC"
                      width={640}
                      height={480}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </>
              ) : (
                <p className="text-white">Loading about content...</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="mb-12">
            <h3 className={`text-2xl font-bold mb-4 pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>Contact Me</h3>
            <div className={`bg-${isDay ? 'white' : 'gray-800'} p-6 rounded-lg shadow-lg`}>
              <p className={`mb-4 ${isDay ? 'text-gray-700' : 'text-gray-300'}`}>
                Feel free to reach out to me at:
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <Mail className={`w-5 h-5 ${isDay ? 'text-gray-600' : 'text-gray-400'}`} />
                <span className={`${isDay ? 'text-gray-800' : 'text-white'}`}>{contactEmail}</span>
                <button
                  onClick={handleCopyEmail}
                  className={`ml-2 p-1 rounded ${isDay ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {copiedEmail ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCopyEmail}
                  className={`px-4 py-2 rounded ${
                    isDay
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Copy Email
                </button>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded ${
                    isDay
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Compose Email
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'store' && (
          <section className="mb-12">
            <h3 className={`text-2xl font-bold mb-4 pixelated ${isDay ? 'text-gray-800' : 'text-white'}`}>Store</h3>
            <DynamicStoreProducts initialProducts={storeProducts} />
          </section>
        )}

        {/* Minecraft-style Inventory */}
        <AnimatePresence>
          {inventoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setInventoryOpen(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4 pixelated text-white">BluJayMC's Skills</h3>
                <div className="grid grid-cols-3 gap-4">
                  {inventoryItems.length > 0 ? (
                    inventoryItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className={`bg-gray-700 p-4 rounded-lg text-center ${item.level >= 8 ? 'pulsing-glow' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="font-bold pixelated text-white">{item.name}</div>
                        <div className={`text-yellow-400 ${item.level >= 8 ? 'font-bold' : ''}`}>
                          Level {item.level}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white col-span-3">No inventory items found. (Length: {inventoryItems.length})</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Build details modal */}
        <AnimatePresence>
          {selectedBuild && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4 pixelated text-white">{selectedBuild.title}</h3>
                <p className="text-white mb-4">{selectedBuild.description}</p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={closeModal}
                >
                  Close
                  <X className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className={`mt-12 pt-8 border-t ${isDay ? 'border-gray-300' : 'border-gray-800'} relative z-10`}>
        <div className="flex justify-between items-center">
          <div className={`text-sm ${isDay ? 'text-gray-600' : 'text-gray-400'}`}>
            © 2023 BluJayMC. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <motion.a
              href="https://youtube.com/BluJayMC"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube className={`w-6 h-6 ${isDay ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`} />
              <span className="sr-only">YouTube</span>
            </motion.a>
            <motion.a
              href="https://twitter.com/BluJayGames"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter className={`w-6 h-6 ${isDay ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`} />
              <span className="sr-only">Twitter</span>
            </motion.a>
            <motion.a
              href="https://patreon.com/BluJayGames"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <DollarSign className={`w-6 h-6 ${isDay ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`} />
              <span className="sr-only">Patreon</span>
            </motion.a>
          </div>
        </div>
      </footer>

      {weather === 'rain' && <RainEffect />}
      {weather === 'snow' && <SnowEffect />}
      {weather === 'fog' && <FogEffect />}
      {showLightning && <LightningEffect />}
    </div>
  )
}