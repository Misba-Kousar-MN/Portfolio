'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, Server, Database, CheckCircle, GraduationCap, Target, Briefcase } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { staggerItemVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { AboutContent } from '@/types';

interface AboutProps {
  content?: AboutContent;
}

const highlightIcons = [Sparkles, Brain, Zap, Server, Database, CheckCircle];

export function About({ content }: AboutProps) {
  const highlights = content?.highlights || [];
  const technicalPills = content?.technicalPills || [];
  const pillars = content?.pillars || {
    education: 'BE in AI & Machine Learning (2023–2027) — Final-year student maintaining an 8.0 CGPA.',
    focusAreas: 'LLMs, Prompt Engineering, RAG Systems, Transformer Tuning, Real-Time Dashboards.',
    currently: 'Seeking AI/ML and software engineering internships to apply skills in high-impact teams.',
  };

  return (
    <Section id="about" size="lg" background="secondary">
      {/* Section Header with Section Number */}
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-2 mb-3 text-caption font-mono text-accent uppercase tracking-widest">
          <span>01</span>
          <span className="w-8 h-px bg-accent/40" />
          <span>Biography &amp; Engineering Focus</span>
        </div>
        <SectionHeader
          align="left"
          title={content?.title || 'Bridging AI research with production-grade web systems.'}
          subtitle={
            content?.subtitle ||
            'Passionate about designing intuitive digital products powered by modern machine learning, thoughtful user experience, and robust architecture.'
          }
        />
      </ScrollReveal>

      {/* 6 Engineering Focus Cards */}
      <ScrollReveal variant="list" threshold={0.12}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {highlights.map((item, index) => {
            const Icon = highlightIcons[index % highlightIcons.length] || Sparkles;

            return (
              <motion.article
                key={item.title}
                variants={staggerItemVariant}
                custom={index}
                className={cn(
                  'group relative p-7 rounded-3xl bg-background-primary/80 backdrop-blur-xs border border-border transition-all duration-300 ease-editorial hover:-translate-y-1.5 hover:shadow-card-hover',
                  item.border || 'hover:border-[#D8BFD8]'
                )}
              >
                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-text-primary transition-transform duration-200 group-hover:scale-105 shadow-2xs',
                      item.bg || 'bg-[#D8BFD8]/35'
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Curated Technical Capabilities Cloud */}
      <ScrollReveal variant="fadeUp" threshold={0.15}>
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-background-primary/60 border border-border shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-2xl font-normal text-text-primary">Core Technical Arsenal</h3>
              <p className="text-body-sm text-text-secondary mt-1">Tools and frameworks leveraged across production builds</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {technicalPills.map((skill) => (
              <Badge key={skill.name} variant={skill.variant as any} size="md" className="hover:-translate-y-0.5 cursor-default">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 3 Pillars Summary: Education, Focus Areas, Next Step */}
      <ScrollReveal variant="fadeUp" threshold={0.15}>
        <div className="mt-14 pt-10 border-t border-border/70">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-background-primary/40 border border-border/60">
              <div className="flex items-center gap-2.5 mb-2 text-text-primary">
                <GraduationCap className="h-5 w-5 text-accent" />
                <h4 className="text-heading-sm font-semibold">Education</h4>
              </div>
              <p className="text-body-sm text-text-secondary leading-relaxed">
                {pillars.education}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background-primary/40 border border-border/60">
              <div className="flex items-center gap-2.5 mb-2 text-text-primary">
                <Target className="h-5 w-5 text-accent" />
                <h4 className="text-heading-sm font-semibold">Focus Areas</h4>
              </div>
              <p className="text-body-sm text-text-secondary leading-relaxed">
                {pillars.focusAreas}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background-primary/40 border border-border/60">
              <div className="flex items-center gap-2.5 mb-2 text-text-primary">
                <Briefcase className="h-5 w-5 text-accent" />
                <h4 className="text-heading-sm font-semibold">Currently</h4>
              </div>
              <p className="text-body-sm text-text-secondary leading-relaxed">
                {pillars.currently}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}