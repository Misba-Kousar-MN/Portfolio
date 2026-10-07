import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, ShieldAlert, Activity, Layers, Cpu, Database, Sparkles } from 'lucide-react';
import { getProjectById, getPublishedProjects, getPortfolioContent } from '@/lib/content-service';
import { Button } from '@/components/ui/Button';

interface CaseStudyPageProps {
  params: {
    id: string;
  };
}

const iconMap: Record<string, typeof Cpu> = {
  Cpu,
  Activity,
  Layers,
  Database,
  ShieldAlert,
  Sparkles,
};

export function generateStaticParams() {
  const projects = getPublishedProjects();
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = getProjectById(params.id);
  const content = getPortfolioContent();
  if (!project) return { title: 'Case Study | Not Found' };

  return {
    title: `${project.name} — Technical Case Study | ${content.siteConfig.name}`,
    description: project.description,
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const results = project.results || [];
  const architecture = project.architecture || [];
  const challenges = Array.isArray(project.challenges)
    ? project.challenges
    : project.challenges
    ? [project.challenges]
    : [];

  return (
    <article className="min-h-screen py-24 sm:py-32 bg-background-primary text-text-primary">
      <div className="container max-w-5xl">
        {/* Navigation back */}
        <div className="mb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Case Study Header */}
        <header className="space-y-6 pb-12 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-caption font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
              {project.category || 'Applied AI & Engineering'}
            </span>
            {project.badge && (
              <span className="text-caption font-mono px-3 py-1 rounded-full bg-[#D8BFD8]/40 text-[#3C223C] dark:text-[#E2CBE4] border border-[#D8BFD8]">
                {project.badge}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1]">
            {project.name}
          </h1>

          <p className="text-heading-lg font-mono text-accent font-semibold">
            {project.tagline}
          </p>

          <p className="text-body-lg text-text-secondary max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.demo && (
              <Button variant="primary" icon={<ExternalLink className="h-4 w-4" />} iconPosition="right" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  Live Deployment
                </a>
              </Button>
            )}
            {project.github && (
              <Button variant="secondary" icon={<Github className="h-4 w-4" />} iconPosition="left" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  Source Repository
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Metrics Grid */}
        {results.length > 0 && (
          <section className="py-12 border-b border-border">
            <h2 className="text-caption font-mono uppercase tracking-wider text-text-tertiary mb-6">
              Key Results &amp; Validations
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((r, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background-secondary border border-border">
                  <div className="font-serif text-4xl sm:text-5xl text-accent font-normal tracking-tight">
                    {r.metric}
                  </div>
                  <div className="text-body-xs font-medium text-text-secondary mt-2">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Architectural Pillars */}
        {architecture.length > 0 && (
          <section className="py-12 border-b border-border space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-normal text-text-primary">System Architecture &amp; Pipeline</h2>
              <p className="text-body text-text-secondary mt-2">Core technical components driving the application</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {architecture.map((arch, i) => {
                const IconComponent = (arch.iconName && iconMap[arch.iconName]) || Cpu;

                return (
                  <div key={i} className="p-7 rounded-2xl bg-background-secondary border border-border space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-heading-sm font-semibold text-text-primary">{arch.title}</h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed">{arch.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Engineering Challenges & Solutions */}
        {challenges.length > 0 && (
          <section className="py-12 border-b border-border space-y-6">
            <h2 className="font-serif text-3xl font-normal text-text-primary">Engineering Challenges Overcome</h2>
            <div className="space-y-4">
              {challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background-secondary/60 border border-border">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-body-sm text-text-secondary leading-relaxed">{c}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features & Tech Stack */}
        <section className="py-12 grid gap-10 md:grid-cols-2">
          {project.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-text-primary">Implemented Capabilities</h3>
              <ul className="space-y-2.5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.tech.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-text-primary">Technologies Leveraged</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3.5 py-1.5 rounded-xl bg-background-secondary border border-border text-text-secondary text-body-sm font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bottom CTA to return */}
        <footer className="pt-12 border-t border-border flex justify-between items-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-body-sm font-medium text-text-secondary hover:text-text-primary"
            >
              <span>Launch Live App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}
