import Link from 'next/link'
import { Github } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ExpoSnackEmbed } from '@/components/expo-snack-embed'
import { ReactKenBurnsDemo } from '@/components/react-kenburns-demo'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Demos',
  description: 'Interactive demos: react-native-kenburns-view and react-kenburns-view.',
}

const DEMOS = [
  {
    id: 'react-native-kenburns-view',
    title: 'react-native-kenburns-view',
    description: 'Ken Burns effect for React Native. Try it in the Expo Snack embed below.',
    href: '#react-native-kenburns-view',
    repoUrl: 'https://github.com/nHiRanZ/react-native-kenburns-view',
  },
  {
    id: 'react-kenburns-view',
    title: 'react-kenburns-view',
    description: 'Ken Burns effect (zoom + pan) for React web. Lightweight, CSS-based.',
    href: '#react-kenburns-view',
    repoUrl: 'https://github.com/nHiRanZ/react-kenburns-view',
  },
] as const

export default function DemosPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
          <div className="mb-12">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              Demos
            </h1>
            <p className="mt-2 text-muted-foreground">
              A few things I&apos;ve built. Click a card to jump to the demo.
            </p>
          </div>

          <ul className="mb-16 grid gap-4 sm:grid-cols-2">
            {DEMOS.map((demo) => (
              <li key={demo.id}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={demo.href} className="flex-1 min-w-0">
                        <CardTitle className="font-mono text-base">
                          {demo.title}
                        </CardTitle>
                      </Link>
                      <a
                        href={demo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`${demo.title} on GitHub`}
                      >
                        <Github size={18} />
                      </a>
                    </div>
                    <Link href={demo.href} className="block">
                      <CardDescription>{demo.description}</CardDescription>
                    </Link>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>

          <section
            id="react-native-kenburns-view"
            className="scroll-mt-24 border-b border-border pb-16"
          >
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-mono text-lg font-semibold text-foreground">
                react-native-kenburns-view
              </h2>
              <a
                href="https://github.com/nHiRanZ/react-native-kenburns-view"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="react-native-kenburns-view on GitHub"
              >
                <Github size={18} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Run in the Snack below (web preview). You can open the full Snack to edit and run on device.
            </p>
            <ExpoSnackEmbed />
          </section>

          <section
            id="react-kenburns-view"
            className="scroll-mt-24 pt-16"
          >
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-mono text-lg font-semibold text-foreground">
                react-kenburns-view
              </h2>
              <a
                href="https://github.com/nHiRanZ/react-kenburns-view"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="react-kenburns-view on GitHub"
              >
                <Github size={18} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Zoom + pan effect on the web. No animation library — CSS transforms and requestAnimationFrame.
            </p>
            <ReactKenBurnsDemo />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
