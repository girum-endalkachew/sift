'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, X, Pin, Pencil, History, Search } from 'lucide-react';

const STEPS = [
  {
    title: 'Dump messy thoughts',
    body: 'Type anything in the box — tasks, meetings, ideas — then press Enter or Sift.',
    icon: Sparkles,
  },
  {
    title: 'Correct anytime',
    body: 'Hover an item and click the pencil to fix title, type, priority, or date.',
    icon: Pencil,
  },
  {
    title: 'Pin your Focus',
    body: 'Use the pin icon to keep  the most important items in Current Focus.',
    icon: Pin,
  },
  {
    title: 'Search instantly',
    body: 'Press Ctrl/Cmd + K or use Search to find anything in your workspace.',
    icon: Search,
  },
  {
    title: 'Raw history stays',
    body: 'Every dump is saved in History so you never lose the original messy text.',
    icon: History,
  },
];

export function ProductTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('sift_tour_seen');
    if (!seen) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem('sift_tour_seen', 'true');
    setOpen(false);
  };

  const next = () => {
    if (step >= STEPS.length - 1) close();
    else setStep((s) => s + 1);
  };

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 border border-border shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-border flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent font-mono">
                Tour {step + 1}/{STEPS.length}
              </p>
              <h3 className="text-base font-bold text-foreground">{current.title}</h3>
            </div>
          </div>
          <button onClick={close} className="p-1 text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted leading-relaxed">{current.body}</p>

        <div className="flex items-center justify-between pt-2">
          <button onClick={close} className="text-xs text-muted hover:text-foreground px-2 py-1.5">
            Skip
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1.5 bg-primary text-inverse font-semibold text-xs px-4 py-2 rounded-xl"
          >
            <span>{step >= STEPS.length - 1 ? 'Start using Sift' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}