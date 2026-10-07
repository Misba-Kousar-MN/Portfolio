'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Download, Check, AlertCircle, X, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import type { ResumeMetadata } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminResumePage() {
  const [resume, setResume] = useState<ResumeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResumeMetadata();
  }, []);

  async function loadResumeMetadata() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setResume(data.resume);
      }
    } catch (err) {
      console.error('Failed to load resume metadata:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setStatusMessage({ type: 'error', text: 'Invalid file format. Please upload a valid .pdf document.' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Resume PDF "${file.name}" uploaded successfully! All public buttons are now pointing to this latest file.`,
        });
        setResume(json.resume);
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Failed to upload resume PDF.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred during PDF upload.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Document CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Resume PDF Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Upload and replace your formal PDF resume. The public "Download Resume" buttons will automatically deliver this active file.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Upload className="h-4 w-4" />}
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Replacement PDF
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-[#CFDBC5]/30 border-[#CFDBC5]/80 text-[#21351C] dark:text-[#CFDBC5]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2 text-body-sm font-medium">
            {statusMessage.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Current Active Resume Card */}
      <div className="p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E0F7FA]/50 border border-[#E0F7FA] text-[#143B41] dark:text-[#B2EBF2] flex items-center justify-center flex-shrink-0">
              <FileText className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  Active Published Resume
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-text-primary">
                {resume?.fileName || 'Misba_Kousar_Resume.pdf'}
              </h3>
              <p className="text-body-xs font-mono text-text-tertiary">
                Direct Path: {resume?.url || '/resume.pdf'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />} asChild>
              <a href={resume?.url || '/resume.pdf'} download={resume?.fileName || 'resume.pdf'}>
                Download PDF
              </a>
            </Button>
            <Button variant="ghost" size="md" icon={<ExternalLink className="h-4 w-4" />} asChild>
              <a href={resume?.url || '/resume.pdf'} target="_blank" rel="noopener noreferrer">
                Open in Tab
              </a>
            </Button>
          </div>
        </div>

        {/* Metadata stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-background-secondary/60 border border-border">
            <HardDrive className="h-5 w-5 text-accent" />
            <div>
              <div className="text-caption font-mono text-text-tertiary">File Size</div>
              <div className="text-body-sm font-semibold text-text-primary">
                {formatBytes(resume?.fileSize || 0)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-background-secondary/60 border border-border">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <div className="text-caption font-mono text-text-tertiary">Last Updated</div>
              <div className="text-body-sm font-semibold text-text-primary">
                {resume?.updatedAt ? new Date(resume.updatedAt).toLocaleString() : 'Recently'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-12 rounded-3xl border-2 border-dashed border-border hover:border-accent hover:bg-background-secondary/40 transition-all duration-200 text-center cursor-pointer space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent border border-accent/20 mx-auto flex items-center justify-center">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-serif text-xl font-normal text-text-primary">
            Drop new PDF resume here or click to browse
          </h4>
          <p className="text-body-xs text-text-secondary mt-1">
            Accepts PDF binaries up to 15MB. Server verifies magic header (%PDF-) before publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
