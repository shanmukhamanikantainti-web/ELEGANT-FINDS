'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroProps {
  onComplete: () => void
}

export default function Intro({ onComplete }: IntroProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
    setHasStarted(true)
  }

  useEffect(() => {
    if (hasStarted && videoRef.current) {
      const video = videoRef.current
      
      const playVideo = async () => {
        try {
          // Wait for metadata if needed
          if (video.readyState < 1) {
            await new Promise((resolve) => {
              video.onloadedmetadata = resolve
            })
          }
          await video.play()
        } catch (error) {
          console.error("Video playback failed:", error)
        }
      }
      playVideo()
    }
  }, [hasStarted])



  const handleEnded = () => {
    setIsExiting(true)
    setTimeout(() => {
      onCompleteRef.current()
    }, 1000) // Match duration of fade out
  }

  const handleSkip = () => {
    setIsExiting(true)
    setTimeout(() => {
      onCompleteRef.current()
    }, 800)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
        >
          {!hasStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center z-10"
            >
              <h1 className="text-white font-headline text-4xl md:text-6xl mb-12 tracking-[0.2em] font-light">
                ELEGANT FINDS
              </h1>
              <button
                onClick={handleStart}
                className="group relative px-12 py-4 text-white tracking-[0.3em] text-sm overflow-hidden"
              >
                <span className="relative z-10">ENTER ATELIER</span>
                <div className="absolute inset-0 border border-white/30 group-hover:border-white transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-10"></div>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="relative w-full h-full"
            >
              <video
                ref={videoRef}
                src="/videos/intro.mp4"
                className="w-full h-full object-cover"
                onEnded={handleEnded}
                playsInline
                autoPlay
                muted={false}
                preload="auto"
              />


              
              <button
                onClick={handleSkip}
                className="absolute bottom-12 right-12 text-white/50 hover:text-white tracking-[0.2em] text-xs transition-colors duration-300 z-20 flex items-center gap-2 group"
              >
                SKIP INTRO
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </motion.div>
          )}

          {/* Decorative ambient background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
