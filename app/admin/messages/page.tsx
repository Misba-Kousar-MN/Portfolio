'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Mail,
  Clock,
  CheckCircle2,
  Archive,
  Trash2,
  Copy,
  Check,
  Reply,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import type { ContactMessage, MessageStatus, MessageStats } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [activeFilter, setActiveFilter] = useState<MessageStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // UX Feedback
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, [activeFilter, sortBy]);

  async function loadMessages() {
    setLoading(true);
    try {
      const url = new URL('/api/admin/messages', window.location.origin);
      if (activeFilter !== 'ALL') {
        url.searchParams.set('status', activeFilter);
      }
      if (searchQuery.trim()) {
        url.searchParams.set('search', searchQuery.trim());
      }
      url.searchParams.set('sort', sortBy);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setStats(data.stats || { total: 0, unread: 0, thisWeek: 0 });

        // Update selected message if open
        if (selectedMessage) {
          const fresh = (data.messages as ContactMessage[]).find((m) => m.id === selectedMessage.id);
          if (fresh) setSelectedMessage(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMessages();
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setDeleteConfirmId(null);

    // If unread, automatically mark as read
    if (msg.status === 'UNREAD') {
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READ' }),
        });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'READ' } : m))
          );
          setStats((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
          setSelectedMessage({ ...msg, status: 'READ' });
        }
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setStatusNotification(`Message marked as ${newStatus.toLowerCase()}.`);
        setTimeout(() => setStatusNotification(null), 3000);
        await loadMessages();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
        setStatusNotification('Message deleted successfully.');
        setTimeout(() => setStatusNotification(null), 3000);
        await loadMessages();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-mono uppercase tracking-wider text-accent">Contact Responses CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight flex items-center gap-3">
            <span>Inquiry Inbox</span>
            {stats.unread > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD1DC] text-[#4A2E35] text-caption font-mono font-bold border border-[#FFD1DC]/80">
                {stats.unread} Unread
              </span>
            )}
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Review, organize, and reply to client inquiries, recruiter proposals, and collaboration requests.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 font-mono text-caption">
          <div className="px-3 py-1.5 rounded-xl bg-background-primary border border-border">
            <span className="text-text-tertiary">Total:</span>{' '}
            <span className="font-bold text-text-primary">{stats.total}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-background-primary border border-border">
            <span className="text-text-tertiary">This Week:</span>{' '}
            <span className="font-bold text-text-primary">{stats.thisWeek}</span>
          </div>
        </div>
      </div>

      {statusNotification && (
        <div className="p-4 rounded-2xl bg-[#CFDBC5]/30 border border-[#CFDBC5]/80 text-[#21351C] dark:text-[#CFDBC5] flex items-center justify-between text-body-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{statusNotification}</span>
          </div>
          <button onClick={() => setStatusNotification(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search, Filters & Message List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Bar & Sort */}
          <div className="space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, subject, or message..."
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-background-primary border border-border text-body-xs font-sans focus:border-accent outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setTimeout(loadMessages, 50);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Filter Tabs & Sort Toggle */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-background-primary border border-border">
                {(['ALL', 'UNREAD', 'READ', 'ARCHIVED'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                      activeFilter === tab
                        ? 'bg-accent text-white shadow-2xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                    }`}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-background-primary border border-border text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                title="Toggle sort order"
              >
                <ArrowUpDown className="h-3 w-3" />
                <span>{sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>
          </div>

          {/* List of Messages */}
          <div className="rounded-3xl bg-background-primary border border-border shadow-subtle overflow-hidden divide-y divide-border max-h-[680px] overflow-y-auto">
            {loading ? (
              <div className="py-16 text-center text-caption font-mono text-text-tertiary">
                Loading inquiries...
              </div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-text-secondary space-y-2 p-6">
                <Inbox className="h-8 w-8 mx-auto text-text-tertiary" />
                <p className="font-serif text-lg text-text-primary">No responses found</p>
                <p className="text-body-xs text-text-secondary">
                  {searchQuery
                    ? `No messages matched "${searchQuery}".`
                    : `No messages in the ${activeFilter.toLowerCase()} tab.`}
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'UNREAD';

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer transition-colors text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-[#D8BFD8]/20 dark:bg-[#D8BFD8]/10'
                        : isUnread
                        ? 'bg-background-secondary/70 hover:bg-background-secondary'
                        : 'hover:bg-background-secondary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        )}
                        <span
                          className={`text-body-sm truncate ${
                            isUnread ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'
                          }`}
                        >
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div
                      className={`text-body-xs line-clamp-1 ${
                        isUnread ? 'font-semibold text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {msg.subject}
                    </div>

                    <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed font-sans">
                      {msg.message}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-text-tertiary truncate max-w-[200px]">
                        {msg.email}
                      </span>
                      {msg.status === 'ARCHIVED' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Detail View */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-background-primary border border-border shadow-subtle space-y-6 text-left">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-mono uppercase tracking-wider text-accent font-semibold">
                      Subject
                    </span>
                    {selectedMessage.status === 'UNREAD' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FFD1DC] text-[#4A2E35] text-[10px] font-mono font-bold">
                        Unread
                      </span>
                    )}
                    {selectedMessage.status === 'ARCHIVED' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono">
                        Archived
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl font-normal text-text-primary leading-snug">
                    {selectedMessage.subject}
                  </h2>
                </div>

                {/* Status Toggles & Delete */}
                <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
                  {selectedMessage.status === 'READ' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'UNREAD')}
                      title="Mark as unread"
                    >
                      <EyeOff className="h-3.5 w-3.5 mr-1" />
                      Mark Unread
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                      title="Mark as read"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Mark Read
                    </Button>
                  )}

                  {selectedMessage.status === 'ARCHIVED' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                      title="Unarchive message"
                    >
                      <Archive className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Unarchive
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'ARCHIVED')}
                      title="Archive message"
                    >
                      <Archive className="h-3.5 w-3.5 mr-1" />
                      Archive
                    </Button>
                  )}

                  {deleteConfirmId === selectedMessage.id ? (
                    <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950 p-1 rounded-xl border border-red-200">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white text-[11px] px-2 py-1"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        Confirm
                      </Button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-text-secondary text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteConfirmId(selectedMessage.id)}
                      title="Delete message"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Sender Info Bar */}
              <div className="p-4 rounded-2xl bg-background-secondary/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-body-sm font-semibold text-text-primary">
                    {selectedMessage.name}
                  </div>
                  <div className="flex items-center gap-2 text-body-xs font-mono text-text-secondary">
                    <span>{selectedMessage.email}</span>
                    <button
                      type="button"
                      onClick={() => copyEmailToClipboard(selectedMessage.email)}
                      className="inline-flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent cursor-pointer"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>

                  {/* Reply Action Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Reply className="h-3.5 w-3.5" />}
                    asChild
                  >
                    <a
                      href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                        `Re: ${selectedMessage.subject}`
                      )}`}
                    >
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Message Body Content */}
              <div className="space-y-2">
                <div className="text-caption font-mono uppercase tracking-wider text-text-tertiary">
                  Message Content
                </div>
                <div className="p-6 rounded-2xl bg-background-secondary/40 border border-border whitespace-pre-wrap text-body font-sans text-text-primary leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-background-primary border border-border shadow-subtle text-center space-y-3">
              <Mail className="h-10 w-10 mx-auto text-text-tertiary" />
              <h3 className="font-serif text-xl font-normal text-text-primary">
                Select an inquiry to view details
              </h3>
              <p className="text-body-xs text-text-secondary max-w-sm mx-auto">
                Choose a message from the list on the left to read the full body, copy email address, or dispatch a direct reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
