"use client"
import Link from "next/link"
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
import { useEffect, useState } from "react"

import dynamic from "next/dynamic"

// Dynamically import the VideoPlayer component to avoid SSR issues with HLS.js
const VideoPlayer = dynamic(() => import("@/app/video-player"), { ssr: false })

interface Video {
  _id: string
  title: string
  thumbnailUrl: string
  videoUrl: string
  createdAt: string
  parts: any[]
  __v: number
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://movie-frontend-production.up.railway.app/api/video/")

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()
        const foundVideo = data.videos.find((v: Video) => v._id === params.id)

        if (foundVideo) {
          setVideo(foundVideo)
        } else {
          setError("Video not found")
        }
      } catch (err) {
        setError("Error loading video")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-white mb-4">{error || "Video not found"}</div>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
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
    <div className="h-screen bg-black flex flex-col">
      {/* Back button */}
      <div className="p-[4rem]">
        <Button variant="ghost" size="icon" className="text-white" asChild>
          <Link href={`/movie/${params.id}`}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* Video player */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full max-w-7xl mx-auto">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            autoPlay={true}
            controls={true}
            className="max-h-[calc(100vh-100px)]"
          />
        </div>
      </div>

      {/* Video title */}
      {/* <div className="p-4">
        <h1 className="text-white text-xl font-bold">{video.title}</h1>
      </div> */}
    </div>
    </>
  )
}

