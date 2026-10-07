import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { PortfolioData, Project, Achievement, TimelineItem, HeroContent, AboutContent, SocialLinks, ResumeMetadata, SiteConfig } from '@/types';
import { getKVStore, setKVStore } from '@/lib/db-storage';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio-content.json');

let inMemoryContent: PortfolioData | null = null;

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  hero: {
    name: 'Misba Kousar MN',
    role: 'AI & Machine Learning Engineer',
    statusBadge: 'Open to AI / SWE Opportunities',
    headlinePrefix: 'Building',
    headlineEmphasis: 'intelligent',
    headlineSuffix: 'AI systems & elegant web applications.',
    bio: 'Specializing in deep learning models, Gemini API integrations, DistilBERT NLP transformers, real-time emergency triage platforms, and scalable full-stack TypeScript engineering.',
    badges: ['Gemini API', 'DistilBERT', 'React / Next.js', 'Python', 'FastAPI', 'Socket.io', 'Supabase'],
    primaryCtaText: 'Explore Projects',
    secondaryCtaText: 'Download Resume',
  },
  about: {
    title: 'Bridging AI research with production-grade web systems.',
    subtitle: 'Passionate about designing intuitive digital products powered by modern machine learning, thoughtful user experience, and robust architecture.',
    highlights: [
      {
        title: 'AI & Machine Learning',
        desc: 'Final-year BE student in AI & ML with an 8.0 CGPA, focused on neural network architectures and low-latency inference systems.',
        badgeVariant: 'blush',
        bg: 'bg-[#FFD1DC]/35',
        border: 'hover:border-[#FFD1DC]',
      },
      {
        title: 'Prompt Engineering & LLMs',
        desc: 'Expertise in structured reasoning prompts, few-shot evaluations, and retrieval-augmented pipelines with the Gemini API.',
        badgeVariant: 'lavender',
        bg: 'bg-[#D8BFD8]/35',
        border: 'hover:border-[#D8BFD8]',
      },
      {
        title: 'Applied Transformers',
        desc: 'Hands-on experience fine-tuning DistilBERT and Sentence Transformers for high-precision text classification and semantic matching.',
        badgeVariant: 'mint',
        bg: 'bg-[#E0F7FA]/45',
        border: 'hover:border-[#E0F7FA]',
      },
      {
        title: 'Full Stack Engineering',
        desc: 'Engineering scalable web architectures with Next.js App Router, TypeScript, Tailwind CSS, and performant Node/FastAPI backends.',
        badgeVariant: 'sage',
        bg: 'bg-[#CFDBC5]/35',
        border: 'hover:border-[#CFDBC5]',
      },
      {
        title: 'Real-Time Data Streaming',
        desc: 'Implementing low-latency data feeds using Socket.io and Supabase for mission-critical triage queues and live dashboards.',
        badgeVariant: 'peach',
        bg: 'bg-[#FFE4E1]/45',
        border: 'hover:border-[#FFE4E1]',
      },
      {
        title: 'National Hackathon Finalist',
        desc: 'Secured Top 5 nationally with ReviewTrust AI, proving ability to research, prototype, and ship AI products under tight hackathon timelines.',
        badgeVariant: 'lavender',
        bg: 'bg-[#D8BFD8]/35',
        border: 'hover:border-[#D8BFD8]',
      },
    ],
    technicalPills: [
      { name: 'Python', variant: 'sage' },
      { name: 'Gemini API', variant: 'blush' },
      { name: 'DistilBERT', variant: 'lavender' },
      { name: 'Sentence Transformers', variant: 'lavender' },
      { name: 'Prompt Engineering', variant: 'blush' },
      { name: 'TypeScript', variant: 'mint' },
      { name: 'React', variant: 'mint' },
      { name: 'Next.js', variant: 'sage' },
      { name: 'Node.js', variant: 'sage' },
      { name: 'FastAPI', variant: 'peach' },
      { name: 'Socket.io', variant: 'peach' },
      { name: 'Supabase', variant: 'mint' },
      { name: 'MongoDB', variant: 'sage' },
      { name: 'PostgreSQL', variant: 'lavender' },
      { name: 'Docker', variant: 'mint' },
      { name: 'Git & GitHub', variant: 'peach' },
    ],
    pillars: {
      education: 'BE in AI & Machine Learning (2023–2027) — Final-year student maintaining an 8.0 CGPA.',
      focusAreas: 'LLMs, Prompt Engineering, RAG Systems, Transformer Tuning, Real-Time Dashboards.',
      currently: 'Seeking AI/ML and software engineering internships to apply skills in high-impact teams.',
    },
  },
  projects: [
    {
      id: 'curanode',
      name: 'CuraNode',
      tagline: 'AI Emergency Triage & Hospital Management',
      category: 'Healthcare AI & Emergency Systems',
      description:
        'A comprehensive healthcare platform featuring AI-powered symptom checking, medical image analysis, real-time emergency notifications, and an intuitive hospital dashboard for resource management.',
      problem:
        'Healthcare emergency departments face severe bottlenecking during patient triaging. Manual sort queues delay emergency care and misallocate intensive care resources during sudden surges.',
      solution:
        'Engineered an AI-driven triage manager combining the Gemini API for symptom & medical scan interpretation with real-time Socket.io rooms for instant clinician alert broadcasts.',
      challenges: [
        'Maintaining zero-latency WebSocket broadcasts across concurrent clinician sessions during sudden intake spikes.',
        'Constructing structured JSON extraction prompts for medical diagnostic scans with graceful fallbacks for ambiguous inputs.',
        'Ensuring strict data isolation between patient health records and public queue status dashboards.',
      ],
      impact:
        'Simulated 40% reduction in patient triage wait times with automated tier assignment based on emergency severity scores.',
      features: [
        'AI Symptom Checker with Gemini API',
        'Medical Image Analysis (X-ray, MRI, CT)',
        'Real-time Emergency Notifications via Socket.io',
        'Hospital Resource Dashboard',
        'Patient Triage Priority System',
        'Multi-role Authentication (Patient, Doctor, Admin)',
      ],
      tech: ['Gemini API', 'Supabase', 'React', 'Next.js', 'Node.js', 'Socket.io', 'Tailwind CSS', 'TypeScript'],
      image: '/images/projects/curanode.jpg',
      github: 'https://github.com/Misba-Kousar-MN/curanode',
      demo: 'https://curanode.vercel.app',
      caseStudy: '/case-studies/curanode',
      badge: 'Healthcare Innovation',
      featured: true,
      published: true,
      order: 1,
      results: [
        { metric: '40%', label: 'Intake Wait Time Reduction (Simulation)' },
        { metric: '98.2%', label: 'Gemini Symptom Evaluation Consistency (Synthetic)' },
        { metric: '<150ms', label: 'Real-Time Socket Event Latency (Staging)' },
        { metric: '100%', label: 'TypeScript Type-Safety across Endpoints' },
      ],
      architecture: [
        {
          title: 'Multimodal AI Triage Engine',
          description:
            'Utilizes the Gemini API to analyze patient-reported symptoms, medical histories, and uploaded diagnostic scans to assign urgent triage tiers.',
          iconName: 'Cpu',
        },
        {
          title: 'Real-Time Emergency Socket Network',
          description:
            'Bi-directional WebSocket streaming powered by Socket.io and Node.js for instant triage alerts and room assignment notifications.',
          iconName: 'Activity',
        },
        {
          title: 'Role-Based Clinical Workspace',
          description:
            'Multi-role authenticated dashboards (Patient, Clinician, Administrator) built with React, Next.js, and Supabase for granular permission control.',
          iconName: 'Layers',
        },
      ],
    },
    {
      id: 'reviewtrust',
      name: 'ReviewTrust AI',
      tagline: 'Fake Review Detection Platform',
      category: 'NLP & Deep Learning Platform',
      description:
        'An intelligent system that detects fake reviews using DistilBERT and Sentence Transformers, providing trust scores and detailed analytics for e-commerce platforms.',
      problem:
        'Modern e-commerce platforms suffer from coordinated fake review campaigns and automated spam, distorting merchant ratings and misleading consumer trust.',
      solution:
        'Built a deep learning NLP engine using fine-tuned DistilBERT classification and Sentence Transformers for semantic analysis and aspect-based sentiment auditing.',
      challenges: [
        'Optimizing deep learning NLP inference to execute with sub-second response times on standard deployment servers.',
        'Mitigating false positives on genuinely enthusiastic positive customer reviews.',
        'Designing an intuitive analytics dashboard for non-technical merchants to understand classification confidence.',
      ],
      impact:
        'Achieved 94.8% detection accuracy, earning Top 5 National Hackathon Finalist distinction among competing teams.',
      features: [
        'Fake Review Detection (94.8% Accuracy)',
        'DistilBERT Fine-tuned Classification',
        'Sentence Transformers for Semantic Analysis',
        'Trust Score Algorithm (0-100)',
        'Review Analytics Dashboard',
        'Batch Processing API',
      ],
      tech: ['DistilBERT', 'Sentence Transformers', 'Python', 'FastAPI', 'React', 'Next.js', 'PostgreSQL', 'Docker'],
      image: '/images/projects/reviewtrust.jpg',
      github: 'https://github.com/Misba-Kousar-MN/reviewtrust-ai',
      demo: 'https://reviewtrust-ai.vercel.app',
      caseStudy: '/case-studies/reviewtrust',
      badge: 'Top 5 National Hackathon Finalist',
      featured: true,
      published: true,
      order: 2,
      results: [
        { metric: '94.8%', label: 'Overall Detection Accuracy (Validation Set)' },
        { metric: 'Top 5', label: 'National Hackathon Finalist Ranking' },
        { metric: '<450ms', label: 'FastAPI Batch Inference Time (Staging)' },
        { metric: '8.0', label: 'Academic Distinction' },
      ],
      architecture: [
        {
          title: 'DistilBERT Classification Pipeline',
          description:
            'Fine-tuned transformer model trained on multi-domain e-commerce datasets to detect linguistic patterns, lexical anomalies, and deceptive writing styles.',
          iconName: 'Cpu',
        },
        {
          title: 'Semantic Embedding & Consistency Audit',
          description:
            'Employs Sentence Transformers to evaluate cross-review semantic similarity, identifying copy-paste spam rings and review clustering.',
          iconName: 'Database',
        },
        {
          title: 'Trust Score Algorithm (0–100)',
          description:
            'Weighted composite scoring integrating sentiment volatility, user account signals, and transformer model probabilities into a single trust rating.',
          iconName: 'ShieldAlert',
        },
      ],
    },
  ],
  skills: {
    programming: ['Python', 'JavaScript', 'C++'],
    frontend: ['React', 'Next.js', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'REST APIs'],
    database: ['MongoDB', 'Supabase'],
    ai: ['Gemini API', 'Prompt Engineering', 'DistilBERT', 'Sentence Transformers'],
    tools: ['Git', 'GitHub', 'Postman', 'VS Code'],
  },
  skillCategories: [
    { key: 'programming', label: 'Programming', icon: 'code', skills: ['Python', 'JavaScript', 'C++'] },
    { key: 'frontend', label: 'Frontend', icon: 'layout', skills: ['React', 'Next.js', 'Tailwind CSS'] },
    { key: 'backend', label: 'Backend', icon: 'server', skills: ['Node.js', 'Express', 'REST APIs'] },
    { key: 'database', label: 'Database', icon: 'database', skills: ['MongoDB', 'Supabase'] },
    { key: 'ai', label: 'AI & ML', icon: 'brain', skills: ['Gemini API', 'Prompt Engineering', 'DistilBERT', 'Sentence Transformers'] },
    { key: 'tools', label: 'Tools', icon: 'wrench', skills: ['Git', 'GitHub', 'Postman', 'VS Code'] },
  ],
  achievements: [
    {
      id: 'hackathon-finalist',
      label: 'National Hackathon Finalist',
      subtext: 'Secured Top 5 with ReviewTrust AI platform',
      prefix: 'Top ',
      value: 5,
      suffix: '',
      decimals: 0,
      isNumeric: true,
      order: 1,
      published: true,
    },
    {
      id: 'ai-projects-built',
      label: 'AI Systems Built',
      subtext: 'Emergency triage & NLP detection products',
      prefix: '',
      value: 2,
      suffix: '+',
      decimals: 0,
      isNumeric: true,
      order: 2,
      published: true,
    },
    {
      id: 'hackathons-participated',
      label: 'Hackathons Participated',
      subtext: 'Competing and ideating in national events',
      textValue: 'Multiple',
      isNumeric: false,
      order: 3,
      published: true,
    },
    {
      id: 'academic-cgpa',
      label: 'Academic CGPA',
      subtext: 'BE in Artificial Intelligence & Machine Learning',
      prefix: '',
      value: 8.0,
      suffix: '',
      decimals: 1,
      isNumeric: true,
      order: 4,
      published: true,
    },
  ],
  timeline: [
    {
      id: 't-1',
      year: '2023',
      title: 'Started BE AI & ML',
      description: 'Began Bachelor of Engineering in Artificial Intelligence & Machine Learning',
      order: 1,
      published: true,
    },
    {
      id: 't-2',
      year: '2023',
      title: 'Learned Web Development',
      description: 'Self-taught MERN stack development through projects and documentation',
      order: 2,
      published: true,
    },
    {
      id: 't-3',
      year: '2024',
      title: 'Built MERN Projects',
      description: 'Developed multiple full-stack applications with authentication, real-time features, and deployments',
      order: 3,
      published: true,
    },
    {
      id: 't-4',
      year: '2024',
      title: 'Hackathon Participation',
      description: 'Competed in multiple national hackathons, solving real-world problems with AI',
      order: 4,
      published: true,
    },
    {
      id: 't-5',
      year: '2024',
      title: 'ReviewTrust AI',
      description: 'Built fake review detection platform - Secured Top 5 at National Hackathon',
      order: 5,
      published: true,
    },
    {
      id: 't-6',
      year: '2025',
      title: 'CuraNode',
      description: 'Developed AI emergency triage & hospital management system with real-time capabilities',
      order: 6,
      published: true,
    },
    {
      id: 't-7',
      year: '2025',
      title: 'Seeking AI Internship',
      description: 'Actively looking for AI/ML internship opportunities to apply skills at scale',
      order: 7,
      published: true,
    },
  ],
  socialLinks: {
    email: 'mailto:misbakousarmn@gmail.com',
    linkedin: 'https://linkedin.com/in/misba-kousar-mn',
    github: 'https://github.com/Misba-Kousar-MN',
    resume: '/resume.pdf',
  },
  resume: {
    url: '/resume.pdf',
    fileName: 'Misba_Kousar_Resume.pdf',
    fileSize: 44,
    updatedAt: new Date().toISOString(),
  },
  siteConfig: {
    name: 'Misba Kousar MN',
    title: 'AI Engineer • Full Stack Developer',
    description:
      'Final-year AI & Machine Learning student passionate about AI-powered applications, prompt engineering, and scalable full-stack development.',
    url: 'https://misba-kousar.dev',
    ogImage: '/og-image.png',
    keywords: [
      'AI Engineer',
      'Full Stack Developer',
      'Machine Learning',
      'React',
      'Next.js',
      'Python',
      'Portfolio',
    ],
  },
};

function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function mergeWithDefault(parsed: Partial<PortfolioData>): PortfolioData {
  return {
    hero: { ...INITIAL_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
    about: { ...INITIAL_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
    projects: parsed.projects || INITIAL_PORTFOLIO_DATA.projects,
    skills: parsed.skills || INITIAL_PORTFOLIO_DATA.skills,
    skillCategories: parsed.skillCategories || INITIAL_PORTFOLIO_DATA.skillCategories,
    achievements: parsed.achievements || INITIAL_PORTFOLIO_DATA.achievements,
    timeline: parsed.timeline || INITIAL_PORTFOLIO_DATA.timeline,
    socialLinks: { ...INITIAL_PORTFOLIO_DATA.socialLinks, ...(parsed.socialLinks || {}) },
    resume: { ...INITIAL_PORTFOLIO_DATA.resume, ...(parsed.resume || {}) },
    siteConfig: { ...INITIAL_PORTFOLIO_DATA.siteConfig, ...(parsed.siteConfig || {}) },
  };
}

export function getPortfolioContent(): PortfolioData {
  if (inMemoryContent) {
    return inMemoryContent;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PortfolioData>;
      inMemoryContent = mergeWithDefault(parsed);
      return inMemoryContent;
    }
  } catch (error) {
    console.error('Error reading portfolio content from file, using fallback:', error);
  }

  inMemoryContent = INITIAL_PORTFOLIO_DATA;
  return inMemoryContent;
}

export async function getPortfolioContentAsync(): Promise<PortfolioData> {
  try {
    const rawKV = await getKVStore('portfolio_content');
    if (rawKV) {
      const parsed = JSON.parse(rawKV) as Partial<PortfolioData>;
      inMemoryContent = mergeWithDefault(parsed);
      return inMemoryContent;
    }
  } catch (error) {
    console.error('Error reading portfolio content from KV store:', error);
  }

  return getPortfolioContent();
}

export async function savePortfolioContent(data: PortfolioData): Promise<void> {
  inMemoryContent = data;

  try {
    ensureDataDirectory();
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (error) {
    console.warn('Local disk file write notice:', error);
  }

  try {
    await setKVStore('portfolio_content', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write portfolio content to KV store:', error);
  }

  try {
    revalidatePath('/');
    data.projects.forEach((p) => {
      revalidatePath(`/case-studies/${p.id}`);
    });
  } catch {
    // Ignore during build-time or non-request contexts
  }
}

export function getPublishedProjects(): Project[] {
  const content = getPortfolioContent();
  return content.projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);
}

export function getProjectById(id: string): Project | undefined {
  const content = getPortfolioContent();
  return content.projects.find((p) => p.id === id);
}

export function getPublishedAchievements(): Achievement[] {
  const content = getPortfolioContent();
  return content.achievements
    .filter((a) => a.published)
    .sort((a, b) => a.order - b.order);
}

export function getPublishedTimeline(): TimelineItem[] {
  const content = getPortfolioContent();
  return content.timeline
    .filter((t) => t.published)
    .sort((a, b) => a.order - b.order);
}

