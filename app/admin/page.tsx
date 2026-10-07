'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  FolderKanban,
  Award,
  Sparkles,
  History,
  FileText,
  ArrowRight,
  ExternalLink,
  Plus,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import type { PortfolioData, MessageStats } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminOverviewPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [messageStats, setMessageStats] = useState<MessageStats>({ total: 0, unread: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const [contentRes, statsRes] = await Promise.all([
          fetch('/api/admin/content'),
          fetch('/api/admin/messages/stats'),
        ]);

        if (contentRes.ok) {
          const json = await contentRes.json();
          setData(json);
        }

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setMessageStats(statsJson);
        }
      } catch (err) {
        console.error('Failed to load portfolio content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-background-secondary rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-background-secondary rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const publishedProjects = data.projects.filter((p) => p.published).length;
  const draftProjects = data.projects.length - publishedProjects;
  const publishedAchievements = data.achievements.filter((a) => a.published).length;
  const totalSkills = Object.values(data.skills).reduce((acc, list) => acc + list.length, 0);
  const publishedTimeline = data.timeline.filter((t) => t.published).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-medium border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Content &amp; Inbox Engine Online
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight">
            Portfolio Management Dashboard
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Manage projects, achievements, skills, resume PDF, and review incoming contact inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={<ExternalLink className="h-4 w-4" />} asChild>
            <Link href="/" target="_blank">
              View Public Site
            </Link>
          </Button>
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />} asChild>
            <Link href="/admin/projects?action=new">
              Add New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Inbox Card */}
        <Link
          href="/admin/messages"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent hover:shadow-card transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD1DC]/40 text-accent flex items-center justify-center">
              <Inbox className="h-5 w-5" />
            </div>
            {messageStats.unread > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-[#FFD1DC] text-[#4A2E35] text-[10px] font-mono font-bold">
                {messageStats.unread} Unread
              </span>
            ) : (
              <span className="text-caption font-mono text-text-tertiary">Inbox</span>
            )}
          </div>
          <div className="font-serif text-3xl font-normal text-text-primary">
            {messageStats.total}{' '}
            <span className="text-body-sm font-sans text-text-secondary font-normal">
              messages ({messageStats.thisWeek} this week)
            </span>
          </div>
          <div className="text-caption text-text-secondary mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
            <span>View &amp; reply to contact inquiries</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent hover:shadow-card transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8BFD8]/40 text-accent flex items-center justify-center">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="text-caption font-mono text-text-tertiary">Projects</span>
          </div>
          <div className="font-serif text-3xl font-normal text-text-primary">
            {publishedProjects}{' '}
            <span className="text-body-sm font-sans text-text-secondary font-normal">
              published {draftProjects > 0 ? `(${draftProjects} draft)` : ''}
            </span>
          </div>
          <div className="text-caption text-text-secondary mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
            <span>Manage project case studies &amp; orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Achievements Card */}
        <Link
          href="/admin/achievements"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent hover:shadow-card transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#CFDBC5]/40 text-accent flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-caption font-mono text-text-tertiary">Achievements</span>
          </div>
          <div className="font-serif text-3xl font-normal text-text-primary">
            {publishedAchievements}{' '}
            <span className="text-body-sm font-sans text-text-secondary font-normal">milestones</span>
          </div>
          <div className="text-caption text-text-secondary mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
            <span>Edit hackathon &amp; academic records</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Resume Card */}
        <Link
          href="/admin/resume"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent hover:shadow-card transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0F7FA]/50 text-[#143B41] dark:text-[#B2EBF2] flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-caption font-mono text-text-tertiary">Active Resume</span>
          </div>
          <div className="font-serif text-2xl font-normal text-text-primary truncate">
            {data.resume.fileName || 'resume.pdf'}
          </div>
          <div className="text-caption text-text-secondary mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
            <span>Upload replacement PDF</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* Current Projects Preview Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-normal text-text-primary">Active Portfolio Projects</h2>
            <p className="text-body-sm text-text-secondary mt-0.5">
              These projects are automatically rendered in the public editorial section in this exact order.
            </p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/admin/projects">Manage All ({data.projects.length})</Link>
          </Button>
        </div>

        <div className="divide-y divide-border">
          {data.projects.map((project, index) => (
            <div key={project.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-accent-light text-accent text-body-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-normal text-text-primary">{project.name}</span>
                    {project.published ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#CFDBC5]/40 text-[#24351E] dark:text-[#CFDBC5] text-[10px] font-mono font-medium border border-[#CFDBC5]">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-medium border border-amber-300">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-body-xs text-text-secondary line-clamp-1 mt-0.5">{project.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/case-studies/${project.id}`} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Case Study
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/projects?edit=${project.id}`}>
                    Edit Project
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Quick Jump Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Link
          href="/admin/messages"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent transition-all duration-200 space-y-2"
        >
          <div className="flex items-center gap-2 text-text-primary font-serif text-lg">
            <Inbox className="h-4 w-4 text-accent" />
            <span>Inquiry Inbox</span>
          </div>
          <p className="text-body-xs text-text-secondary leading-relaxed">
            {messageStats.unread} unread responses from recruiters and collaborators.
          </p>
        </Link>

        <Link
          href="/admin/skills"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent transition-all duration-200 space-y-2"
        >
          <div className="flex items-center gap-2 text-text-primary font-serif text-lg">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Skills &amp; Stacks</span>
          </div>
          <p className="text-body-xs text-text-secondary leading-relaxed">
            {totalSkills} technical competencies categorized across ML, Web, and Tools.
          </p>
        </Link>

        <Link
          href="/admin/timeline"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent transition-all duration-200 space-y-2"
        >
          <div className="flex items-center gap-2 text-text-primary font-serif text-lg">
            <History className="h-4 w-4 text-accent" />
            <span>Timeline Journey</span>
          </div>
          <p className="text-body-xs text-text-secondary leading-relaxed">
            {publishedTimeline} chronological academic and engineering milestones.
          </p>
        </Link>

        <Link
          href="/admin/about"
          className="p-6 rounded-3xl bg-background-primary border border-border hover:border-accent transition-all duration-200 space-y-2"
        >
          <div className="flex items-center gap-2 text-text-primary font-serif text-lg">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>About &amp; Biography</span>
          </div>
          <p className="text-body-xs text-text-secondary leading-relaxed">
            Update engineering focus cards, academic background details, and pillars.
          </p>
        </Link>
      </div>
    </div>
  );
}
