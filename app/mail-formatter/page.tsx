import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { MailFormatter } from '@/components/mail-formatter'

export const metadata = {
  title: 'Mail Formatter',
  description: 'Paste AI chat output and get clean, email-ready formatting: no dark backgrounds or theme colors, structure intact.',
}

export default function MailFormatterPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              Mail Formatter
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Copying a reply from a dark-themed chat into an email brings the black
              background and white text with it. Paste it here instead: headings, bold,
              lists, links, code and tables are kept, and the theme colors are replaced with
              light styles that work in email.
            </p>
          </div>
          <MailFormatter />
        </div>
      </main>
      <Footer />
    </>
  )
}
