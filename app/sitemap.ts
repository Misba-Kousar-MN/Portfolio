import { MetadataRoute } from 'next';
import { getPortfolioContent, getPublishedProjects } from '@/lib/content-service';

export default function sitemap(): MetadataRoute.Sitemap {
  const content = getPortfolioContent();
  const baseUrl = content.siteConfig.url;
  const publishedProjects = getPublishedProjects();

  const projectUrls = publishedProjects.map((p) => ({
    url: `${baseUrl}/case-studies/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
