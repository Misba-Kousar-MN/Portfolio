'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Linkedin, Github, FileText, ArrowUpRight, Sparkles, Copy, Check, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Mascot } from '@/components/layout/Mascot';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import type { SocialLinks, ResumeMetadata } from '@/types';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Please enter a valid email address').max(200, 'Email must be under 200 characters'),
  subject: z.string().trim().min(2, 'Subject must be at least 2 characters').max(200, 'Subject must be under 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be under 5000 characters'),
  website: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactProps {
  socialLinks?: SocialLinks;
  resumeMeta?: ResumeMetadata;
}

export function Contact({ socialLinks, resumeMeta }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailValue = socialLinks?.email ? socialLinks.email.replace('mailto:', '') : 'misbakousarmn@gmail.com';
  const linkedinUrl = socialLinks?.linkedin || 'https://linkedin.com/in/misba-kousar-mn';
  const githubUrl = socialLinks?.github || 'https://github.com/Misba-Kousar-MN';
  const resumeDownloadUrl = resumeMeta?.url || socialLinks?.resume || '/resume.pdf';

  const contactTiles = [
    {
      id: 'email',
      name: 'Direct Email',
      description: 'Best for internship inquiries, project proposals, or engineering discussions.',
      detail: emailValue,
      href: `mailto:${emailValue}`,
      icon: Mail,
      badge: 'Primary Channel',
      badgeBg: 'bg-[#FFD1DC]/40',
      badgeText: 'text-[#4A2E35] dark:text-[#FFD1DC]',
      badgeBorder: 'border-[#FFD1DC]/80 dark:border-[#FFD1DC]/40',
      hoverBorder: 'hover:border-[#FFD1DC]',
      canCopy: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional networking, experience timeline, and recommendations.',
      detail: linkedinUrl.replace('https://', ''),
      href: linkedinUrl,
      icon: Linkedin,
      badge: 'Professional Network',
      badgeBg: 'bg-[#D8BFD8]/40',
      badgeText: 'text-[#3E2E42] dark:text-[#E2CBE4]',
      badgeBorder: 'border-[#D8BFD8]/80 dark:border-[#D8BFD8]/40',
      hoverBorder: 'hover:border-[#D8BFD8]',
      isExternal: true,
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Explore code repositories, commits, full-stack builds, and ML projects.',
      detail: githubUrl.replace('https://', ''),
      href: githubUrl,
      icon: Github,
      badge: 'Code & Architecture',
      badgeBg: 'bg-[#CFDBC5]/40',
      badgeText: 'text-[#2D3B26] dark:text-[#CFDBC5]',
      badgeBorder: 'border-[#CFDBC5]/80 dark:border-[#CFDBC5]/40',
      hoverBorder: 'hover:border-[#CFDBC5]',
      isExternal: true,
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(emailValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setFormSubmitted(true);
        reset();
      } else {
        setErrorMessage(result.error || 'Failed to send message. Please try again or use direct email.');
      }
    } catch {
      setErrorMessage('Network connection error. Please check your connection or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" size="lg" background="default" className="relative">
      {/* Section Header */}
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-2 mb-3 text-caption font-mono text-accent uppercase tracking-widest">
          <span>05</span>
          <span className="w-8 h-px bg-accent/40" />
          <span>Get in Touch</span>
        </div>
        <SectionHeader
          align="left"
          title="Let's build something extraordinary together."
          subtitle="Whether you have an internship opportunity, a project proposal, or want to discuss AI systems — my inbox is always open."
        />
      </ScrollReveal>

      <div className="mt-14 max-w-5xl mx-auto space-y-12">
        {/* Editorial Greeting Card with Mascot */}
        <ScrollReveal variant="fadeUp" threshold={0.12}>
          <div className="relative overflow-hidden rounded-3xl bg-background-secondary/90 backdrop-blur-md border border-border p-8 sm:p-10 shadow-subtle">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD1DC]/40 text-[#452D34] dark:text-[#FFD1DC] text-caption font-medium border border-[#FFD1DC]/80 dark:border-[#FFD1DC]/40">
                    <Sparkles className="h-3 w-3 text-accent" />
                    Open to AI / Software Engineering Internships
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight leading-snug">
                  Let's create impactful <span className="italic text-accent">intelligence</span>.
                </h3>
                <p className="text-body text-text-secondary leading-relaxed font-sans">
                  I am eager to contribute my skills in neural network architectures, prompt engineering, and modern full-stack web platforms to forward-thinking engineering teams.
                </p>
              </div>

              {/* Friendly Vector Mascot */}
              <div className="flex-shrink-0 self-center md:self-auto p-4 rounded-3xl bg-background-primary/80 border border-[#D8BFD8]/50 shadow-subtle">
                <Mascot state="contact" className="w-20 h-24 sm:w-24 sm:h-28" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Contact Tiles Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {contactTiles.map((tile, index) => {
            const IconComponent = tile.icon;

            return (
              <ScrollReveal key={tile.id} variant="fadeUp" delay={index * 0.08} threshold={0.15}>
                <a
                  href={tile.href}
                  target={tile.isExternal ? '_blank' : undefined}
                  rel={tile.isExternal ? 'noopener noreferrer' : undefined}
                  className={`group relative flex flex-col justify-between h-full p-7 rounded-3xl bg-background-secondary/90 backdrop-blur-xs border border-border ${tile.hoverBorder} hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ease-editorial text-left`}
                  aria-label={`${tile.name} - ${tile.detail}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-background-primary flex items-center justify-center text-text-primary group-hover:scale-105 group-hover:text-accent transition-all duration-200 border border-border shadow-2xs">
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-caption px-2.5 py-0.5 rounded-full font-medium border ${tile.badgeBg} ${tile.badgeText} ${tile.badgeBorder}`}
                        >
                          {tile.badge}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <h4 className="font-serif text-xl sm:text-2xl font-normal text-text-primary group-hover:text-accent transition-colors">
                        {tile.name}
                      </h4>
                      <p className="text-body-sm text-text-secondary leading-relaxed font-sans">
                        {tile.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-body-xs font-mono font-medium text-text-secondary truncate pr-2">
                      {tile.detail}
                    </span>

                    {tile.canCopy && (
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 text-caption text-text-tertiary hover:text-accent p-1.5 rounded-lg hover:bg-background-primary transition-colors cursor-pointer"
                        title="Copy email to clipboard"
                        aria-label="Copy email address"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Direct Recruiter Message Form */}
        <ScrollReveal variant="fadeUp" threshold={0.15}>
          <div className="p-8 sm:p-10 rounded-3xl bg-background-secondary/90 border border-border shadow-subtle space-y-6 text-left">
            <div>
              <h3 className="font-serif text-2xl font-normal text-text-primary">Send a Direct Message</h3>
              <p className="text-body-sm text-text-secondary mt-1">
                Have an inquiry or opportunity? Drop a note below and it will be delivered directly to my private inbox.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-body-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#CFDBC5]/30 border border-[#CFDBC5]/80 flex items-start sm:items-center gap-4 text-text-primary">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1">
                  <h4 className="text-body font-semibold">Message sent successfully!</h4>
                  <p className="text-body-sm text-text-secondary mt-0.5">
                    Your message has been received and saved. I will review it and reply to you promptly.
                  </p>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-caption font-mono text-accent hover:underline cursor-pointer"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                  {...register('website')}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Jane Doe"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Your Email *"
                    type="email"
                    placeholder="e.g. jane@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <Input
                  label="Subject *"
                  placeholder="e.g. AI Internship Opportunity / Project Collaboration"
                  error={errors.subject?.message}
                  {...register('subject')}
                />

                <Textarea
                  label="Message *"
                  placeholder="Share details about your team, role, or project..."
                  error={errors.message?.message}
                  {...register('message')}
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    icon={<Send className="h-4 w-4" />}
                    iconPosition="right"
                    className="rounded-xl px-7"
                  >
                    Send Message
                  </Button>

                  <span className="text-[11px] font-mono text-text-tertiary">
                    Validated &amp; delivered directly
                  </span>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>

        {/* Resume Download Action Pill */}
        <ScrollReveal variant="fadeUp" threshold={0.15}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-background-secondary/60 border border-border">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-[#E0F7FA]/50 border border-[#E0F7FA] flex items-center justify-center text-[#143B41] dark:text-[#B2EBF2] flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-body-sm font-semibold text-text-primary">
                  Looking for my full formal CV?
                </p>
                <p className="text-caption text-text-secondary">
                  Includes coursework, project implementations, publications, and complete technical breakdown.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
              <a
                href={resumeDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-background-secondary text-text-primary border border-border hover:border-accent hover:text-accent font-medium text-body-sm shadow-subtle hover:shadow-card transition-all duration-200 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Resume</span>
              </a>
              <a
                href={resumeDownloadUrl}
                download="Misba_Kousar_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white hover:bg-accent-hover font-medium text-body-sm shadow-subtle hover:shadow-card transition-all duration-200 flex-shrink-0 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>Download Resume PDF</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
