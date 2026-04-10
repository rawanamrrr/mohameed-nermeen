"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.label}
          className="group relative"
          style={{
            animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`,
          }}
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Dreamy floating background */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 opacity-60 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-lg scale-125 opacity-40"></div>
            
            {/* Main content */}
            <div className="relative flex flex-col items-center justify-center p-4 md:p-6 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:-translate-y-2">
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 font-light tracking-tight mb-2">
                {unit.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-widest font-light">
                {unit.label}
              </div>
            </div>
            
            {/* Floating particles around each unit */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-pink-300/60 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-1 h-1 bg-orange-300/60 rounded-full animate-ping delay-1000"></div>
            <div className="absolute -bottom-2 -right-1 w-1.5 h-1.5 bg-yellow-300/60 rounded-full animate-ping delay-2000"></div>
            <div className="absolute -bottom-1 -left-3 w-1 h-1 bg-pink-300/60 rounded-full animate-ping delay-3000"></div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
