export interface NavLink {
  label: string;
  href: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ProjectResult {
  metric: string;
  label: string;
}

export interface ProjectArchitecture {
  title: string;
  description: string;
  iconName?: string | undefined;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category?: string | undefined;
  problem?: string | undefined;
  solution?: string | undefined;
  challenges?: string | string[] | undefined;
  impact?: string | undefined;
  features: string[];
  tech: string[];
  image: string;
  github: string;
  demo: string;
  caseStudy: string;
  badge?: string | undefined;
  featured: boolean;
  published: boolean;
  order: number;
  results?: ProjectResult[] | undefined;
  architecture?: ProjectArchitecture[] | undefined;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
}

export interface Achievement {
  id: string;
  label: string;
  subtext: string;
  prefix?: string | undefined;
  value?: number | undefined;
  textValue?: string | undefined;
  suffix?: string | undefined;
  decimals?: number | undefined;
  isNumeric: boolean;
  order: number;
  published: boolean;
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

export interface HeroContent {
  name: string;
  role: string;
  statusBadge: string;
  headlinePrefix: string;
  headlineEmphasis: string;
  headlineSuffix: string;
  bio: string;
  badges: string[];
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface AboutHighlight {
  title: string;
  desc: string;
  badgeVariant: string;
  bg: string;
  border: string;
}

export interface TechnicalPill {
  name: string;
  variant: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  highlights: AboutHighlight[];
  technicalPills: TechnicalPill[];
  pillars: {
    education: string;
    focusAreas: string;
    currently: string;
  };
}

export interface SkillCategoryItem {
  key: string;
  label: string;
  icon: string;
  skills: string[];
}

export interface ResumeMetadata {
  url: string;
  fileName: string;
  fileSize: number;
  updatedAt: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
}

export interface PortfolioData {
  hero: HeroContent;
  about: AboutContent;
  projects: Project[];
  skills: Record<string, string[]>;
  skillCategories: SkillCategoryItem[];
  achievements: Achievement[];
  timeline: TimelineItem[];
  socialLinks: SocialLinks;
  resume: ResumeMetadata;
  siteConfig: SiteConfig;
}

export type MessageStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  ipHash?: string | undefined;
}

export interface MessageStats {
  total: number;
  unread: number;
  thisWeek: number;
}

export interface SEOProps {
  title: string;
  description: string;
  ogImage?: string | undefined;
  ogType?: 'website' | 'article' | undefined;
  twitterCard?: 'summary' | 'summary_large_image' | undefined;
  noIndex?: boolean | undefined;
  noFollow?: boolean | undefined;
}