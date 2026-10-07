'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Save, Check, X, Sparkles } from 'lucide-react';
import type { HeroContent } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [badgesText, setBadgesText] = useState('');

  useEffect(() => {
    loadHero();
  }, []);

  async function loadHero() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero');
      if (res.ok) {
        const data: HeroContent = await res.json();
        setHero(data);
        setBadgesText(data.badges.join(', '));
      }
    } catch (err) {
      console.error('Failed to load hero content:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSaving(true);
    setStatusMessage(null);

    const updatedHero = {
      ...hero,
      badges: badgesText
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHero),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Hero & profile content updated successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update hero content.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !hero) {
    return <div className="py-12 text-center font-mono text-text-secondary">Loading hero content...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Hero Section CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Hero &amp; Profile Presentation
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Customize the landing screen headline, availability badge, bio paragraph, and call-to-action buttons.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          loading={saving}
          onClick={handleSave}
        >
          Save Hero Settings
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

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6 text-left">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Role Title *
            </label>
            <input
              type="text"
              required
              value={hero.role}
              onChange={(e) => setHero({ ...hero, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary">
            Availability Status Badge Text *
          </label>
          <input
            type="text"
            required
            value={hero.statusBadge}
            onChange={(e) => setHero({ ...hero, statusBadge: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Headline Prefix *
            </label>
            <input
              type="text"
              required
              value={hero.headlinePrefix}
              onChange={(e) => setHero({ ...hero, headlinePrefix: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Headline Italic Highlight *
            </label>
            <input
              type="text"
              required
              value={hero.headlineEmphasis}
              onChange={(e) => setHero({ ...hero, headlineEmphasis: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-serif italic"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Headline Suffix *
            </label>
            <input
              type="text"
              required
              value={hero.headlineSuffix}
              onChange={(e) => setHero({ ...hero, headlineSuffix: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary">
            Bio Supporting Copy *
          </label>
          <textarea
            rows={3}
            required
            value={hero.bio}
            onChange={(e) => setHero({ ...hero, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary">
            Hero Tech Badges (comma separated)
          </label>
          <input
            type="text"
            value={badgesText}
            onChange={(e) => setBadgesText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Primary CTA Button Label
            </label>
            <input
              type="text"
              value={hero.primaryCtaText}
              onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-body-xs font-mono font-medium text-text-secondary">
              Secondary CTA Button Label
            </label>
            <input
              type="text"
              value={hero.secondaryCtaText}
              onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
