'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ItemCard } from '@/components/tasks/ItemCard';
import { HeroInput } from '@/components/inbox/HeroInput';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { Item } from '@/types';
import { Inbox as InboxIcon, CheckCheck } from 'lucide-react';

export default function InboxPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/items?status=INBOX');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to load inbox items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'DONE' ? 'INBOX' : 'DONE';
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: nextStatus as any } : i)));
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
  };

  const handleUpdate = (id: string, updatedData: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updatedData } : i)));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
            <InboxIcon className="w-4 h-4 text-primary" />
            <span>Unprocessed stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Inbox</h1>
          <p className="text-xs sm:text-sm text-muted">Raw captured ideas and unscheduled items.</p>
        </header>

        <HeroInput onItemAdded={fetchInbox} />

        <CollapsibleSection title="Inbox items" count={items.length} icon={InboxIcon} defaultOpen>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
          {!loading && items.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl p-6">
              <CheckCheck className="w-7 h-7 text-primary/60 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Inbox is clear</p>
            </div>
          )}
        </CollapsibleSection>
      </main>
    </div>
  );
}