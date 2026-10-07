'use client';

import { motion } from 'framer-motion';
import { Code, Layout, Server, Database, Brain, Wrench } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { staggerItemVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { SkillCategoryItem } from '@/types';

const iconMap: Record<string, typeof Code> = {
  programming: Code,
  frontend: Layout,
  backend: Server,
  database: Database,
  ai: Brain,
  tools: Wrench,
};

const categoryStyling: Record<string, { bg: string; border: string; badge: string }> = {
  programming: { bg: 'bg-[#CFDBC5]/35', border: 'hover:border-[#CFDBC5]', badge: 'sage' },
  frontend: { bg: 'bg-[#E0F7FA]/50', border: 'hover:border-[#E0F7FA]', badge: 'mint' },
  backend: { bg: 'bg-[#FFE4E1]/45', border: 'hover:border-[#FFE4E1]', badge: 'peach' },
  database: { bg: 'bg-[#CFDBC5]/35', border: 'hover:border-[#CFDBC5]', badge: 'sage' },
  ai: { bg: 'bg-[#D8BFD8]/45', border: 'hover:border-[#D8BFD8]', badge: 'lavender' },
  tools: { bg: 'bg-[#FFD1DC]/40', border: 'hover:border-[#FFD1DC]', badge: 'blush' },
};

interface SkillsProps {
  skills?: Record<string, string[]>;
  skillCategories?: SkillCategoryItem[];
}

export function Skills({ skills, skillCategories = [] }: SkillsProps) {
  return (
    <Section id="skills" size="lg" background="secondary" className="relative">
      {/* Section Header */}
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-2 mb-3 text-caption font-mono text-accent uppercase tracking-widest">
          <span>03</span>
          <span className="w-8 h-px bg-accent/40" />
          <span>Technical Competencies</span>
        </div>
        <SectionHeader
          align="left"
          title="Skills &amp; Engineering Disciplines"
          subtitle="Structured breakdown across machine learning models, modern web development, databases, and developer tools."
        />
      </ScrollReveal>

      {/* Categories Grid */}
      <ScrollReveal variant="list" threshold={0.12}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {skillCategories.map((category, index) => {
            const IconComponent = iconMap[category.key] || Code;
            const skillList = skills ? skills[category.key] || category.skills : category.skills;
            const styling = categoryStyling[category.key] || {
              bg: 'bg-accent-light',
              border: 'hover:border-border',
              badge: 'secondary',
            };

            return (
              <motion.article
                key={category.key}
                variants={staggerItemVariant}
                custom={index}
                className={cn(
                  'group relative p-7 rounded-3xl bg-background-primary/80 backdrop-blur-xs border border-border transition-all duration-300 ease-editorial hover:-translate-y-1.5 hover:shadow-card-hover flex flex-col justify-between h-full space-y-6',
                  styling.border
                )}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center text-text-primary transition-transform duration-200 group-hover:scale-105 shadow-2xs',
                        styling.bg
                      )}
                    >
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-heading-sm font-semibold text-text-primary">
                      {category.label}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge
                        key={skill}
                        variant={styling.badge as any}
                        size="sm"
                        className="hover:-translate-y-0.5 cursor-default transition-transform"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </ScrollReveal>
    </Section>
  );
}
