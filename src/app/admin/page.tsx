'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MessageSquare,
  Trash2,
  Loader2,
  User,
  Mail,
  Clock,
  Search,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';

interface FeedbackItem {
  id: string;
  message: string;
  email: string | null;
  createdAt: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          router.replace('/admin/login');
          return;
        }
        setAdminEmail(data.admin.email);
      });

    fetch('/api/feedback')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFeedbackList(data.data);
        else if (data.error === 'Admin only') router.replace('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const filtered = feedbackList.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.message.toLowerCase().includes(q) ||
      (f.email && f.email.toLowerCase().includes(q)) ||
      (f.userName && f.userName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Sift Admin</p>
              <p className="text-[11px] text-muted">{adminEmail || '...'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground glass-card px-3 py-2 rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              User Feedback & Ideas
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Only you can see this. Regular users have no admin access.
            </p>
          </div>
          <div className="glass-card px-3 py-1.5 rounded-xl border border-border text-xs text-muted font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{feedbackList.length} submissions</span>
          </div>
        </header>

        <div className="glass-input rounded-xl px-3.5 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by message, name, or email..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
            <p className="text-xs text-muted">Loading feedback...</p>
          </div>
        ) : (
          <CollapsibleSection title="Submissions" count={filtered.length} icon={MessageSquare} defaultOpen>
            {filtered.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-primary/40 mx-auto" />
                <p className="text-sm font-semibold text-foreground">No feedback yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const senderName = item.userName || 'Anonymous Visitor';
                  const senderEmail = item.email || item.userEmail || 'No email provided';
                  return (
                    <div key={item.id} className="glass-card rounded-xl p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/20 pb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <User className="w-3.5 h-3.5 text-accent" />
                            <span>{senderName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Mail className="w-3.5 h-3.5 text-accent" />
                            <span>{senderEmail}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
                            <Clock className="w-3 h-3 text-accent" />
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-muted hover:text-rose-500 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CollapsibleSection>
        )}
      </main>
    </div>
  );
}