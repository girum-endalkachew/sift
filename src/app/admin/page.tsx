'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { 
  ShieldCheck, 
  MessageSquare, 
  Trash2, 
  Loader2, 
  User, 
  Mail, 
  Clock, 
  Search,
  Sparkles
} from 'lucide-react';

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
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.data);
      }
    } catch (err) {
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id: string) => {
    setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
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
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              User Feedback & Ideas
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Read suggestions, bug reports, and messages submitted by users.
            </p>
          </div>

          <div className="glass-card px-3 py-1.5 rounded-xl border border-border text-xs text-muted font-mono flex items-center gap-2 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{feedbackList.length} Total Submissions</span>
          </div>
        </header>

        {/* Search */}
        <div className="glass-input rounded-xl px-3.5 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback by keyword, user name, or email..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
          />
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
            <p className="text-xs text-muted">Loading user feedback...</p>
          </div>
        ) : (
          <CollapsibleSection title="Submissions" count={filtered.length} icon={MessageSquare} defaultOpen>
            {filtered.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-primary/40 mx-auto" />
                <p className="text-sm font-semibold text-foreground">No feedback matches</p>
                <p className="text-xs text-muted">When visitors or users send feedback, it will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const senderName = item.userName || 'Anonymous Visitor';
                  const senderEmail = item.email || item.userEmail || 'No email provided';

                  return (
                    <div
                      key={item.id}
                      className="glass-card rounded-xl p-4 sm:p-5 space-y-3 border border-border hover:border-accent/40 transition"
                    >
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

                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
                            <Clock className="w-3 h-3 text-accent" />
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                          </div>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-muted hover:text-rose-500 hover:bg-surface rounded-lg transition"
                            title="Delete submission"
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