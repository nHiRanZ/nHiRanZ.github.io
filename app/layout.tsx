import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PersonJsonLd } from '@/components/person-json-ld'
import './globals.css'

const SITE_URL = 'https://nimila.online'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const siteTitle = 'Nimila Hiranya Samarasinghe | Software Engineer & Senior Technical Lead'
const siteDescription = 'Nimila Hiranya Samarasinghe — Senior Technical Lead at Applova Inc. Software Engineer in Sri Lanka. 10+ years in Java, Android, React Native, Payment Integrations, POS & Kiosk Solutions, and REST APIs.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: '%s | Nimila Hiranya Samarasinghe',
  },
  description: siteDescription,
  keywords: [
    'Nimila Hiranya Samarasinghe',
    'Software Engineer',
    'Senior Technical Lead',
    'Tech Lead',
    'Applova',
    'Java Developer',
    'Android',
    'React Native',
    'Payment Integrations',
    'POS Solutions',
    'Kiosk Solutions',
    'REST APIs',
    'Sri Lanka',
  ],
  authors: [{ name: 'Nimila Hiranya Samarasinghe', url: SITE_URL }],
  creator: 'Nimila Hiranya Samarasinghe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Nimila Hiranya Samarasinghe',
    title: siteTitle,
    description: siteDescription,
    // Add an image when you have one: place og-image in app/ or public/ (e.g. public/og.jpg)
    // images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Nimila Hiranya Samarasinghe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    // Add when you have a dedicated Twitter image: images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: 'technology',
  other: {
    'contact': 'nimilahiran@gmail.com',
    'geo.region': 'LK',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <PersonJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
