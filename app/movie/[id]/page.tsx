
import Link from "next/link"
import ShareButton from './ShareButton'
import Image from "next/image"
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Play,
  Plus,
  Share2,
  Download,
  Star,
  Clock,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

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

// Fetch all videos from the API
async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch("https://movie-frontend-production.up.railway.app/api/video/")
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

// Fetch a single video by ID
async function getVideoById(id: string): Promise<Video | null> {
  try {
    const videos = await getVideos()
    const video = videos.find((v) => v._id === id)
    return video || null
  } catch (error) {
    console.error("Error fetching video by ID:", error)
    return null
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movieId = params.id
  const video = await getVideoById(movieId)

  if (!video) {
    notFound()
  }

  // Get related videos (excluding the current one)
  const allVideos = await getVideos()
  const relatedVideos = allVideos.filter((v) => v._id !== movieId).slice(0, 6)

  // Format the date
  const releaseDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Extract year from createdAt
  const year = new Date(video.createdAt).getFullYear();

  

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

      {/* Back Button (Mobile) */}
      <div className="md:hidden fixed top-16 left-4 z-40">
        <Button variant="ghost" size="icon" className="rounded-full bg-black/50" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="relative pt-16 h-[70vh]">
        <Image
          src={video.thumbnailUrl || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Movie Logo */}
        <div className="absolute bottom-[20%] left-8 md:left-16 w-1/2 md:w-1/3">
          <h1 className="text-4xl md:text-5xl font-bold">{video.title}</h1>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 left-8 md:left-16 flex flex-wrap gap-3 md:gap-4">
          <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 md:px-8" asChild>
            <Link href={`/movie/${video._id}/watch`} >
              <Play className="h-4 w-4 mr-2" />
              Watch
            </Link>
          </Button>
          {/* <Button variant="outline" className="rounded-full border-gray-600 text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Watchlist
          </Button> */}
          <ShareButton/>
          {/* <Button
            variant="outline"
            className="rounded-full border-gray-600 text-white hover:bg-gray-800 hidden md:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button> */}
        </div>
      </div>

      {/* Movie Details */}
      <div className="px-4 md:px-16 py-8 bg-black">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Title and Metadata */}
            <div>
              <div className="flex items-center gap-2 text-sm mb-2 flex-wrap">
                <Badge className="bg-blue-600 hover:bg-blue-700">PREMIUM</Badge>
                <span className="text-gray-400">{year}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">2h 15m</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">U/A 16+</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">4K</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm">8.5/10</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>2h 15m</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{year}</span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full">
                Action
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Adventure
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Sci-Fi
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Thriller
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">About the movie</h2>
              <p className="text-gray-300">
                {video.title} is an exciting movie that you can stream in high quality. This premium content is
                available for streaming directly from our platform. Watch and enjoy this thrilling adventure with
                friends and family.
              </p>
            </div>

            {/* Cast & Crew */}
            {/* <div>
              <h2 className="text-lg font-semibold mb-3">Cast & Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="text-center">
                    <div className="aspect-square relative rounded-full overflow-hidden w-20 h-20 mx-auto mb-2">
                      <Image
                        src={`/placeholder.svg?height=80&width=80&text=Actor%20${item}`}
                        alt={`Actor ${item}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Actor Name {item}</h3>
                    <p className="text-xs text-gray-400">Character {item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-300">
                  <span className="text-gray-400">Director:</span> Famous Director
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-gray-400">Writers:</span> Talented Writer, Creative Writer
                </p>
              </div>
            </div> */}
          </div>

          {/* Right Column - Trailer and More Like This */}
          <div className="space-y-6">
            {/* Video Player */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Watch Trailer</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={video.thumbnailUrl || "/placeholder.svg"}
                  alt={`${video.title} Trailer`}
                  width={480}
                  height={270}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="rounded-full bg-black/50 h-12 w-12" asChild>
                    <Link href={`/movie/${video._id}/watch`} >
                      <Play className="h-6 w-6" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* More Info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">More Info</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Audio:</span> English, Hindi, Tamil, Telugu
                </p>
                <p>
                  <span className="text-gray-400">Subtitles:</span> English, Hindi
                </p>
                <p>
                  <span className="text-gray-400">Audio Quality:</span> Dolby Digital 5.1
                </p>
                <p>
                  <span className="text-gray-400">Video Quality:</span> 4K, HDR
                </p>
                <p>
                  <span className="text-gray-400">Release Date:</span> {releaseDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Like This */}
      <div className="px-4 md:px-16 py-8 bg-black">
        <h2 className="text-xl font-bold mb-4">More Like This</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedVideos.map((relatedVideo) => (
            <Link href={`/movie/${relatedVideo._id}`} key={relatedVideo._id} className="group">
              <div className=" w-full h-[250px] md:h-[200px] rounded-lg overflow-hidden relative">
                <img
                  src={relatedVideo.thumbnailUrl || "/placeholder.svg"}
                  alt={relatedVideo.title}
                 
                  className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div>
                    <h3 className="text-sm font-medium">{relatedVideo.title}</h3>
                    <p className="text-xs text-gray-300">{new Date(relatedVideo.createdAt).getFullYear()} • Movie</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
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

