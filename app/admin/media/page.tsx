'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, Trash2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MediaItem {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Image "${file.name}" uploaded successfully.` });
        await loadMedia();
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Failed to upload image.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred during image upload.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
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
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Media CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
            Media &amp; Visual Assets
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Upload screenshots and project visual assets to reference in your case studies and project cards.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Upload className="h-4 w-4" />}
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Asset
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
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
          <span className="text-body-sm font-medium">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Media Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6">
        <h2 className="font-serif text-2xl font-normal text-text-primary">
          Uploaded Media Files ({media.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center font-mono text-text-secondary">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="py-16 text-center text-text-secondary">
            <ImageIcon className="h-10 w-10 mx-auto text-text-tertiary mb-3" />
            <p className="font-serif text-lg text-text-primary">No uploaded assets yet</p>
            <p className="text-body-xs text-text-secondary mt-1">
              Upload screenshots or project diagrams to include in your case studies.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border bg-background-secondary/60 overflow-hidden flex flex-col justify-between group"
              >
                <div className="aspect-[16/10] bg-background-tertiary relative overflow-hidden flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body-xs font-mono font-medium text-text-primary truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {formatBytes(item.size)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-tertiary truncate max-w-[180px]">
                      {item.url}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(item.url)}
                      className="text-caption px-2 py-1"
                    >
                      {copiedUrl === item.url ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Path
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
