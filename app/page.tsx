'use client'

import { useState, useEffect } from 'react'
import Hero from '@/app/components/hero/Hero'
import FeaturedProducts from '@/app/components/product/FeaturedProducts'
import Intro from '@/app/components/common/Intro'

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if intro has been played in this session
    const introPlayed = sessionStorage.getItem('introPlayed')
    if (!introPlayed) {
      setShowIntro(true)
    }
    setIsLoaded(true)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    sessionStorage.setItem('introPlayed', 'true')
  }

  if (!isLoaded) return null

  return (
    <main className="overflow-hidden">
      {showIntro && <Intro onComplete={handleIntroComplete} />}
      <div className={showIntro ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Hero />
        <FeaturedProducts />
      </div>
    </main>
  )
}

