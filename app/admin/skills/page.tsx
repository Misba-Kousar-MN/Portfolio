'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, X, Save, Check, Code, Layout, Server, Database, Brain, Wrench, AlertCircle } from 'lucide-react';
import type { SkillCategoryItem } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New skill input per category
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddSkill = (categoryKey: string) => {
    const inputVal = (newSkillInputs[categoryKey] || '').trim();
    if (!inputVal) return;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.key === categoryKey && !cat.skills.includes(inputVal)) {
          return { ...cat, skills: [...cat.skills, inputVal] };
        }
        return cat;
      })
    );

    setNewSkillInputs((prev) => ({ ...prev, [categoryKey]: '' }));
  };

  const handleRemoveSkill = (categoryKey: string, skillName: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.key === categoryKey) {
          return { ...cat, skills: cat.skills.filter((s) => s !== skillName) };
        }
        return cat;
      })
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);

    const skillsMap: Record<string, string[]> = {};
    categories.forEach((cat) => {
      skillsMap[cat.key] = cat.skills;
    });

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsMap, skillCategories: categories }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'All skill categories successfully updated and published.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update skills.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred while saving skills.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Section 04 CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Skills &amp; Competencies Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Organize machine learning frameworks, programming languages, databases, and developer tools.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          loading={saving}
          onClick={handleSaveAll}
        >
          Save All Changes
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

      {/* Categories Grid */}
      {loading ? (
        <div className="py-12 text-center font-mono text-text-secondary">Loading skills...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="p-6 rounded-3xl bg-background-primary border border-border shadow-subtle flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-normal text-text-primary">{cat.label}</h3>
                  <span className="text-caption font-mono text-text-tertiary">{cat.skills.length} skills</span>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-background-secondary border border-border text-body-xs font-mono text-text-primary group"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(cat.key, skill)}
                        className="text-text-tertiary hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Skill Input */}
              <div className="pt-3 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={newSkillInputs[cat.key] || ''}
                  onChange={(e) =>
                    setNewSkillInputs((prev) => ({ ...prev, [cat.key]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(cat.key);
                    }
                  }}
                  placeholder="e.g. PyTorch, Rust..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-background-secondary border border-border text-body-xs font-mono"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddSkill(cat.key)}
                  className="px-3"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
