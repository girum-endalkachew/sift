'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface HeroInputProps {
  onItemAdded?: () => void;
}

export function HeroInput({ onItemAdded }: HeroInputProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setErrorMsg(null);

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
      } else {
        setErrorMsg(data.error || 'Failed to sift text. Your text was preserved.');
      }
    } catch (err) {
      console.error('Error sifting text:', err);
      setErrorMsg('Network drop detected. Your text was preserved below.');
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
    <div className="w-full glass-input rounded-2xl p-5 shadow-2xl transition-all space-y-3">
      <div className="flex items-center justify-between text-xs text-[#B7A8D9]">
        <span className="flex items-center gap-2 font-medium text-[#D2C3F6]">
          <Sparkles className="w-4 h-4 text-[#D2C3F6]" />
          Dump messy thoughts
        </span>
        <span className="hidden sm:inline">Press <kbd className="bg-[#1B1430]/80 text-[#D2C3F6] px-2 py-0.5 rounded border border-[#D2C3F6]/20 text-[10px] font-mono">Enter ↵</kbd> to sift</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Finish ACA landing page tonight, meeting with coach tomorrow at 4, remind me to send the proposal, exam Friday..."
        rows={3}
        className="w-full bg-transparent resize-none border-0 p-0 text-[#F3EEFF] placeholder:text-[#B7A8D9]/40 text-base focus:ring-0 focus:outline-none leading-relaxed"
      />

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#D2C3F6]/15">
        <span className="text-[11px] text-[#B7A8D9] bg-white/5 px-2.5 py-1 rounded-lg border border-[#D2C3F6]/15">
          Auto-categorizes Tasks, Events & Ideas
        </span>

        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 bg-[#D2C3F6] hover:bg-[#F3EEFF] text-[#24183F] font-semibold disabled:opacity-30 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl text-xs transition duration-200 shadow-[0_0_20px_rgba(210,195,246,0.25)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#24183F]" />
              <span>Sifting...</span>
            </>
          ) : (
            <>
              <span>Sift Thoughts</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#24183F]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}