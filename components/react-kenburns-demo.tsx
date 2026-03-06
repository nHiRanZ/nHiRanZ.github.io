'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const IMAGES = [
  { src: 'https://i.ibb.co/pjVgZTnf/image1.jpg', alt: 'Landscape 1' },
  { src: 'https://i.ibb.co/39n0tghZ/image2.jpg', alt: 'Landscape 2' },
  { src: 'https://i.ibb.co/YBcr2vHf/image3.jpg', alt: 'Landscape 3' },
]

const CARD_HEIGHT = 280
const MAX_WIDTH = 800

const KenBurnsView = dynamic(
  () => import('react-kenburns-view').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-muted animate-pulse"
        style={{ width: '100%', height: CARD_HEIGHT, minHeight: CARD_HEIGHT }}
      />
    ),
  }
)

export function ReactKenBurnsDemo() {
  const [width, setWidth] = useState(MAX_WIDTH)

  useEffect(() => {
    const update = () => setWidth(Math.min(MAX_WIDTH, window.innerWidth - 32))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 max-w-[800px] mx-auto">
      {IMAGES.map((img) => (
        <div key={img.src} className="w-full rounded-xl overflow-hidden shadow-lg">
          <KenBurnsView
            width={width}
            height={CARD_HEIGHT}
            src={img.src}
            alt={img.alt}
            duration={15000}
            zoomStart={1}
            zoomEnd={1.2}
            panX={0.08}
            panY={0.08}
          />
        </div>
      ))}
    </div>
  )
}
