"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  className?: string
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  controls = true,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Function to initialize HLS
    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
        })
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch((error) => {
              console.error("Error attempting to autoplay:", error)
            })
          }
        })

        return () => {
          hls.destroy()
        }
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = src
        video.addEventListener("loadedmetadata", () => {
          if (autoPlay) {
            video.play().catch((error) => {
              console.error("Error attempting to autoplay:", error)
            })
          }
        })
      }
    }

    setupHls()
  }, [src, autoPlay])

  return (
    <video ref={videoRef} className={`w-full h-full ${className}`} poster={poster} controls={controls} playsInline />
  )
}

