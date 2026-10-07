'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingGradient } from '@/components/animations/FloatingGradient';
import { Mascot } from '@/components/layout/Mascot';
import { useScroll } from '@/hooks/useScroll';
import type { HeroContent } from '@/types';
import {
  heroSequenceContainer,
  heroEyebrowVariant,
  heroHeadlineVariant,
  heroSupportingVariant,
  heroBadgesVariant,
  heroCtasVariant,
  heroVisualVariant,
} from '@/lib/animations';

interface HeroProps {
  content?: HeroContent;
  resumeUrl?: string;
}

const DEFAULT_HERO: HeroContent = {
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
};

export function Hero({ content = DEFAULT_HERO, resumeUrl = '/resume.pdf' }: HeroProps) {
  const { scrollTo } = useScroll();

  const handleExploreProjects = () => {
    scrollTo('#projects', { offset: -84 });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] lg:min-h-[90vh] flex items-center overflow-hidden scroll-mt-24 pt-20 pb-14 lg:pt-24 lg:pb-20"
      aria-labelledby="hero-title"
    >
      {/* Background ambient pastel aura */}
      <FloatingGradient
        className="opacity-35 pointer-events-none"
        colors={['#FFD1DC', '#B8DFF0', '#D8BFD8', '#CFDBC5']}
        speed={3.5}
        intensity={0.14}
      />

      {/* Gentle bottom-fade vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background-primary/20 via-transparent to-background-primary/90 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      <div className="container relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={heroSequenceContainer}
        >
          {/* LEFT COLUMN: Editorial Typography & CTAs */}
          <div className="flex flex-col text-left">
            {/* 1. Eyebrow badge */}
            <motion.div variants={heroEyebrowVariant} className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFD1DC]/40 text-[#452D34] dark:text-[#FFD1DC] text-caption font-medium border border-[#FFD1DC]/80 dark:border-[#FFD1DC]/40 backdrop-blur-md shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {content.role}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B8DFF0]/50 text-[#143B41] dark:text-[#B2EBF2] text-caption font-medium border border-[#B8DFF0]/80 dark:border-[#B8DFF0]/40 backdrop-blur-md shadow-2xs">
                {content.statusBadge}
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.div variants={heroHeadlineVariant} className="space-y-2">
              <p className="text-body-sm font-medium tracking-wide text-text-secondary">
                Hello, I am <span className="text-text-primary font-semibold">{content.name}</span>
              </p>

              <h1
                id="hero-title"
                className="font-serif text-display-xl text-text-primary font-normal tracking-tight leading-[1.1] text-balance"
              >
                {content.headlinePrefix}{' '}
                <span className="italic font-normal text-accent underline decoration-[#D8BFD8] decoration-wavy decoration-1 underline-offset-6">
                  {content.headlineEmphasis}
                </span>{' '}
                {content.headlineSuffix}
              </h1>
            </motion.div>

            {/* 3. Supporting Bio Copy */}
            <motion.p
              variants={heroSupportingVariant}
              className="mt-5 text-body text-text-secondary max-w-xl text-pretty leading-relaxed font-sans"
            >
              {content.bio}
            </motion.p>

            {/* 4. Skill Tags & Role Badges */}
            <motion.div variants={heroBadgesVariant} className="mt-6 flex flex-wrap gap-2">
              {content.badges.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-background-secondary/80 border border-border text-text-secondary text-caption font-mono"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* 5. Primary & Secondary CTA Buttons */}
            <motion.div
              variants={heroCtasVariant}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                className="rounded-xl px-7"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                onClick={handleExploreProjects}
              >
                {content.primaryCtaText || 'Explore Projects'}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl px-5"
                icon={<ExternalLink className="h-4 w-4" />}
                iconPosition="right"
                asChild
              >
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-xl px-7"
                icon={<Download className="h-4 w-4" />}
                iconPosition="right"
                asChild
              >
                <a href={resumeUrl} download="Misba_Kousar_Resume.pdf">
                  {content.secondaryCtaText || 'Download Resume'}
                </a>
              </Button>
            </motion.div>

            {/* Mobile Mascot */}
            <motion.div
              variants={heroSupportingVariant}
              className="mt-8 flex lg:hidden items-center gap-4 p-3 rounded-2xl bg-background-secondary/70 border border-border/80 w-fit"
            >
              <Mascot state="hero" className="w-16 h-20" />
              <div className="text-left">
                <span className="block text-body-xs font-semibold text-text-primary">Interactive Assistant</span>
                <span className="block text-caption text-text-tertiary">Exploring projects &amp; architecture</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Robot Mascot (desktop only) */}
          <motion.div
            variants={heroVisualVariant}
            className="hidden lg:flex relative items-center justify-center w-full"
          >
            {/* Soft ambient glow behind mascot */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(216,191,216,0.28) 0%, rgba(184,223,240,0.18) 55%, transparent 80%)',
              }}
            />

            {/* Mascot card */}
            <div className="relative z-10 p-6 rounded-3xl bg-background-secondary/60 dark:bg-background-secondary/30 backdrop-blur-md border border-[#D8BFD8]/50 shadow-card-hover transition-transform hover:scale-[1.03] duration-300 cursor-default">
              <Mascot state="hero" className="w-36 h-44 xl:w-44 xl:h-52" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}