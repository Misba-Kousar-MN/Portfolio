'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Award,
  Sparkles,
  History,
  User,
  Compass,
  Mail,
  FileText,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: 'unreadMessages';
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Messages', href: '/admin/messages', icon: Inbox, badgeKey: 'unreadMessages' },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Achievements', href: '/admin/achievements', icon: Award },
  { label: 'Skills', href: '/admin/skills', icon: Sparkles },
  { label: 'Timeline', href: '/admin/timeline', icon: History },
  { label: 'About / Bio', href: '/admin/about', icon: User },
  { label: 'Hero / Profile', href: '/admin/hero', icon: Compass },
  { label: 'Contact & Socials', href: '/admin/contact', icon: Mail },
  { label: 'Resume PDF', href: '/admin/resume', icon: FileText },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.replace('/admin/login');
        } else {
          setIsCheckingAuth(false);
          loadUnreadStats();
        }
      } catch {
        router.replace('/admin/login');
      }
    }

    async function loadUnreadStats() {
      try {
        const res = await fetch('/api/admin/messages/stats');
        if (res.ok) {
          const stats = await res.json();
          setUnreadCount(stats.unread || 0);
        }
      } catch {
        // non-blocking
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
    } catch {
      router.replace('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#E8F6FC] dark:bg-[#111F2C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#7E688E] border-t-transparent animate-spin" />
          <span className="text-body-sm text-text-secondary font-mono">Verifying admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6EFF8] dark:bg-[#0E1822] text-text-primary flex">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background-primary/95 backdrop-blur-md border-b border-border z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-accent-light text-accent border border-accent/20 flex items-center justify-center font-serif font-bold text-base">
            MK
          </span>
          <span className="font-serif font-semibold text-body">Admin CMS</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-background-secondary border border-border text-text-secondary hover:text-text-primary"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background-primary border-r border-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-accent-light text-accent border border-accent/20 flex items-center justify-center font-serif font-bold text-lg">
                MK
              </span>
              <div>
                <div className="font-serif font-bold text-body text-text-primary leading-tight">
                  Portfolio CMS
                </div>
                <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Authenticated Admin
                </div>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const showBadge = item.badgeKey === 'unreadMessages' && unreadCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-body-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#D8BFD8]/30 dark:bg-[#D8BFD8]/20 text-accent font-semibold border border-[#D8BFD8]/50 shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-accent' : 'text-text-tertiary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {showBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFD1DC] text-[#4A2E35] text-[10px] font-mono font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-border space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-background-secondary text-text-secondary hover:text-text-primary border border-border text-caption font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Portfolio
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-caption font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}
    </div>
  );
}
