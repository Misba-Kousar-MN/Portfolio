'use client';

import { motion } from 'framer-motion';
import { Award, Code, CheckCircle, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Counter } from '@/components/animations/Counter';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { staggerItemVariant } from '@/lib/animations';
import type { Achievement } from '@/types';

interface AchievementsProps {
  achievements?: Achievement[];
}

const defaultIconStyle = { icon: Award, pastelBg: 'bg-[#FFD1DC]/35', border: 'hover:border-[#FFD1DC]' };

const iconStyles = [
  { icon: Award, pastelBg: 'bg-[#FFD1DC]/35', border: 'hover:border-[#FFD1DC]' },
  { icon: Code, pastelBg: 'bg-[#CFDBC5]/35', border: 'hover:border-[#CFDBC5]' },
  { icon: CheckCircle, pastelBg: 'bg-[#E0F7FA]/45', border: 'hover:border-[#E0F7FA]' },
  { icon: Sparkles, pastelBg: 'bg-[#D8BFD8]/40', border: 'hover:border-[#D8BFD8]' },
];

export function Achievements({ achievements = [] }: AchievementsProps) {
  return (
    <Section id="achievements" size="sm" background="default" className="relative border-y border-border">
      <div className="container">
        <ScrollReveal variant="list" threshold={0.15}>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item, index) => {
              const style = iconStyles[index % iconStyles.length] ?? defaultIconStyle;
              const IconComponent = style.icon;

              return (
                <motion.div
                  key={item.id || index}
                  variants={staggerItemVariant}
                  custom={index}
                  className="h-full"
                >
                  <div
                    className={`h-full p-7 rounded-3xl bg-background-secondary/85 backdrop-blur-xs border border-border flex flex-col justify-between items-start text-left group transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-card-hover ${style.border}`}
                  >
                    <div className="w-full flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl ${style.pastelBg} flex items-center justify-center text-text-primary transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                        <IconComponent className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-caption font-mono text-text-tertiary uppercase">0{index + 1}</span>
                    </div>

                    <div className="my-2">
                      {item.isNumeric && item.value !== undefined ? (
                        <Counter
                          start={0}
                          end={item.value}
                          decimals={item.decimals ?? 0}
                          prefix={item.prefix || ''}
                          suffix={item.suffix || ''}
                          className="font-serif text-4xl sm:text-5xl font-normal text-text-primary tracking-tight"
                        />
                      ) : (
                        <span className="font-serif text-4xl sm:text-5xl font-normal text-text-primary tracking-tight">
                          {item.textValue || 'Top'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-2">
                      <h3 className="text-body-sm font-semibold text-text-primary">
                        {item.label}
                      </h3>
                      <p className="text-caption text-text-secondary leading-snug">
                        {item.subtext}
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
