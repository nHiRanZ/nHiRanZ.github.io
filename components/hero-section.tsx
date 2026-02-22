"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.15 175) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.72 0.15 175) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-4 font-mono text-sm tracking-widest text-primary">
            {"Hello! I'm"}
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-balance">Nimila Hiranya</span>
            <br />
            <span className="text-balance text-primary">Samarasinghe</span>
          </h1>

          <p className="mb-4 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Creative Engineer & Designer. A human.
          </p>

          <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Senior Tech Lead crafting innovative POS, Kiosk, and E-Commerce
            solutions. Passionate about payment gateway integrations, API
            architecture, and building products that make a real difference.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              More about me
              <ArrowDown size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Decorative terminal-like element */}
        <div
          className={`mt-16 hidden rounded-lg border border-border bg-card p-4 font-mono text-xs text-muted-foreground md:block transition-all duration-1000 delay-500 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-destructive/60" />
            <span className="inline-block h-3 w-3 rounded-full bg-chart-4/60" />
            <span className="inline-block h-3 w-3 rounded-full bg-primary/60" />
          </div>
          <p>
            <span className="text-primary">{"~"}</span>{" "}
            <span className="text-foreground">nimila</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-foreground">portfolio</span>{" "}
            <span className="text-primary">$</span>{" "}
            <span className="text-muted-foreground">cat intro.txt</span>
          </p>
          <p className="mt-1 text-muted-foreground">
            {'>'} 10+ years building software | Java, React Native, Spring, Android
          </p>
          <p className="text-muted-foreground">
            {'>'} Currently: Senior Tech Lead @ Applova Inc.
          </p>
          <p className="text-muted-foreground">
            {'>'} Interests: Travel Photography | 7+ countries explored
          </p>
          <p className="text-muted-foreground">
            {'>'} Open source: github.com/nHiRanZ | stackoverflow.com/users/nimila-hiranya
          </p>
          <p className="mt-1">
            <span className="text-primary">{"~"}</span>{" "}
            <span className="text-foreground">nimila</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-foreground">portfolio</span>{" "}
            <span className="text-primary">$</span>{" "}
            <span className="animate-pulse text-primary">_</span>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to about section"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  )
}
