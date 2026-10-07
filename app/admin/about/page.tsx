'use client';

import React, { useState, useEffect } from 'react';
import { User, Save, Check, X, Sparkles, GraduationCap, Target, Briefcase } from 'lucide-react';
import type { AboutContent } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/about');
      if (res.ok) {
        const data = await res.json();
        setAbout(data);
      }
    } catch (err) {
      console.error('Failed to load about content:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(about),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'About section successfully updated.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update about section.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !about) {
    return <div className="py-12 text-center font-mono text-text-secondary">Loading about content...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Section 01 CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            About &amp; Biography Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Edit the editorial headline, engineering focus cards, and core pillars.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          loading={saving}
          onClick={handleSave}
        >
          Save About Content
        </Button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-[#CFDBC5]/30 border-[#CFDBC5]/80 text-[#21351C] dark:text-[#CFDBC5]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span className="text-body-sm font-medium">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-left">
        {/* Headlines */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-4">
          <h2 className="font-serif text-2xl font-normal text-text-primary">Editorial Headline &amp; Bio</h2>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Main Section Headline *
            </label>
            <input
              type="text"
              required
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-serif"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Subtitle Bio *
            </label>
            <textarea
              rows={2}
              required
              value={about.subtitle}
              onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
            />
          </div>
        </div>

        {/* 6 Engineering Focus Cards */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
          <h2 className="font-serif text-2xl font-normal text-text-primary">6 Engineering Focus Highlights</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {about.highlights.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-background-secondary/80 border border-border space-y-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const copy = [...about.highlights];
                    if (copy[idx]) copy[idx].title = e.target.value;
                    setAbout({ ...about, highlights: copy });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-background-primary border border-border text-body-sm font-semibold"
                />
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const copy = [...about.highlights];
                    if (copy[idx]) copy[idx].desc = e.target.value;
                    setAbout({ ...about, highlights: copy });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-background-primary border border-border text-body-xs font-sans"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-4">
          <h2 className="font-serif text-2xl font-normal text-text-primary">Summary Pillars</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-accent" />
                Education Pillar
              </label>
              <textarea
                rows={3}
                value={about.pillars.education}
                onChange={(e) =>
                  setAbout({ ...about, pillars: { ...about.pillars, education: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-accent" />
                Focus Areas Pillar
              </label>
              <textarea
                rows={3}
                value={about.pillars.focusAreas}
                onChange={(e) =>
                  setAbout({ ...about, pillars: { ...about.pillars, focusAreas: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                Currently Seeking Pillar
              </label>
              <textarea
                rows={3}
                value={about.pillars.currently}
                onChange={(e) =>
                  setAbout({ ...about, pillars: { ...about.pillars, currently: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
