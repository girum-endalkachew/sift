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
    <div className="w-full glass-input rounded-2xl p-6 shadow-2xl transition-all">
      <div className="flex items-center justify-between mb-3 text-xs text-[#A38F99]">
        <span className="flex items-center gap-2 font-medium text-[#D8B4BE]">
          <Sparkles className="w-4 h-4 text-[#F6E8EA]" />
          Dump messy thoughts
        </span>
        <span>Press <kbd className="bg-[#2A1117] text-[#D8B4BE] px-2 py-0.5 rounded border border-[#D8B4BE]/30 text-[10px] font-mono">Enter ↵</kbd> to sift</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Finish ACA landing page tonight, meeting with coach tomorrow at 4, remind me to send the proposal, exam Friday..."
        rows={3}
        className="w-full bg-transparent resize-none border-0 p-0 text-[#FCF8F9] placeholder:text-[#A38F99]/50 text-base focus:ring-0 focus:outline-none leading-relaxed"
      />

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#D8B4BE]/15">
        <span className="text-[11px] text-[#A38F99] bg-[#2A1117]/60 px-2.5 py-1 rounded-lg border border-[#D8B4BE]/15">
          Auto-categorizes Tasks, Events & Ideas
        </span>

        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 bg-[#F6E8EA] hover:bg-[#FCF8F9] text-[#1A0A0F] font-semibold disabled:opacity-30 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl text-xs transition duration-200 shadow-[0_0_20px_rgba(246,232,234,0.25)] hover:shadow-[0_0_25px_rgba(246,232,234,0.4)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1A0A0F]" />
              <span>Sifting...</span>
            </>
          ) : (
            <>
              <span>Sift Thoughts</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#1A0A0F]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}