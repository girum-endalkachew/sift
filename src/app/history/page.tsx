'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { Dump, Item } from '@/types';
import { History as HistoryIcon, ScrollText, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const [dumps, setDumps] = useState<Dump[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedRaw, setSelectedRaw] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dumps')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDumps(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const openDump = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/dumps/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedRaw(data.data.dump.rawText);
        setSelectedItems(data.data.items);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
            <HistoryIcon className="w-4 h-4 text-primary" />
            <span>Memory trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Dump History</h1>
          <p className="text-xs sm:text-sm text-muted">
            Original messy text stays here. Structured items stay linked.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {loading && (
              <div className="glass-panel rounded-2xl p-8 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            )}

            {!loading && dumps.length === 0 && (
              <div className="glass-panel rounded-2xl p-8 text-center">
                <ScrollText className="w-7 h-7 text-primary/50 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">No dumps yet</p>
                <p className="text-xs text-muted mt-1">Sift something from Workspace to build history.</p>
              </div>
            )}

            {dumps.map((d) => (
              <button
                key={d.id}
                onClick={() => openDump(d.id)}
                className={cn(
                  'w-full text-left glass-card rounded-xl p-4 transition',
                  selectedId === d.id ? 'border-accent ring-1 ring-accent/30' : ''
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                    {d.rawText}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted font-mono">
                  <span>{new Date(d.createdAt).toLocaleString()}</span>
                  <span>·</span>
                  <span>{d.itemCount} items</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {!selectedId && (
              <div className="glass-panel rounded-2xl p-10 text-center h-full min-h-[240px] flex flex-col items-center justify-center">
                <HistoryIcon className="w-8 h-8 text-primary/40 mb-3" />
                <p className="text-sm text-muted">Select a dump to inspect the original text and resulting items.</p>
              </div>
            )}

            {selectedId && (
              <div className="space-y-4">
                <CollapsibleSection title="Original dump" icon={ScrollText} defaultOpen framed>
                  {detailLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedRaw}
                    </p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Structured items"
                  count={selectedItems.length}
                  defaultOpen
                >
                  {detailLoading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
                  {!detailLoading && selectedItems.length === 0 && (
                    <p className="text-xs text-muted">No linked items found.</p>
                  )}
                  {!detailLoading &&
                    selectedItems.map((item) => (
                      <div key={item.id} className="glass-card rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          <p className="text-[10px] text-muted font-mono mt-0.5">
                            {item.type} · {item.status} · {item.priority}
                          </p>
                        </div>
                      </div>
                    ))}
                </CollapsibleSection>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}