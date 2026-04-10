"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"

interface VideoIntroProps {
  onComplete: () => void
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Ensure vendor-specific inline play attributes are set programmatically
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'true');
      video.setAttribute('x5-video-orientation', 'portrait');
    } catch {}
  }, []);

  // Auto-play the video immediately
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryAutoplay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        // If autoplay is blocked, we still allow tap-to-skip
        console.log("Autoplay prevented");
      }
    };

    // Try autoplay immediately
    tryAutoplay();

    // Fallback: if not playing after 4s (slow load or blocked), go to main
    const fallbackId = window.setTimeout(() => {
      if (!video.paused && !video.ended) return; // already playing
      onComplete();
    }, 4000);

    // Error handler transitions immediately
    const handleError = () => onComplete();
    video.addEventListener('error', handleError);

    return () => {
      window.clearTimeout(fallbackId);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black z-50 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={() => onComplete()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onComplete();
        }
      }}
    >
      {/* Click-catcher overlay to intercept all taps/clicks and skip */}
      <div
        className="absolute inset-0 z-20"
        role="button"
        aria-label="Skip intro"
        onClick={() => onComplete()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onComplete();
          }
        }}
        tabIndex={0}
        style={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)' }}
      />

      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full z-0 object-cover pointer-events-none"
        playsInline 
        muted 
        autoPlay
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        onEnded={onComplete}
        onCanPlay={() => {
          // Attempt to start if the browser queued it
          try { videoRef.current?.play(); setIsPlaying(true); } catch {}
        }}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'black',
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
      >
        <source src="/engagement-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </div>
  );
}
