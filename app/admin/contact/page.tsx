'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Save, Check, X, Linkedin, Github, FileText, AlertCircle } from 'lucide-react';
import type { SocialLinks } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminContactPage() {
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadContact();
  }, []);

  async function loadContact() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact');
      if (res.ok) {
        const data: SocialLinks = await res.json();
        setSocial(data);
      }
    } catch (err) {
      console.error('Failed to load contact info:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!social) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(social),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Contact & social channels successfully updated.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update contact info.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !social) {
    return <div className="py-12 text-center font-mono text-text-secondary">Loading contact info...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Contact Channels CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Contact &amp; Social Links
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Centrally manage the direct email address, LinkedIn profile, GitHub repository links, and resume pointers.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          loading={saving}
          onClick={handleSave}
        >
          Save Contact Links
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
        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-accent" />
            Direct Email Address / Mailto *
          </label>
          <input
            type="text"
            required
            value={social.email}
            onChange={(e) => setSocial({ ...social, email: e.target.value })}
            placeholder="mailto:misbakousarmn@gmail.com"
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1.5">
            <Linkedin className="h-3.5 w-3.5 text-accent" />
            LinkedIn Profile URL *
          </label>
          <input
            type="url"
            required
            value={social.linkedin}
            onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/misba-kousar-mn"
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5 text-accent" />
            GitHub Profile URL *
          </label>
          <input
            type="url"
            required
            value={social.github}
            onChange={(e) => setSocial({ ...social, github: e.target.value })}
            placeholder="https://github.com/Misba-Kousar-MN"
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-body-xs font-mono font-medium text-text-secondary flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-accent" />
            Active Resume File Path / URL
          </label>
          <input
            type="text"
            value={social.resume}
            onChange={(e) => setSocial({ ...social, resume: e.target.value })}
            placeholder="/resume.pdf"
            className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
          />
          <span className="text-[11px] font-mono text-text-tertiary block mt-1">
            Note: You can also upload and replace the active PDF binary in the "Resume PDF" tab.
          </span>
        </div>
      </form>
    </div>
  );
}
