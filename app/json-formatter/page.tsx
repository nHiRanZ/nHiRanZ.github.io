import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { JsonFormatter } from '@/components/json-formatter'

export const metadata = {
  title: 'JSON Formatter',
  description: 'Format, validate, minify and explore JSON in your browser. No ads, no uploads. Fixes trailing commas, comments and single quotes, and keeps big numbers exact.',
}

export default function JsonFormatterPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              JSON Formatter
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Paste JSON to format, validate, minify or browse it as a tree. Errors point to the
              exact line and column. Comments, trailing commas, single quotes and Python dicts
              are fixed for you. Large numbers and key order stay exactly as written, and
              nothing leaves your browser.
            </p>
          </div>
          <JsonFormatter />
        </div>
      </main>
      <Footer />
    </>
  )
}
