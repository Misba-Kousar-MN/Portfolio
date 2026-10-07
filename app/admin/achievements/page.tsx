'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, ArrowUp, ArrowDown, Edit2, Trash2, Save, Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { Achievement } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [label, setLabel] = useState('');
  const [subtext, setSubtext] = useState('');
  const [prefix, setPrefix] = useState('');
  const [value, setValue] = useState('0');
  const [textValue, setTextValue] = useState('');
  const [suffix, setSuffix] = useState('');
  const [decimals, setDecimals] = useState('0');
  const [isNumeric, setIsNumeric] = useState(true);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/achievements');
      if (res.ok) {
        const data: Achievement[] = await res.json();
        setAchievements(data.sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setLabel('');
    setSubtext('');
    setPrefix('');
    setValue('1');
    setTextValue('');
    setSuffix('+');
    setDecimals('0');
    setIsNumeric(true);
    setPublished(true);
  };

  const openEdit = (item: Achievement) => {
    setIsCreating(false);
    setEditingItem(item);
    setLabel(item.label);
    setSubtext(item.subtext);
    setPrefix(item.prefix || '');
    setValue(String(item.value ?? 0));
    setTextValue(item.textValue || '');
    setSuffix(item.suffix || '');
    setDecimals(String(item.decimals ?? 0));
    setIsNumeric(item.isNumeric);
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

    const payload: Achievement = {
      id: editingItem ? editingItem.id : `ach-${Date.now()}`,
      label,
      subtext,
      prefix: prefix || undefined,
      value: isNumeric ? Number(value) : undefined,
      textValue: !isNumeric ? textValue : undefined,
      suffix: suffix || undefined,
      decimals: Number(decimals),
      isNumeric,
      order: editingItem ? editingItem.order : achievements.length + 1,
      published,
    };

    try {
      let res;
      if (isCreating) {
        res = await fetch('/api/admin/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const updated = achievements.map((a) => (a.id === editingItem?.id ? payload : a));
        res = await fetch('/api/admin/achievements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ achievements: updated }),
        });
      }

      if (res && res.ok) {
        setStatusMessage({ type: 'success', text: `Achievement "${label}" saved successfully.` });
        closeForm();
        await loadAchievements();
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to save achievement.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item: Achievement) => {
    const updated = achievements.map((a) => (a.id === item.id ? { ...a, published: !a.published } : a));
    setAchievements(updated);
    try {
      await fetch('/api/admin/achievements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements: updated }),
      });
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= achievements.length) return;

    const list = [...achievements];
    const [moved] = list.splice(index, 1);
    if (!moved) return;
    list.splice(targetIndex, 0, moved);

    const reindexed = list.map((a, i) => ({ ...a, order: i + 1 }));
    setAchievements(reindexed);

    try {
      await fetch('/api/admin/achievements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements: reindexed }),
      });
    } catch (err) {
      console.error('Failed to update achievement order:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const filtered = achievements.filter((a) => a.id !== id);
    setAchievements(filtered);
    try {
      await fetch('/api/admin/achievements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements: filtered }),
      });
    } catch (err) {
      console.error('Failed to delete achievement:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Section 03 CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Achievements &amp; Metrics Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Manage counter stats, hackathon awards, and academic CGPA cards rendered in the public achievements banner.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Achievement
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

      {/* Grid of Achievements */}
      <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <h2 className="font-serif text-2xl font-normal text-text-primary">
          Active Achievements ({achievements.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center font-mono text-text-secondary">Loading achievements...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((item, index) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-background-secondary/80 border border-border flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={index === 0}
                        onClick={() => moveOrder(index, 'up')}
                        className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        disabled={index === achievements.length - 1}
                        onClick={() => moveOrder(index, 'down')}
                        className="p-0.5 text-text-tertiary hover:text-text-primary disabled:opacity-30"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="w-6 h-6 rounded-lg bg-accent-light text-accent text-caption font-mono font-bold flex items-center justify-center">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-lg font-normal text-text-primary">{item.label}</h4>
                      <p className="text-body-xs text-text-secondary">{item.subtext}</p>
                    </div>
                  </div>

                  <div className="font-serif text-2xl text-accent font-normal tracking-tight">
                    {item.isNumeric ? `${item.prefix || ''}${item.value}${item.suffix || ''}` : item.textValue}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${item.published ? 'bg-[#CFDBC5]/40 text-[#21351C] dark:text-[#CFDBC5]' : 'bg-amber-100 text-amber-800'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(item)}>
                      {item.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Form Drawer */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-background-primary border border-border rounded-3xl p-6 space-y-6 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-normal text-text-primary">
                {isCreating ? 'Add Achievement' : 'Edit Achievement'}
              </h3>
              <button onClick={closeForm} className="p-1 text-text-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-body-xs font-mono font-medium text-text-secondary">
                  Label Title *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. National Hackathon Finalist"
                  className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-body-xs font-mono font-medium text-text-secondary">
                  Subtext Description
                </label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder="e.g. Secured Top 5 with ReviewTrust AI platform"
                  className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    checked={isNumeric}
                    onChange={() => setIsNumeric(true)}
                  />
                  <span>Numeric Counter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    checked={!isNumeric}
                    onChange={() => setIsNumeric(false)}
                  />
                  <span>Text Value</span>
                </label>
              </div>

              {isNumeric ? (
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary">Prefix</label>
                    <input
                      type="text"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      placeholder="Top "
                      className="w-full px-2 py-1.5 rounded-lg bg-background-secondary border border-border text-body-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary">Value *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="5"
                      className="w-full px-2 py-1.5 rounded-lg bg-background-secondary border border-border text-body-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary">Suffix</label>
                    <input
                      type="text"
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="+"
                      className="w-full px-2 py-1.5 rounded-lg bg-background-secondary border border-border text-body-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary">Decimals</label>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-lg bg-background-secondary border border-border text-body-xs font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-medium text-text-secondary">Text Value</label>
                  <input
                    type="text"
                    required
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder="e.g. Multiple"
                    className="w-full px-3.5 py-2 rounded-xl bg-background-secondary border border-border text-body-sm"
                  />
                </div>
              )}

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
                  Save Achievement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
