"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"


// Dynamically import the VideoIntro component with no SSR to prevent hydration issues
const VideoIntro = dynamic(() => import("@/components/video-intro"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>,
})

// Dynamically import the main content to ensure it's loaded only when needed
const ProAnimatedEngagementPage = dynamic(
  () => import("@/components/pro-animated-engagement-page"),
  { 
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
  }
)

export default function Home() {
  const [showMain, setShowMain] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      // Cleanup function to handle component unmount
      setShowMain(false)
      setIsImageLoaded(false)
    }
  }, [])

  // Allow bypassing the intro during local dev: http://localhost:3001/?skipIntro=1
  useEffect(() => {
    if (!mounted) return
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('skipIntro') === '1') {
        setShowMain(true)
      }
    } catch {}
  }, [mounted])

  const handleVideoComplete = useCallback(() => {
    setShowMain(true)
  }, [])

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true)
  }, [])


  // Preload the main image
  useEffect(() => {
    if (mounted && !isImageLoaded) {
      const img = new Image()
      img.src = "/invitation-design.png"
      img.onload = () => handleImageLoad()
      return () => {
        img.onload = null
      }
    }
  }, [mounted, isImageLoaded, handleImageLoad])

  if (!mounted) {
    return <main className="min-h-screen bg-black" />
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Your Beach Sunset Background Picture */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/beach-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
            imageRendering: 'auto'
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Floating elements for beach atmosphere */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/3 w-3 h-3 bg-white/40 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-white/35 rounded-full animate-pulse delay-1500"></div>
      </div>
      
            {/* Video Intro */}
            {!showMain && (
              <div className="fixed inset-0 z-50">
                <VideoIntro 
                  onComplete={handleVideoComplete} 
                />
              </div>
            )}
            
            
      
      {/* Main Content */}
      <div 
        className={`w-full transition-opacity duration-1000 ease-out relative z-10 ${
          showMain ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ProAnimatedEngagementPage onImageLoad={handleImageLoad} />
        
        {/* Scroll down indicator - only show after video ends */}
        {showMain && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
            <div className="flex flex-col items-center text-white drop-shadow-lg">
              <p className="text-sm font-medium mb-2">Scroll down</p>
              <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}