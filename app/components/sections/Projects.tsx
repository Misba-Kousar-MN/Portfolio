'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Github, ExternalLink, ArrowRight, Activity, ShieldAlert, Sparkles, Cpu, Layers } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Project } from '@/types';

interface ProjectsProps {
  projects?: Project[];
}

export function Projects({ projects = [] }: ProjectsProps) {
  const [observeRef, isIntersecting] = useIntersectionObserver({ threshold: 0.12, triggerOnce: true });

  // Notify mascot to celebrate when projects are inspected
  useEffect(() => {
    if (isIntersecting) {
      window.dispatchEvent(new Event('mascot-celebrate'));
    }
  }, [isIntersecting]);

  return (
    <Section id="projects" size="lg" background="default" className="relative">
      <div ref={observeRef as any} className="absolute top-0 left-0 w-full h-10 pointer-events-none" />

      {/* Section Header */}
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-2 mb-3 text-caption font-mono text-accent uppercase tracking-widest">
          <span>02</span>
          <span className="w-8 h-px bg-accent/40" />
          <span>Engineering Case Studies</span>
        </div>
        <SectionHeader
          align="left"
          title="Featured Projects &amp; Architectures"
          subtitle="Production architectures, deep learning research, and end-to-end full-stack applications built with modern tools."
        />
      </ScrollReveal>

      {/* Projects List */}
      <div className="mt-16 space-y-28 sm:space-y-36">
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={project.id} className="relative">
              <ScrollReveal variant="fadeUp" threshold={0.1}>
                <div className="grid gap-10 lg:gap-14 lg:grid-cols-12 items-center">
                  {/* Content Column */}
                  <div
                    className={`space-y-6 lg:col-span-6 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    {/* Number + Category Eyebrow */}
                    <div className="flex items-center gap-3">
                      <span className="text-caption font-mono font-bold text-accent px-2.5 py-1 rounded-md bg-accent-light border border-accent/20">
                        PROJECT 0{index + 1}
                      </span>
                      <span className="text-caption font-mono text-text-tertiary uppercase tracking-wider">
                        {project.category || 'Engineering Systems'}
                      </span>
                    </div>

                    {/* Title + Tagline */}
                    <div className="space-y-2">
                      {project.badge && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8BFD8]/40 text-[#432643] dark:text-[#E2CBE4] text-caption font-semibold border border-[#D8BFD8]/80 dark:border-[#D8BFD8]/40">
                          <Sparkles className="h-3.5 w-3.5" />
                          {project.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-3xl sm:text-4xl text-text-primary font-normal tracking-tight">
                        {project.name}
                      </h3>
                      <p className="text-body-sm font-semibold uppercase tracking-wider text-accent font-mono">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Case Study Details Table/Block */}
                    <div className="space-y-3.5 pt-2 border-t border-border/80 text-body-sm">
                      {project.problem && (
                        <div className="space-y-1">
                          <span className="font-semibold text-text-primary block text-body-xs uppercase font-mono tracking-wider">
                            The Problem
                          </span>
                          <p className="text-text-secondary leading-relaxed font-sans">{project.problem}</p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="space-y-1">
                          <span className="font-semibold text-text-primary block text-body-xs uppercase font-mono tracking-wider">
                            The Solution
                          </span>
                          <p className="text-text-secondary leading-relaxed font-sans">{project.solution}</p>
                        </div>
                      )}
                      {project.impact && (
                        <div className="space-y-1">
                          <span className="font-semibold text-text-primary block text-body-xs uppercase font-mono tracking-wider">
                            Impact &amp; Metric
                          </span>
                          <p className="text-text-secondary leading-relaxed font-sans">{project.impact}</p>
                        </div>
                      )}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-background-secondary border border-border text-text-secondary text-caption font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-4 pt-3">
                      {project.demo && (
                        <Button variant="primary" icon={<ExternalLink className="h-4 w-4" />} iconPosition="right" asChild>
                          <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button variant="secondary" icon={<Github className="h-4 w-4" />} iconPosition="left" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            Source Code
                          </a>
                        </Button>
                      )}
                      <Link
                        href={`/case-studies/${project.id}`}
                        className="group inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent hover:text-accent-hover transition-colors ml-2 py-2"
                      >
                        Read Full Case Study
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Interface Mockup Column */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="relative rounded-3xl bg-background-secondary/90 p-4 sm:p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group">
                      {/* Simulated Product Window Frame */}
                      <div className="rounded-2xl bg-background-primary border border-border/80 shadow-subtle overflow-hidden flex flex-col aspect-[16/11] select-none transition-transform duration-300 group-hover:scale-[1.01]">
                        {/* Browser Header Bar */}
                        <div className="h-10 bg-background-tertiary/80 border-b border-border px-4 flex items-center justify-between">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD1DC] border border-[#FFD1DC]/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE4E1] border border-[#FFE4E1]/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#CFDBC5] border border-[#CFDBC5]/80" />
                          </div>
                          <span className="text-[11px] font-mono text-text-tertiary">
                            {`https://${project.id}.app/system`}
                          </span>
                          <div className="w-6 h-1.5 rounded-full bg-border" />
                        </div>

                        {/* Interactive UI Mockup Body */}
                        <div className="flex-grow p-5 sm:p-6 flex flex-col justify-between">
                          {project.id === 'curanode' ? (
                            // CuraNode Mockup
                            <div className="space-y-4 h-full flex flex-col justify-between">
                              <div className="flex justify-between items-center gap-3">
                                <div>
                                  <div className="text-body-sm font-semibold text-text-primary">Clinical Intake Triage</div>
                                  <div className="text-caption text-text-tertiary">Live Emergency Room Prioritization Queue</div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CFDBC5]/40 text-[#253521] dark:text-[#CFDBC5] text-caption font-medium border border-[#CFDBC5]">
                                  <Activity className="h-3 w-3 text-emerald-600 animate-pulse" />
                                  Live Socket Feed
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2.5">
                                <div className="p-3 bg-background-secondary rounded-xl border border-border">
                                  <div className="text-[10px] uppercase font-mono text-text-tertiary">Queue Count</div>
                                  <div className="text-body font-bold text-text-primary mt-0.5">14 Patients</div>
                                </div>
                                <div className="p-3 bg-background-secondary rounded-xl border border-border">
                                  <div className="text-[10px] uppercase font-mono text-text-tertiary">Avg Intake</div>
                                  <div className="text-body font-bold text-text-primary mt-0.5">4.2 min</div>
                                </div>
                                <div className="p-3 bg-background-secondary rounded-xl border border-[#CFDBC5]">
                                  <div className="text-[10px] uppercase font-mono text-text-tertiary">Gemini Match</div>
                                  <div className="text-body font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">98.2%</div>
                                </div>
                              </div>

                              <div className="p-3.5 rounded-xl bg-[#CFDBC5]/25 border border-[#CFDBC5]/60 space-y-2">
                                <div className="flex justify-between text-caption font-medium text-text-secondary">
                                  <span>Emergency Resource Capacity</span>
                                  <span className="font-bold text-text-primary">82% Operational</span>
                                </div>
                                <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#7C9872] rounded-full transition-all duration-500" style={{ width: '82%' }} />
                                </div>
                              </div>
                            </div>
                          ) : project.id === 'reviewtrust' ? (
                            // ReviewTrust AI Mockup
                            <div className="space-y-4 h-full flex flex-col justify-between">
                              <div className="flex justify-between items-center gap-3">
                                <div>
                                  <div className="text-body-sm font-semibold text-text-primary">DistilBERT Audit Pipeline</div>
                                  <div className="text-caption text-text-tertiary">Semantic Review Classifier &amp; Anomaly Detection</div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D8BFD8]/45 text-[#3F263F] dark:text-[#E2CBE4] text-caption font-medium border border-[#D8BFD8]">
                                  <ShieldAlert className="h-3 w-3 text-accent" />
                                  Verified Model
                                </span>
                              </div>

                              <div className="flex-grow flex flex-col justify-center items-center gap-1 my-1">
                                <div className="font-serif text-5xl font-normal text-text-primary tracking-tight">94.8%</div>
                                <div className="text-caption font-mono font-medium tracking-wider text-accent uppercase">
                                  Authenticity Trust Score
                                </div>
                              </div>

                              <div className="space-y-2 p-3 bg-background-secondary rounded-xl border border-border">
                                <div className="flex justify-between text-caption font-medium text-text-tertiary">
                                  <span>DistilBERT Transformer Confidence</span>
                                  <span className="font-bold text-text-primary font-mono">94.8%</span>
                                </div>
                                <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#9B7D9B] rounded-full transition-all duration-500" style={{ width: '94.8%' }} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Dynamic Generic Project Mockup
                            <div className="space-y-4 h-full flex flex-col justify-between">
                              <div className="flex justify-between items-center gap-3">
                                <div>
                                  <div className="text-body-sm font-semibold text-text-primary">{project.name} Architecture</div>
                                  <div className="text-caption text-text-tertiary">{project.tagline}</div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F7FA]/50 text-[#143B41] dark:text-[#B2EBF2] text-caption font-medium border border-[#E0F7FA]">
                                  <Layers className="h-3 w-3 text-accent" />
                                  Active Engine
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2.5 my-1">
                                {project.results?.slice(0, 2).map((res, i) => (
                                  <div key={i} className="p-3 bg-background-secondary rounded-xl border border-border">
                                    <div className="text-[10px] uppercase font-mono text-text-tertiary truncate">{res.label}</div>
                                    <div className="text-heading-sm font-serif font-normal text-text-primary mt-0.5">{res.metric}</div>
                                  </div>
                                )) || (
                                  <div className="col-span-2 p-3 bg-background-secondary rounded-xl border border-border text-center">
                                    <span className="text-body-xs font-mono text-text-tertiary">Production Ready Architecture</span>
                                  </div>
                                )}
                              </div>

                              <div className="p-3 rounded-xl bg-background-secondary border border-border flex items-center justify-between">
                                <span className="text-caption font-mono text-text-secondary">Core Tech</span>
                                <div className="flex gap-1">
                                  {project.tech.slice(0, 3).map((t) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-background-primary border border-border font-mono">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
