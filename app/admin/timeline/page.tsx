'use client';

import React, { useState, useEffect } from 'react';
import { History, Plus, ArrowUp, ArrowDown, Edit2, Trash2, Save, Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { TimelineItem } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/timeline');
      if (res.ok) {
        const data: TimelineItem[] = await res.json();
        setTimeline(data.sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setYear(new Date().getFullYear().toString());
    setTitle('');
    setDescription('');
    setPublished(true);
  };

  const openEdit = (item: TimelineItem) => {
    setIsCreating(false);
    setEditingItem(item);
    setYear(item.year);
    setTitle(item.title);
    setDescription(item.description);
    setPublished(item.published);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const payload: TimelineItem = {
      id: editingItem ? editingItem.id : `t-${Date.now()}`,
      year,
      title,
      description,
      order: editingItem ? editingItem.order : timeline.length + 1,
      published,
    };

    try {
      let res;
      if (isCreating) {
        res = await fetch('/api/admin/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const updated = timeline.map((t) => (t.id === editingItem?.id ? payload : t));
        res = await fetch('/api/admin/timeline', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeline: updated }),
        });
      }

      if (res && res.ok) {
        setStatusMessage({ type: 'success', text: `Milestone "${title}" saved successfully.` });
        closeForm();
        await loadTimeline();
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to save milestone.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timeline.length) return;

    const list = [...timeline];
    const [moved] = list.splice(index, 1);
    if (!moved) return;
    list.splice(targetIndex, 0, moved);

    const reindexed = list.map((t, i) => ({ ...t, order: i + 1 }));
    setTimeline(reindexed);

    try {
      await fetch('/api/admin/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: reindexed }),
      });
    } catch (err) {
      console.error('Failed to update timeline order:', err);
    }
  };

  const togglePublish = async (item: TimelineItem) => {
    const updated = timeline.map((t) => (t.id === item.id ? { ...t, published: !t.published } : t));
    setTimeline(updated);
    try {
      await fetch('/api/admin/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: updated }),
      });
    } catch (err) {
      console.error('Failed to toggle publish state:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const filtered = timeline.filter((t) => t.id !== id);
    setTimeline(filtered);
    try {
      await fetch('/api/admin/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: filtered }),
      });
    } catch (err) {
      console.error('Failed to delete timeline milestone:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Section 05 CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Timeline &amp; Career Milestones
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Maintain the chronological progression of academic education, hackathons, and software engineering milestones.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Milestone
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

      {/* Timeline List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <h2 className="font-serif text-2xl font-normal text-text-primary">
          Chronological Milestones ({timeline.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center font-mono text-text-secondary">Loading timeline...</div>
        ) : (
          <div className="divide-y divide-border">
            {timeline.map((item, index) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-0.5 mt-1">
                    <button
                      disabled={index === 0}
                      onClick={() => moveOrder(index, 'up')}
                      className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      disabled={index === timeline.length - 1}
                      onClick={() => moveOrder(index, 'down')}
                      className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-[#D8BFD8]/35 text-accent text-body-xs font-mono font-bold">
                    {item.year}
                  </span>

                  <div>
                    <h4 className="font-serif text-lg font-normal text-text-primary">{item.title}</h4>
                    <p className="text-body-sm text-text-secondary">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button variant="ghost" size="sm" onClick={() => togglePublish(item)}>
                    {item.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Drawer */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-background-primary border border-border rounded-3xl p-6 space-y-6 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-normal text-text-primary">
                {isCreating ? 'Add Milestone' : 'Edit Milestone'}
              </h3>
              <button onClick={closeForm} className="p-1 text-text-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-body-xs font-mono font-medium text-text-secondary">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-body-xs font-mono font-medium text-text-secondary">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Started BE AI & ML"
                    className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-body-xs font-mono font-medium text-text-secondary">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key accomplishments or details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                />
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <span className="text-body-sm text-text-primary">Published</span>
              </label>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  Save Milestone
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
