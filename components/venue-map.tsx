"use client"

import { useState } from "react"
import Image from "next/image"

export default function VenueMap() {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Static map image from public folder (added by you as venue-map.jpg)
  const staticMapUrl = "/venue-map.jpg"

  // Google Maps URL for Remal Hall, Ras Elbar
  const googleMapsUrl = "https://maps.app.goo.gl/j4DjWZpzwsEMhhAy7"

  const handleMapClick = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="w-full px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500" />
          
          <div className="relative w-full aspect-video min-h-[250px] rounded-2xl overflow-hidden border-2 border-accent/20 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer bg-slate-50">
            {/* Clickable static map */}
            <div 
              className="relative w-full h-full min-h-[250px]"
              onClick={handleMapClick}
              role="button"
              tabIndex={0}
              aria-label="Open Remal Hall location in Google Maps"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleMapClick()
                }
              }}
            >
              {/* Static Map Image */}
              <Image
                src={staticMapUrl}
                alt="Remal Hall Location - Click to open in Google Maps"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    <span className="font-medium">Loading venue map...</span>
                  </div>
                </div>
              )}

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-slate-200 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-3 sm:px-6">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-slate-800 text-sm sm:text-base">View on Google Maps</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>

              {/* Location Pin Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full border-2 sm:border-4 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 w-1 h-4 sm:h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Mobile Hint - Always visible on mobile */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs sm:text-sm px-3 py-2 rounded-full backdrop-blur-sm border border-white/20 transition-opacity duration-300">
                Tap to open map
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="mt-6 text-center px-4">
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-gray-800 mb-2">Remal Hall</h3>
            <p className="text-gray-700 text-base sm:text-lg mb-3">
              Beach Wedding Venue & Event Space
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ras Elbar, Egypt</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Click map for directions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}