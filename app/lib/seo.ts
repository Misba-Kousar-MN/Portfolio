import type { Metadata } from 'next';
import type { SEOProps } from '@/types';
import { SITE_CONFIG } from '@/lib/constants';

export function generateMetadata(props: Partial<SEOProps> = {}): Metadata {
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    ogImage = SITE_CONFIG.ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false,
    noFollow = false,
  } = props;

  const fullTitle = title === SITE_CONFIG.name ? SITE_CONFIG.name : `${title} | ${SITE_CONFIG.name}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: fullTitle,
    description,
    keywords: SITE_CONFIG.keywords.join(', '),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@misba_kousar',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export function generateJsonLd(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

export const personSchema = generateJsonLd({
  '@type': 'Person',
  name: SITE_CONFIG.name,
  jobTitle: 'AI Engineer • Full Stack Developer',
  description: SITE_CONFIG.description,
  url: SITE_CONFIG.url,
  sameAs: [
    SITE_CONFIG.url,
    'https://linkedin.com/in/misba-kousar-mn',
    'https://github.com/Misba-Kousar-MN',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Full Stack Development',
    'React',
    'Next.js',
    'Python',
    'Node.js',
    'Prompt Engineering',
    'Generative AI',
  ],
});

export const websiteSchema = generateJsonLd({
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) =>
  generateJsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });