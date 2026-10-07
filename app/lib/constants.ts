import type { NavLink, Project, TimelineItem, Achievement, SocialLinks } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Experience', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
];

export const SKILLS = {
  programming: ['Python', 'JavaScript', 'C++'],
  frontend: ['React', 'Next.js', 'Tailwind CSS'],
  backend: ['Node.js', 'Express', 'REST APIs'],
  database: ['MongoDB', 'Supabase'],
  ai: ['Gemini API', 'Prompt Engineering', 'DistilBERT', 'Sentence Transformers'],
  tools: ['Git', 'GitHub', 'Postman', 'VS Code'],
} as const;

export const SKILL_CATEGORIES = [
  { key: 'programming', label: 'Programming', icon: 'code' },
  { key: 'frontend', label: 'Frontend', icon: 'layout' },
  { key: 'backend', label: 'Backend', icon: 'server' },
  { key: 'database', label: 'Database', icon: 'database' },
  { key: 'ai', label: 'AI & ML', icon: 'brain' },
  { key: 'tools', label: 'Tools', icon: 'wrench' },
] as const;

export const PROJECTS: Project[] = [
  {
    id: 'curanode',
    name: 'CuraNode',
    tagline: 'AI Emergency Triage & Hospital Management',
    description:
      'A comprehensive healthcare platform featuring AI-powered symptom checking, medical image analysis, real-time emergency notifications, and an intuitive hospital dashboard for resource management.',
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
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: 'reviewtrust',
    name: 'ReviewTrust AI',
    tagline: 'Fake Review Detection Platform',
    description:
      'An intelligent system that detects fake reviews using DistilBERT and Sentence Transformers, providing trust scores and detailed analytics for e-commerce platforms.',
    features: [
      'Fake Review Detection (94% Accuracy)',
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
  },
];

export const TIMELINE: TimelineItem[] = [
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
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', label: 'National Hackathon Finalist', textValue: 'Top 5', suffix: '', isNumeric: false, order: 1, published: true, subtext: 'Top 5 ranking' },
  { id: 'ach-2', label: 'AI Projects Completed', value: 2, suffix: '+', isNumeric: true, order: 2, published: true, subtext: '2+ completed projects' },
  { id: 'ach-3', label: 'Hackathons Participated', textValue: 'Multiple', suffix: '', isNumeric: false, order: 3, published: true, subtext: 'National competitions' },
  { id: 'ach-4', label: 'Academic CGPA', value: 8.0, suffix: '', decimals: 1, isNumeric: true, order: 4, published: true, subtext: 'BE in AI & ML' },
];

export const SOCIAL_LINKS: SocialLinks = {
  email: 'mailto:misbakousarmn@gmail.com',
  linkedin: 'https://linkedin.com/in/misba-kousar-mn',
  github: 'https://github.com/Misba-Kousar-MN',
  resume: '/resume.pdf',
};

export const SITE_CONFIG = {
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
} as const;