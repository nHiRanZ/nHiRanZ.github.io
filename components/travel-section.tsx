"use client"

import Image from "next/image"
import { MapPin, Instagram, ExternalLink } from "lucide-react"

const destinations = [
  {
    name: "Sri Lanka",
    tag: "Home",
    image: "/images/travel-sri-lanka.jpg",
    description: "Exploring every corner of my beautiful island home.",
  },
  {
    name: "Maldives",
    tag: "Paradise",
    image: "/images/travel-maldives.jpg",
    description: "Crystal clear waters and overwater serenity.",
  },
  {
    name: "Thailand",
    tag: "Culture",
    image: "/images/travel-thailand.jpg",
    description: "Golden temples and vibrant street life.",
  },
  {
    name: "Turkey",
    tag: "Adventure",
    image: "/images/travel-turkey.jpg",
    description: "Hot air balloons over ancient fairy chimneys.",
  },
  {
    name: "Vietnam",
    tag: "Nature",
    image: "/images/travel-vietnam.jpg",
    description: "Emerald waters and limestone wonders.",
  },
  {
    name: "India",
    tag: "Heritage",
    image: "/images/travel-india.jpg",
    description: "Timeless architecture and vibrant culture.",
  },
  {
    name: "United States",
    tag: "Iconic",
    image: "/images/travel-usa.jpg",
    description: "Skyscrapers, city lights, and American landmarks.",
  },
]

export function TravelSection() {
  return (
    <section id="travel" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16">
          <p className="mb-2 font-mono text-sm tracking-widest text-primary">
            03
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Travel & Photography
          </h2>
          <div className="mt-4 h-px w-16 bg-primary" />
        </div>

        <p className="mb-6 max-w-2xl text-muted-foreground">
          When I{"'"}m not writing code, I{"'"}m usually out exploring new
          places with my camera. Travel fuels my creativity, and photography
          helps me see the world through a different lens. Here are some of the
          places I{"'"}ve been lucky enough to visit.
        </p>

        <div className="mb-12 flex flex-wrap items-center gap-4">
          <a
            href="https://instagram.com/nhiranz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
          >
            <Instagram size={16} />
            Follow on Instagram
            <ExternalLink size={12} />
          </a>
          <a
            href="https://tiktok.com/@nhiranz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15z" />
            </svg>
            Follow on TikTok
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Photo Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={`Travel photography from ${dest.name}`}
                  width={600}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-5">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span className="font-mono text-xs tracking-wider text-primary">
                    {dest.tag}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {dest.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
