import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: 'Nimila Hiranya Samarasinghe | Software Engineer & Tech Lead',
  description: 'Senior Tech Lead, Software Engineer, and Creative Designer with 10+ years of experience. Expert in POS & Kiosk Solutions, Payment Integrations, and API Development.',
  keywords: ['Software Engineer', 'Tech Lead', 'Java Developer', 'React Native', 'Payment Integrations', 'POS Solutions'],
  authors: [{ name: 'Nimila Hiranya Samarasinghe' }],
  openGraph: {
    title: 'Nimila Hiranya Samarasinghe | Software Engineer & Tech Lead',
    description: 'Senior Tech Lead with 10+ years of experience building innovative solutions.',
    type: 'website',
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
