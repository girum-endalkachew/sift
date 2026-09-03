'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ItemCard } from '@/components/tasks/ItemCard';
import { HeroInput } from '@/components/inbox/HeroInput';
import { Item } from '@/types';
import { Inbox as InboxIcon, CheckCheck } from 'lucide-react';

export default function InboxPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/items?status=INBOX');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to load inbox items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 space-y-8">
        <header className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
            <InboxIcon className="w-4 h-4 text-primary" />
            <span>Unprocessed Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Inbox</h1>
          <p className="text-sm text-muted">
            Raw captured ideas, notes, and unscheduled items awaiting action.
          </p>
        </header>

        <HeroInput onItemAdded={fetchInbox} />

        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}

          {!loading && items.length === 0 && (
            <div className="text-center py-16 glass-panel rounded-2xl p-8">
              <CheckCheck className="w-8 h-8 text-primary/60 mx-auto mb-2.5" />
              <p className="text-sm font-semibold text-foreground">Inbox is completely clear</p>
              <p className="text-xs text-muted mt-1">All messy thoughts have been sifted or scheduled.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}