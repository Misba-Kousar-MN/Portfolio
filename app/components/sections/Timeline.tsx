'use client';

import { motion } from 'framer-motion';
import { Calendar, Award, Code2, Rocket, Briefcase, GraduationCap, Laptop } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { staggerItemVariant } from '@/lib/animations';
import type { TimelineItem } from '@/types';

const iconMap: Record<string, typeof GraduationCap> = {
  'Started BE AI & ML': GraduationCap,
  'Learned Web Development': Laptop,
  'Built MERN Projects': Code2,
  'Hackathon Participation': Award,
  'ReviewTrust AI': Award,
  'CuraNode': Rocket,
  'Seeking AI Internship': Briefcase,
};

interface TimelineProps {
  timeline?: TimelineItem[];
}

export function Timeline({ timeline = [] }: TimelineProps) {
  return (
    <Section id="timeline" size="lg" background="secondary" className="relative overflow-hidden">
      {/* Section Header */}
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-2 mb-3 text-caption font-mono text-accent uppercase tracking-widest">
          <span>04</span>
          <span className="w-8 h-px bg-accent/40" />
          <span>Milestones &amp; Journey</span>
        </div>
        <SectionHeader
          align="left"
          title="Chronological Engineering Path"
          subtitle="Key milestones tracing academic focus, hackathon accomplishments, and product developments."
        />
      </ScrollReveal>

      <div className="relative mt-16 max-w-5xl mx-auto">
        {/* Central timeline line for Desktop / Left-anchored for Mobile */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFD1DC] via-[#D8BFD8] to-[#CFDBC5] -translate-x-1/2 -z-0 opacity-80" />

        <ScrollReveal variant="list" threshold={0.1}>
          <div className="space-y-10 sm:space-y-12">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = iconMap[item.title] || Calendar;

              return (
                <motion.div
                  key={item.id || index}
                  variants={staggerItemVariant}
                  custom={index}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Circle */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 rounded-2xl bg-background-primary border-2 border-[#D8BFD8] text-accent shadow-card z-10 transition-transform duration-200 hover:scale-110">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Desktop Grid Spacer */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card Content Box */}
                  <div
                    className={`w-full md:w-[calc(50%-2.5rem)] pl-14 md:pl-0 ${
                      isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                    }`}
                  >
                    <div className="p-6 sm:p-7 rounded-3xl bg-background-primary/80 backdrop-blur-xs border border-border shadow-subtle hover:border-[#D8BFD8] hover:shadow-card-hover transition-all duration-300 ease-editorial group">
                      <div className={`flex items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#D8BFD8]/35 text-[#432643] dark:text-[#E2CBE4] text-caption font-mono font-semibold border border-[#D8BFD8]/70">
                          {item.year}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl sm:text-2xl font-normal text-text-primary mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-body-sm text-text-secondary leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
