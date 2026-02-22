import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ResumeSection } from "@/components/resume-section"
import { TravelSection } from "@/components/travel-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ResumeSection />
        <TravelSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
