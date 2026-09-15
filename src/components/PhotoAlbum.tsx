'use client'

import { useState, useCallback } from 'react'

interface PhotoAlbumProps {
  images: string[]
  labels: string[]
}

export default function PhotoAlbum({ images, labels }: PhotoAlbumProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)
  const [slideKey, setSlideKey] = useState(0)

  const prev = useCallback(() => {
    if (animating) return
    setDirection('right')
    setAnimating(true)
    setSlideKey((k) => k + 1)
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  }, [images.length, animating])

  const next = useCallback(() => {
    if (animating) return
    setDirection('left')
    setAnimating(true)
    setSlideKey((k) => k + 1)
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  }, [images.length, animating])

  const goTo = useCallback((i: number) => {
    if (animating || i === current) return
    setDirection(i > current ? 'left' : 'right')
    setAnimating(true)
    setSlideKey((k) => k + 1)
    setCurrent(i)
  }, [current, animating])

  if (images.length === 0) return null

  return (
    <div className="relative w-full max-w-[400px] sm:max-w-[580px] sm:w-[580px] flex-shrink-0">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-200">
          <img
            key={slideKey}
            src={images[current]}
            alt={labels[current] || ''}
            className={`h-full w-full object-cover ${direction === 'left' ? 'animate-slideInFromRight' : 'animate-slideInFromLeft'}`}
            onAnimationEnd={() => setAnimating(false)}
          />
        </div>

        <button
          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm transition-colors hover:bg-white"
          onClick={prev}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm transition-colors hover:bg-white"
          onClick={next}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-accent' : 'w-1.5 bg-gray-300'}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideInFromLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInFromLeft { animation: slideInFromLeft .4s cubic-bezier(0.16,1,0.3,1); }
        .animate-slideInFromRight { animation: slideInFromRight .4s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
    </div>
  )
}