'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  AlertCircle,
  Sparkles,
  Save,
  X,
  Layers,
  Cpu,
  Activity,
  Database,
  ShieldAlert,
} from 'lucide-react';
import type { Project, ProjectResult, ProjectArchitecture } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit / Create Form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form input states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [challenges, setChallenges] = useState('');
  const [impact, setImpact] = useState('');
  const [tech, setTech] = useState('');
  const [features, setFeatures] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');
  const [badge, setBadge] = useState('');
  const [featured, setFeatured] = useState(true);
  const [published, setPublished] = useState(true);
  const [results, setResults] = useState<ProjectResult[]>([]);
  const [architecture, setArchitecture] = useState<ProjectArchitecture[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data: Project[] = await res.json();
        setProjects(data.sort((a, b) => a.order - b.order));

        const editId = searchParams.get('edit');
        const action = searchParams.get('action');

        if (editId) {
          const target = data.find((p) => p.id === editId);
          if (target) openEditModal(target);
        } else if (action === 'new') {
          openCreateModal();
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingProject(null);
    setName('');
    setSlug('');
    setTagline('');
    setCategory('AI & Full-Stack Systems');
    setDescription('');
    setProblem('');
    setSolution('');
    setChallenges('');
    setImpact('');
    setTech('Next.js, TypeScript, Tailwind CSS, Python');
    setFeatures('Real-time updates\nModern responsive UI\nSecure authentication');
    setGithub('');
    setDemo('');
    setBadge('');
    setFeatured(true);
    setPublished(true);
    setResults([
      { metric: '95%', label: 'Benchmark Accuracy' },
      { metric: '<200ms', label: 'Inference Latency' },
    ]);
    setArchitecture([
      { title: 'Core Processing Engine', description: 'Transformer inference pipeline and background workers.' },
      { title: 'Full Stack Interface', description: 'Next.js App Router with TypeScript and Tailwind CSS.' },
    ]);
  };

  const openEditModal = (p: Project) => {
    setIsCreating(false);
    setEditingProject(p);
    setName(p.name);
    setSlug(p.id);
    setTagline(p.tagline);
    setCategory(p.category || 'Software Engineering');
    setDescription(p.description);
    setProblem(p.problem || '');
    setSolution(p.solution || '');
    setChallenges(Array.isArray(p.challenges) ? p.challenges.join('\n') : p.challenges || '');
    setImpact(p.impact || '');
    setTech(p.tech.join(', '));
    setFeatures(p.features.join('\n'));
    setGithub(p.github);
    setDemo(p.demo);
    setBadge(p.badge || '');
    setFeatured(p.featured);
    setPublished(p.published);
    setResults(p.results || []);
    setArchitecture(p.architecture || []);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const techArray = tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const challengesArray = challenges
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      id: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name,
      tagline,
      category,
      description,
      problem,
      solution,
      challenges: challengesArray,
      impact,
      tech: techArray,
      features: featuresArray,
      github,
      demo,
      badge: badge || undefined,
      featured,
      published,
      results,
      architecture,
      order: editingProject ? editingProject.order : projects.length + 1,
    };

    try {
      let res;
      if (isCreating) {
        res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (editingProject) {
        res = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res && res.ok) {
        setStatusMessage({ type: 'success', text: `Project "${name}" successfully saved and published.` });
        closeModal();
        await loadProjects();
      } else {
        const errorJson = await res?.json();
        setStatusMessage({ type: 'error', text: errorJson?.error || 'Failed to save project.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred while saving project.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (project: Project) => {
    const updated = { ...project, published: !project.published };
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle project publish state:', err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const [movedItem] = newProjects.splice(index, 1);
    if (!movedItem) return;
    newProjects.splice(targetIndex, 0, movedItem);

    // Re-index order
    const updatedWithOrder = newProjects.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setProjects(updatedWithOrder);

    try {
      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedWithOrder }),
      });
    } catch (err) {
      console.error('Failed to update project order:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Section 02 CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Project &amp; Case Study Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Create, edit, reorder, draft, and publish projects. Changes appear automatically on the public portfolio.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          Add New Project
        </Button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-[#CFDBC5]/30 border-[#CFDBC5]/80 text-[#21351C] dark:text-[#CFDBC5]'
              : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 text-body-sm font-medium">
            {statusMessage.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Projects List Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-normal text-text-primary">
            Ordered Projects List ({projects.length})
          </h2>
          <span className="text-caption font-mono text-text-tertiary">
            Use arrows to reorder display sequence (01, 02, 03...)
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center font-mono text-text-secondary">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-text-secondary font-sans">
            No projects found. Click "Add New Project" above to create one.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="flex items-start gap-4">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      disabled={index === 0}
                      onClick={() => moveOrder(index, 'up')}
                      className="p-1 rounded-lg hover:bg-background-secondary text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={index === projects.length - 1}
                      onClick={() => moveOrder(index, 'down')}
                      className="p-1 rounded-lg hover:bg-background-secondary text-text-tertiary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Position Pill */}
                  <span className="w-8 h-8 rounded-xl bg-accent-light text-accent text-body-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    0{index + 1}
                  </span>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-xl font-normal text-text-primary">{project.name}</h3>
                      {project.published ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#CFDBC5]/40 text-[#21351C] dark:text-[#CFDBC5] text-[11px] font-mono font-medium border border-[#CFDBC5]">
                          Published
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[11px] font-mono font-medium border border-amber-300">
                          Draft (Hidden)
                        </span>
                      )}
                      {project.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D8BFD8]/40 text-[#3C223C] dark:text-[#E2CBE4] text-[11px] font-medium border border-[#D8BFD8]">
                          {project.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-body-xs font-mono text-accent">{project.tagline}</p>
                    <p className="text-body-sm text-text-secondary line-clamp-1 max-w-2xl font-sans">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-background-secondary border border-border text-[10px] font-mono text-text-secondary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish(project)}
                    title={project.published ? 'Unpublish to draft' : 'Publish to live site'}
                  >
                    {project.published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        Publish
                      </>
                    )}
                  </Button>

                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/case-studies/${project.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </a>
                  </Button>

                  <Button variant="secondary" size="sm" onClick={() => openEditModal(project)}>
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>

                  {deleteConfirmId === project.id ? (
                    <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950 p-1 rounded-xl border border-red-200">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white text-[11px] px-2"
                        onClick={() => handleDelete(project.id)}
                      >
                        Confirm Delete
                      </Button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-text-secondary hover:text-text-primary text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={() => setDeleteConfirmId(project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL DRAWER */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="my-8 max-w-3xl w-full bg-background-primary border border-border rounded-3xl shadow-card overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-normal text-text-primary">
                  {isCreating ? 'Add New Project' : `Edit "${editingProject?.name}"`}
                </h3>
                <p className="text-body-xs text-text-secondary mt-0.5">
                  Populates the public editorial cards and dedicated case study page.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl bg-background-secondary border border-border text-text-secondary hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              {/* Basic Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Smart Civic System"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Slug ID (URL path) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. smart-civic-system"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Real-Time Distributed Sensor Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Category Eyebrow
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Distributed Systems & AI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>
              </div>

              {/* Summary description */}
              <div className="space-y-1">
                <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                  Short Editorial Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview paragraph for card..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                />
              </div>

              {/* Problem & Solution block */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    The Problem
                  </label>
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What challenge does this solve?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    The Solution
                  </label>
                  <textarea
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="How does your architecture solve it?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>
              </div>

              {/* Engineering Challenges & Impact */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Engineering Challenges (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Low latency inference under load&#10;Ensuring data isolation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Impact &amp; Metric Description
                  </label>
                  <textarea
                    rows={3}
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="e.g. Achieved 94.8% detection accuracy, earning Top 5 Hackathon placement."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>
              </div>

              {/* Tech Stack & Features */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Technologies (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                    placeholder="Python, FastAPI, Next.js, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="AI Symptom Checker&#10;Real-time Notifications&#10;Resource Dashboard"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>
              </div>

              {/* Links & Badges */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={demo}
                    onChange={(e) => setDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-body-xs font-mono font-semibold text-text-secondary">
                    Badge Pill (Optional)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Top 5 National Hackathon Finalist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border text-body-sm font-sans"
                  />
                </div>
              </div>

              {/* Results & Validations Array */}
              <div className="p-4 rounded-2xl bg-background-secondary/60 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-xs font-mono font-bold text-text-primary">
                    Case Study Key Results &amp; Metrics
                  </span>
                  <button
                    type="button"
                    onClick={() => setResults([...results, { metric: '100%', label: 'Label' }])}
                    className="text-caption text-accent hover:underline font-mono"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {results.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={r.metric}
                        onChange={(e) => {
                          const copy = [...results];
                          if (copy[idx]) copy[idx].metric = e.target.value;
                          setResults(copy);
                        }}
                        placeholder="e.g. 94.8%"
                        className="w-28 px-3 py-1.5 rounded-lg bg-background-primary border border-border text-body-xs font-mono"
                      />
                      <input
                        type="text"
                        value={r.label}
                        onChange={(e) => {
                          const copy = [...results];
                          if (copy[idx]) copy[idx].label = e.target.value;
                          setResults(copy);
                        }}
                        placeholder="e.g. Overall Detection Accuracy"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-background-primary border border-border text-body-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setResults(results.filter((_, i) => i !== idx))}
                        className="p-1.5 text-text-tertiary hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish State Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-accent"
                  />
                  <span className="text-body-sm text-text-primary font-medium">Published on Public Portfolio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-accent"
                  />
                  <span className="text-body-sm text-text-primary font-medium">Featured Status</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={saving} icon={<Save className="h-4 w-4" />}>
                  {isCreating ? 'Create & Publish Project' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
