'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.replace('/admin');
    } catch {
      setError('A network error occurred while attempting to sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D6EFF8] dark:bg-[#0E1822] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-8 sm:p-10 rounded-3xl bg-background-primary/95 backdrop-blur-md border border-border shadow-card space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-accent-light text-accent border border-accent/20 mx-auto flex items-center justify-center shadow-subtle">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD1DC]/40 text-[#452D34] dark:text-[#FFD1DC] text-caption font-medium border border-[#FFD1DC]/80 mb-2">
                <Sparkles className="h-3 w-3 text-accent" />
                Portfolio Administration
              </span>
              <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight">
                Private Admin Login
              </h1>
              <p className="text-body-sm text-text-secondary mt-1">
                Authorized access only for Misba Kousar MN
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-body-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-body-xs font-mono font-medium text-text-secondary">
                Administrator Username
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-body-sm font-sans"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-body-xs font-mono font-medium text-text-secondary">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-body-sm font-sans"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                className="w-full rounded-xl"
              >
                Authenticate &amp; Enter CMS
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-border/80 text-center">
            <p className="text-[11px] font-mono text-text-tertiary">
              Sessions are cryptographically signed with HMAC-SHA256. All mutations are validated on the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
