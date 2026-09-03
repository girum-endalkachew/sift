'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Loader2 } from 'lucide-react';

interface HeroInputProps {
  onItemAdded?: () => void;
}

export function HeroInput({ onItemAdded }: HeroInputProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/sift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, autoSave: true }),
      });

      const data = await res.json();
      if (data.success) {
        setText('');
        if (onItemAdded) {
          onItemAdded();
        }
      }
    } catch (err) {
      console.error('Error sifting text:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-blush/80 border border-rose-soft/60 rounded-2xl p-5 shadow-sm transition-all focus-within:border-burgundy/40 focus-within:shadow-md">
      <div className="flex items-center justify-between mb-3 text-xs text-muted">
        <span className="flex items-center gap-1.5 font-medium text-text-dark/80">
          <Sparkles className="w-3.5 h-3.5 text-burgundy" />
          Dump messy thoughts
        </span>
        <span>Press <kbd className="bg-canvas px-1.5 py-0.5 rounded border border-rose-soft/60 text-[10px] text-text-dark font-mono">Enter ?</kbd> to sift</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Finish ACA landing page tonight, meeting with coach tomorrow at 4, remind me to send the proposal, exam Friday..."
        rows={3}
        className="w-full bg-transparent resize-none border-0 p-0 text-text-dark placeholder:text-muted/60 text-base focus:ring-0 focus:outline-none leading-relaxed"
      />

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-rose-soft/40">
        <div className="flex gap-2">
          <span className="text-[11px] text-muted bg-canvas/60 px-2 py-0.5 rounded-md border border-rose-soft/40">
            Auto-categorizes Tasks, Events, & Reminders
          </span>
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || loading}
          className="flex items-center gap-1.5 bg-burgundy hover:bg-burgundy-dark text-canvas disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-xs font-medium transition duration-150 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sifting...</span>
            </>
          ) : (
            <>
              <span>Sift Thoughts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
