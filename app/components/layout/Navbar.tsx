'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useScroll } from '@/hooks/useScroll';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { navbarVariants, mobileMenuVariants } from '@/lib/animations';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { scrollY, scrollTo } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setIsScrolled(scrollY > 40);
  }, [scrollY]);

  // Track currently active section
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'projects', 'skills', 'achievements', 'timeline', 'contact'];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        if (!id) continue;
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.replace('#', '');
    setActiveSection(targetId);
    scrollTo(`#${targetId}`, { offset: -84 });
  };

  return (
    <motion.header
      variants={navbarVariants}
      initial="initial"
      animate={isScrolled ? 'shrink' : 'visible'}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-editorial',
        isScrolled
          ? 'bg-background-primary/85 backdrop-blur-xl border-b border-border shadow-subtle py-2.5'
          : 'bg-transparent py-4 sm:py-5'
      )}
      role="banner"
    >
      <div className="container">
        <div className="flex h-12 items-center justify-between gap-4">
          {/* Brand Identity / Monogram */}
          <Link
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-2.5 text-text-primary focus-visible:outline-none"
            aria-label="Go to homepage"
          >
            <span className="w-9 h-9 rounded-xl bg-accent-light text-accent border border-accent/20 flex items-center justify-center font-serif font-bold text-lg tracking-tight group-hover:bg-accent group-hover:text-white transition-all duration-200">
              MK
            </span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-medium text-body-sm text-text-primary leading-tight group-hover:text-accent transition-colors">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider">
                AI &amp; Full Stack
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-background-secondary/80 backdrop-blur-md border border-border shadow-subtle"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-full text-body-sm font-medium transition-colors duration-200 select-none',
                    isActive ? 'text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-[#D8BFD8]/30 dark:bg-[#D8BFD8]/20 border border-[#D8BFD8]/60 shadow-2xs z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-background-secondary/80 border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 shadow-2xs"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              className="md:hidden p-2.5 rounded-xl bg-background-secondary/80 border border-border text-text-secondary hover:text-text-primary transition-colors shadow-2xs"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-3 rounded-2xl border border-border bg-background-primary/95 backdrop-blur-2xl shadow-card overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="p-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const targetId = link.href.replace('#', '');
                  const isActive = activeSection === targetId;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        'block px-4 py-2.5 rounded-xl text-body-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#D8BFD8]/25 text-accent font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}