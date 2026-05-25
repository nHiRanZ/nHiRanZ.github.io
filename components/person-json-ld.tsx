const SITE_URL = 'https://nimila.online'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nimila Hiranya Samarasinghe',
  jobTitle: 'Senior Technical Lead',
  worksFor: {
    '@type': 'Organization',
    name: 'Applova Inc',
  },
  url: SITE_URL,
  email: 'hello@nimila.online',
  telephone: '+94740133395',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LK',
    addressRegion: 'Sri Lanka',
  },
  sameAs: [
    'https://github.com/nHiRanZ',
    'https://stackoverflow.com/users/2182809/nimila-hiranya',
    'https://linkedin.com/in/nhiranz',
    'https://instagram.com/nhiranz',
    'https://x.com/nhiranz',
    'https://tiktok.com/@nhiranz',
    'https://fb.com/nhiranz',
  ],
  knowsAbout: [
    'Software Engineering',
    'Java',
    'Android',
    'React Native',
    'Payment Integrations',
    'POS Solutions',
    'REST APIs',
    'Spring Framework',
  ],
}

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  )
}
