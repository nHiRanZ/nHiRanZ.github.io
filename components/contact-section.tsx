import { Mail, Phone, Linkedin, Instagram, ExternalLink, Github } from "lucide-react"

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/nHiRanZ",
    handle: "@nHiRanZ",
  },
  {
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.621 9.335 1.993-.346zm-7.586 6.665h-12.414v-2h10l-3.586-3.586 1.414-1.414 4.586 4.586v2.414zm-4.414 4h-8v-2h8v2zm11.293-14.707l-1.414 1.414-.293-.293c-1.562-1.562-4.098-1.562-5.66 0l-4.293 4.293-1.414-1.414 4.293-4.293c2.34-2.34 6.148-2.34 8.488 0l.293.293z" />
      </svg>
    ),
    label: "Stack Overflow",
    href: "https://stackoverflow.com/users/2182809/nimila-hiranya",
    handle: "nimila-hiranya",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/nhiranz",
    handle: "@nhiranz",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/nhiranz",
    handle: "@nhiranz",
  },
  {
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: "X (Twitter)",
    href: "https://x.com/nhiranz",
    handle: "@nhiranz",
  },
  {
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15z" />
      </svg>
    ),
    label: "TikTok",
    href: "https://tiktok.com/@nhiranz",
    handle: "@nhiranz",
  },
  {
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    label: "Facebook",
    href: "https://fb.com/nhiranz",
    handle: "@nhiranz",
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16">
          <p className="mb-2 font-mono text-sm tracking-widest text-primary">
            04
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Get in Touch
          </h2>
          <div className="mt-4 h-px w-16 bg-primary" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left side - Message */}
          <div>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Whether you{"'"}re looking to collaborate on an exciting project,
              need help with payment integrations, or just want to say hello
              — I{"'"}d love to hear from you. Let{"'"}s build something
              great together.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:nimilahiran@gmail.com"
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    nimilahiran@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/94740133395"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Phone / WhatsApp
                  </p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    +94 74 013 3395
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Right side - Social links */}
          <div>
            <h3 className="mb-6 font-mono text-sm font-semibold tracking-wider text-primary">
              Find me on
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="text-muted-foreground transition-colors group-hover:text-primary">
                      <Icon />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {social.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {social.handle}
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground/50 transition-colors group-hover:text-primary"
                    />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
