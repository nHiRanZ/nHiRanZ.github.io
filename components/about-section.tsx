"use client"

import { Code, Smartphone, CreditCard, Globe, GraduationCap, Award } from "lucide-react"

const skills = [
  { icon: Code, label: "Java & Spring Framework" },
  { icon: Smartphone, label: "Android & React Native" },
  { icon: CreditCard, label: "Payment Integrations" },
  { icon: Globe, label: "REST APIs & Web Solutions" },
]

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16">
          <p className="mb-2 font-mono text-sm tracking-widest text-primary">
            01
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            About Me
          </h2>
          <div className="mt-4 h-px w-16 bg-primary" />
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Main content - takes 3 columns */}
          <div className="lg:col-span-3">
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Hey there! I{"'"}m{" "}
              <span className="font-semibold text-foreground">
                Nimila Hiranya Samarasinghe
              </span>
              , a Software Engineer currently working as a Senior Technical Lead.
              With over 9 years of hands-on experience in Java development,
              Android, REST APIs, and Payment Integrations, I love building
              solutions that genuinely make a difference.
            </p>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              My toolkit spans POS and Kiosk Solutions, Web platforms, React
              Native, Spring Framework, PostgreSQL, and MongoDB. I thrive at the
              intersection of innovation and execution, turning complex
              challenges into scalable, user-friendly products.
            </p>

            <p className="mb-8 leading-relaxed text-muted-foreground">
              At{" "}
              <span className="font-medium text-foreground">Applova Inc.</span>,
              I lead end-to-end development across mobile, web, and API
              platforms, with a focus on seamless payment gateway integrations.
              Outside of code, you{"'"}ll likely find me exploring new countries
              with a camera in hand.
            </p>

            {/* Highlights */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary">
                Highlights
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Proven track record of exceeding client expectations and
                  delivering measurable results.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Proficient in modern tech stacks like Java, React Native, and
                  Android development.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Expertise in architecting scalable solutions tailored to
                  business needs.
                </li>
              </ul>
            </div>
          </div>

          {/* Side panel - takes 2 columns */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Skills */}
            <div>
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary">
                Core Skills
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.label}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40"
                  >
                    <skill.icon size={20} className="text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {skill.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary">
                Education
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <GraduationCap
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      B.Eng in Software Engineering
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Informatics Institute of Technology, Sri Lanka
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (University of Westminster, UK)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      CIMA Certificate
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Certificate in Business Accounting
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Tags */}
            <div>
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Java",
                  "Android",
                  "React Native",
                  "Spring",
                  "PostgreSQL",
                  "MongoDB",
                  "REST APIs",
                  "Node.js",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
