'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, FileText, ArrowUp } from 'lucide-react';
import { SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useScroll } from '@/hooks/useScroll';

export function Footer() {
  const { scrollTo } = useScroll();

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(0, { duration: 1.0 });
  };

  return (
    <footer className="bg-background-secondary/90 border-t border-border py-16 sm:py-20 text-text-primary" role="contentinfo">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-3 items-start">
          {/* Col 1: Identity & Description */}
          <div className="space-y-4">
            <Link
              href="#hero"
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none"
              aria-label="Go to homepage"
            >
              <span className="w-9 h-9 rounded-xl bg-accent-light text-accent border border-accent/20 flex items-center justify-center font-serif font-bold text-lg tracking-tight group-hover:bg-accent group-hover:text-white transition-all duration-200">
                MK
              </span>
              <span className="font-medium text-body text-text-primary font-serif">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-body-sm text-text-secondary max-w-sm leading-relaxed font-sans">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Col 2: Social Connect Links */}
          <div className="space-y-4">
            <h3 className="text-body-sm font-semibold text-text-primary uppercase font-mono tracking-wider">Connect Channels</h3>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={SOCIAL_LINKS.email}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background-primary text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all text-body-sm"
                aria-label="Send email"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email</span>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background-primary text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all text-body-sm"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background-primary text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all text-body-sm"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a
                href={SOCIAL_LINKS.resume}
                download="Misba_Kousar_Resume.pdf"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors text-body-sm"
                aria-label="Download resume"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Resume</span>
              </a>
            </div>
          </div>

          {/* Col 3: Tech Stack & Origin */}
          <div className="md:text-right space-y-2">
            <p className="text-body-sm text-text-secondary">
              Designed &amp; engineered by
              <span className="font-serif italic font-medium text-text-primary"> {SITE_CONFIG.name}</span>
            </p>
            <p className="text-caption text-text-tertiary font-mono">
              Next.js 14 • TypeScript • Tailwind CSS • Three.js • Lenis
            </p>
            <div className="pt-2 flex md:justify-end items-center gap-1.5 text-caption text-text-tertiary">
              <span className="w-2 h-2 rounded-full bg-[#FFD1DC]" />
              <span className="w-2 h-2 rounded-full bg-[#CFDBC5]" />
              <span className="w-2 h-2 rounded-full bg-[#D8BFD8]" />
              <span className="ml-1 font-medium text-text-secondary">Porcelain &amp; Twilight Editorial</span>
            </div>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-text-tertiary text-center sm:text-left">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>

          <button
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-accent transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}