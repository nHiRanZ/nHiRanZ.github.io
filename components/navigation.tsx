"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, FlaskConical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { label: "Home",    href: "/", hash: "#home" },
  { label: "About",   href: "/", hash: "#about" },
  { label: "Resume",  href: "/", hash: "#resume" },
  { label: "Travel",  href: "/", hash: "#travel" },
  { label: "Contact", href: "/", hash: "#contact" },
]

const labItems = [
  { label: "React / React Native Libraries", href: "/demos" },
  { label: "Deal Scout LK",                  href: "/deal-scout-lk/" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const isLabActive = labItems.some((item) => pathname.startsWith(item.href.replace(/\/$/, "")))

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      if (pathname !== "/") return
      const sections = navLinks.map((link) => link.hash?.replace("#", "") ?? "")
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-wider text-primary transition-colors hover:text-primary/80"
        >
          NH
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const href = link.hash ? `${link.href}${link.hash}` : link.href
            const sectionId = link.hash?.replace("#", "") ?? ""
            const isActive = pathname === "/" && activeSection === sectionId
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm tracking-wide transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}

          {/* The Lab dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 text-sm tracking-wide transition-colors outline-none ${
                  isLabActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FlaskConical size={13} className="shrink-0" />
                The Lab
                <ChevronDown size={13} className="shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-52">
                {labItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={pathname.startsWith(item.href.replace(/\/$/, "")) ? "text-primary" : ""}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-lg md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => {
              const href = link.hash ? `${link.href}${link.hash}` : link.href
              const sectionId = link.hash?.replace("#", "") ?? ""
              const isActive = pathname === "/" && activeSection === sectionId
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}

            {/* The Lab section in mobile */}
            <li>
              <div className="flex items-center gap-1.5 px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                <FlaskConical size={11} />
                The Lab
              </div>
              <ul className="flex flex-col gap-1 pl-3">
                {labItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        pathname.startsWith(item.href.replace(/\/$/, ""))
                          ? "text-primary bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
