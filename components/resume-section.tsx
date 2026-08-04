"use client"

import { Briefcase, GraduationCap, ExternalLink, FileText, Download } from "lucide-react"

const RESUME_PDF = "/Nimila_Samarasinghe_Resume.pdf"

const workExperience = [
  {
    title: "Senior Tech Lead",
    company: "Applova Inc.",
    period: "Apr 2025 - Present",
    description:
      "Leading technical strategy and engineering teams to build next-generation POS and e-commerce solutions.",
  },
  {
    title: "Tech Lead",
    company: "Applova Inc.",
    period: "Jan 2022 - Mar 2025",
    description:
      "Led end-to-end development initiatives across mobile, web, and API platforms with a focus on payment gateway integrations.",
  },
  {
    title: "Associate Tech Lead",
    company: "Applova Inc.",
    period: "Apr 2021 - Dec 2021",
    description:
      "Stepped into leadership, guiding cross-functional teams through complex technical deliveries and mentoring junior engineers.",
  },
  {
    title: "Senior Software Engineer",
    company: "Applova Inc.",
    period: "Apr 2020 - Mar 2021",
    description:
      "Architected scalable solutions for kiosk and POS platforms, driving significant performance improvements.",
  },
  {
    title: "Software Engineer",
    company: "Applova Inc.",
    period: "Jul 2017 - Apr 2020",
    description:
      "Built and maintained core product features across front-end and back-end systems.",
  },
  {
    title: "Software Engineer",
    company: "hSenid Mobile Solutions",
    period: "Jul 2017 - Mar 2019",
    description:
      "Focused on UI/UX, web, and mobile development for enterprise-grade mobile solutions.",
  },
  {
    title: "Founder & Designer",
    company: "The Logo Patrol",
    period: "2014 - Present",
    description:
      "Founded a creative startup specializing in logo design for small businesses and startups.",
  },
]

const education = [
  {
    degree: "B.Eng in Software Engineering",
    institution: "University of Westminster, London",
    subInstitution: "via Informatics Institute of Technology, Sri Lanka",
    period: "2013 - 2017",
  },
  {
    degree: "Comprehensive Master Java Developer",
    institution: "Institute of Java and Software Engineering",
    period: "2013",
  },
  {
    degree: "Graphic Designing",
    institution: "Golden Key Institute",
    period: "2010",
  },
]

export function ResumeSection() {
  return (
    <section id="resume" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16">
          <p className="mb-2 font-mono text-sm tracking-widest text-primary">
            02
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Resume
          </h2>
          <div className="mt-4 h-px w-16 bg-primary" />
        </div>

        <p className="mb-4 max-w-2xl text-muted-foreground">
          Over 10 years of experience spanning Software Engineering, UI/UX
          Design, and Graphic Design. I love wearing different hats and
          bringing ideas to life across the full stack.
        </p>

        <div className="mb-12 flex flex-wrap items-center gap-4">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FileText size={14} />
            View PDF resume
          </a>
          <a
            href={RESUME_PDF}
            download="Nimila_Samarasinghe_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download size={14} />
            Download PDF
          </a>
          <a
            href="https://linkedin.com/in/nhiranz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
          >
            View full profile on LinkedIn
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Work Experience */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <Briefcase size={20} className="text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Experience
              </h3>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-border" />

              <div className="flex flex-col gap-8">
                {workExperience.map((job, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background" />

                    <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30">
                      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-semibold text-foreground">
                          {job.title}
                        </h4>
                        <span className="font-mono text-xs text-muted-foreground">
                          {job.period}
                        </span>
                      </div>
                      <p className="mb-2 text-sm font-medium text-primary">
                        {job.company}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <GraduationCap size={20} className="text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Education
              </h3>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-border" />

              <div className="flex flex-col gap-8">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background" />

                    <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30">
                      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-semibold text-foreground">
                          {edu.degree}
                        </h4>
                        <span className="font-mono text-xs text-muted-foreground">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-sm text-primary">
                        {edu.institution}
                      </p>
                      {edu.subInstitution && (
                        <p className="text-xs text-muted-foreground">
                          {edu.subInstitution}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
