"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface BackgroundMusicProps {
  audioSrc?: string
  autoPlay?: boolean
  loop?: boolean
}

export function BackgroundMusic({ 
  audioSrc = "/audio/background-music.mp3", 
  autoPlay = false, 
  loop = true 
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [isVisible, setIsVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.loop = loop

    if (autoPlay) {
      audio.play().catch(() => {
        // Auto-play was prevented by browser
        console.log("Auto-play prevented by browser")
      })
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, loop])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        console.log("Play prevented by browser")
      })
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    setIsMuted(false)
  }

  const hideControls = () => {
    setIsVisible(false)
    // Show controls again after 3 seconds of inactivity
    setTimeout(() => setIsVisible(true), 3000)
  }

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div 
        className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={hideControls}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-2xl">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <Button
              onClick={togglePlay}
              size="sm"
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>

            {/* Volume Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                size="sm"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 