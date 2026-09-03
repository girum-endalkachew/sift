'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Loader2, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setMessage('');
        setEmail('');
        setTimeout(() => {
          setSent(false);
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glass Panel */}
      <div className="relative w-full max-w-md glass-panel p-6 rounded-2xl shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-accent" />
            <h2 className="text-base font-bold text-foreground">Send Feedback or Feature Idea</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Feedback Received!</p>
            <p className="text-xs text-muted">Thank you for helping improve Sift.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">What should we improve or add?</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Love the natural language parsing! Would be awesome to see mobile voice notes next..."
                className="w-full bg-background/80 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Your Email (optional, if you want a reply)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="girum@example.com"
                className="w-full bg-background/80 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-muted hover:text-foreground transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex items-center gap-1.5 bg-primary text-inverse font-semibold px-4 py-2 rounded-xl text-xs disabled:opacity-40 transition shadow-sm"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}