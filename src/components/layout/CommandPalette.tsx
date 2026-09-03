'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, CheckCircle2, Calendar, Lightbulb, Bell, FileText, Tag, Loader2, ArrowRight } from 'lucide-react';
import { Item, ItemType } from '@/types';
import { cn, formatDateLabel } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const typeIcons: Record<ItemType, React.ElementType> = {
  TASK: CheckCircle2,
  EVENT: Calendar,
  REMINDER: Bell,
  IDEA: Lightbulb,
  NOTE: FileText,
  REFERENCE: Tag,
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'TASK', label: 'Tasks' },
  { key: 'EVENT', label: 'Events' },
  { key: 'IDEA', label: 'Ideas' },
  { key: 'REMINDER', label: 'Reminders' },
  { key: 'NOTE', label: 'Notes' },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const runSearch = useCallback(async (q: string, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (type && type !== 'all') params.set('type', type);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setSelectedIndex(0);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => runSearch(query, typeFilter), 180);
    return () => clearTimeout(t);
  }, [query, typeFilter, open, runSearch]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setTypeFilter('all');
      setTimeout(() => inputRef.current?.focus(), 50);
      runSearch('', 'all');
    }
  }, [open, runSearch]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, selectedIndex, onClose]);

  const handleSelect = (item: Item) => {
    onClose();
    // Navigate based on type
    if (item.type === 'TASK') router.push('/tasks');
    else if (item.type === 'EVENT' || item.type === 'REMINDER') router.push('/schedule');
    else router.push('/inbox');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette panel */}
      <div className="relative w-full max-w-xl glass-panel rounded-2xl shadow-2xl overflow-hidden border border-border/25 animate-in fade-in zoom-in-95 duration-150">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/15">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, events, ideas..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-accent animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border/10 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap',
                typeFilter === f.key
                  ? 'bg-primary text-inverse'
                  : 'text-muted hover:text-foreground hover:bg-surface/80'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && !loading && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-muted">
                {query ? 'No matching items' : 'Start typing to search your workspace'}
              </p>
            </div>
          )}

          {results.map((item, idx) => {
            const Icon = typeIcons[item.type as ItemType] || FileText;
            const isSelected = idx === selectedIndex;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition',
                  isSelected ? 'bg-primary/10' : 'hover:bg-surface/50'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  isSelected ? 'bg-primary/20' : 'bg-surface/80'
                )}>
                  <Icon className="w-3.5 h-3.5 text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    item.status === 'DONE' ? 'line-through text-muted' : 'text-foreground'
                  )}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wide">
                      {item.type}
                    </span>
                    {item.dueDate && (
                      <span className="text-[10px] text-muted">
                        {formatDateLabel(item.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/10 text-[10px] text-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-surface border border-border/20 font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-surface border border-border/20 font-mono">↵</kbd> open</span>
            <span><kbd className="px-1 py-0.5 rounded bg-surface border border-border/20 font-mono">esc</kbd> close</span>
          </div>
          <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}