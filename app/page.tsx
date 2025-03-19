import Link from "next/link"
import Image from "next/image"
import { Search, Bell, User, ChevronDown, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the Video type based on the API response
interface Video {
  _id: string
  title: string
  thumbnailUrl: string
  videoUrl: string
  createdAt: string
  parts: any[]
  __v: number
}

// Define the API response type
interface ApiResponse {
  success: boolean
  fetch: string
  videos: Video[]
}

// Fetch videos from the API
async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch("https://movie-frontend-production.up.railway.app/api/video/", {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch videos")
    }
    const data: ApiResponse = await response.json()
    return data.videos
  } catch (error) {
    console.error("Error fetching videos:", error)
    return []
  }
}

export default async function HomePage() {
  const videos = await getVideos()

  // Create different categories by slicing the videos array
  const featuredVideo = videos[0]
  const continueWatching = videos.slice(0, 5)
  const trendingNow = videos
  const popularShows = videos.slice(0, 5)
  const newReleases = videos.slice(0, 5).reverse()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=120"
              alt="JioHotstar Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-400">
              Home
            </Link>
            <Link href="/tv" className="text-sm font-medium hover:text-blue-400">
              TV
            </Link>
            <Link href="/movies" className="text-sm font-medium hover:text-blue-400">
              Movies
            </Link>
            <Link href="/sports" className="text-sm font-medium hover:text-blue-400">
              Sports
            </Link>
            <div className="flex items-center gap-1 text-sm font-medium hover:text-blue-400 cursor-pointer">
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-900/60 border border-gray-700 rounded-full py-1 px-4 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[200px]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Search className="h-5 w-5 md:hidden" />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Banner */}
      {featuredVideo && (
        <div className="relative pt-16 h-[80vh]">
          <Image
            src={featuredVideo.thumbnailUrl || "/placeholder.svg"}
            alt={featuredVideo.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">PREMIUM</span>
              <span>Movie</span>
              <span>•</span>
              <span>{new Date(featuredVideo.createdAt).getFullYear()}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{featuredVideo.title}</h1>
            <p className="text-sm md:text-base text-gray-300">
              Watch this exciting movie with premium quality streaming.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6" asChild>
                <Link href={`/movie/${featuredVideo._id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full border-gray-600 text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="px-4 md:px-8 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start gap-8 px-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-gray-400 pb-2"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="shows"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-gray-400 pb-2"
            >
              Shows
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-gray-400 pb-2"
            >
              Movies
            </TabsTrigger>
            <TabsTrigger
              value="sports"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-gray-400 pb-2"
            >
              Sports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {/* Continue Watching */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {continueWatching.map((video) => (
                  <Link href={`/movie/${video._id}`} key={video._id} className="group relative">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                        width={480}
                        height={270}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium truncate">{video.title}</h3>
                        <div className="bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Now */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Trending Now</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingNow.map((video) => (
                  <Link href={`/movie/${video._id}`} key={video._id} className="group">
                    <div className=" w-full h-[250px] md:h-[200px] rounded-lg overflow-hidden relative">
                      <img
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                       
                        className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div>
                          <h3 className="text-sm font-medium">{video.title}</h3>
                          <p className="text-xs text-gray-300">{new Date(video.createdAt).getFullYear()} • Movie</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Shows */}
            {/* <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Popular Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularShows.map((video) => (
                  <Link href={`/movie/${video._id}`} key={video._id} className="group">
                    <div className="w-full h-[250px] md:h-[200px] rounded-lg overflow-hidden relative">
                      <img
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                       
                        className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div>
                          <h3 className="text-sm font-medium">{video.title}</h3>
                          <p className="text-xs text-gray-300">{new Date(video.createdAt).getFullYear()} • Show</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div> */}

            {/* New Releases */}
            {/* <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">New Releases</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newReleases.map((video) => (
                  <Link href={`/movie/${video._id}`} key={video._id} className="group">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                      <Image
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                        width={300}
                        height={450}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div>
                          <h3 className="text-sm font-medium">{video.title}</h3>
                          <p className="text-xs text-gray-300">{new Date(video.createdAt).getFullYear()} • New</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div> */}
          </TabsContent>

          <TabsContent value="shows" className="mt-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">Shows content would appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">Movies content would appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="sports" className="mt-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">Sports content would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 md:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4">View Website in</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    English
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Hindi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Tamil
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Telugu
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4">Need Help?</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4">Connect with Us</h3>
              <div className="flex gap-4 mt-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">© Made By Ritik</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

