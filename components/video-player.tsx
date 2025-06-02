"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  autoPlay?: boolean
}

export function VideoPlayer({ src, poster, title, className, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    if (autoPlay) {
      video.play().catch((error) => {
        console.error("Autoplay was prevented:", error)
      })
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [autoPlay, src])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-hide controls
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false)
      }
    }

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
    setShowControls(true)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted
      videoRef.current.muted = newMuteState
      setIsMuted(newMuteState)
      if (newMuteState) {
        // Store current volume before muting
        setVolume(videoRef.current.volume)
        videoRef.current.volume = 0
      } else {
        // Restore volume when unmuting
        videoRef.current.volume = volume > 0 ? volume : 0.5
      }
    }
  }

  const handleSeek = (value: number[]) => {
    const seekTime = value[0]
    setCurrentTime(seekTime)
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration))
      videoRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative group rounded-lg overflow-hidden bg-black", className)}
      onMouseMove={() => {
        setShowControls(true)
      }}
    >
      <video ref={videoRef} src={src} poster={poster} className="w-full h-full" onClick={togglePlay} playsInline />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
            <Play className="h-12 w-12 text-white" fill="white" />
          </div>
        </div>
      )}

      {/* Video title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white font-medium">
          {title}
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={togglePlay} className="text-white hover:text-primary">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <button onClick={() => skip(-10)} className="text-white hover:text-primary">
              <SkipBack className="h-5 w-5" />
            </button>

            <button onClick={() => skip(10)} className="text-white hover:text-primary">
              <SkipForward className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 ml-2">
              <button onClick={toggleMute} className="text-white hover:text-primary">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div className="w-20">
                <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} />
              </div>
            </div>

            <span className="text-white text-xs ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button onClick={toggleFullscreen} className="text-white hover:text-primary">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
