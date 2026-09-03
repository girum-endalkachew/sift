'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeroInput } from '@/components/inbox/HeroInput';
import { ItemCard } from '@/components/tasks/ItemCard';
import { Item } from '@/types';
import { CheckCheck, Inbox, Calendar, Layers } from 'lucide-react';

export default function WorkspacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    
    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus as any } : i))
    );

    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((i) => i.id !== id));

    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
  };

  // Group items by timeframe / category
  const groups = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();

    const todayItems: Item[] = [];
    const tomorrowItems: Item[] = [];
    const upcomingItems: Item[] = [];
    const inboxItems: Item[] = [];

    items.forEach((item) => {
      if (!item.dueDate) {
        inboxItems.push(item);
        return;
      }

      const itemDate = new Date(item.dueDate);
      const itemDateStr = itemDate.toDateString();

      if (itemDateStr === todayStr) {
        todayItems.push(item);
      } else if (itemDateStr === tomorrowStr) {
        tomorrowItems.push(item);
      } else {
        upcomingItems.push(item);
      }
    });

    return { todayItems, tomorrowItems, upcomingItems, inboxItems };
  }, [items]);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 space-y-9">
        {/* Calm Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-dark">
            Good afternoon, Girum.
          </h1>
          <p className="text-sm text-muted">
            Let's clear your head. Dump your thoughts below and Sift will organize them.
          </p>
        </header>

        {/* Hero Input Box */}
        <section>
          <HeroInput onItemAdded={fetchItems} />
        </section>

        {/* Organized Items Stream */}
        <div className="space-y-8 pb-16">
          {/* Section: Today */}
          {groups.todayItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today</span>
                <span className="text-muted font-normal">({groups.todayItems.length})</span>
              </div>
              <div className="space-y-2">
                {groups.todayItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section: Tomorrow */}
          {groups.tomorrowItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy">
                <Calendar className="w-3.5 h-3.5 text-muted" />
                <span>Tomorrow</span>
                <span className="text-muted font-normal">({groups.tomorrowItems.length})</span>
              </div>
              <div className="space-y-2">
                {groups.tomorrowItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section: Upcoming */}
          {groups.upcomingItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy">
                <Layers className="w-3.5 h-3.5 text-muted" />
                <span>Upcoming</span>
                <span className="text-muted font-normal">({groups.upcomingItems.length})</span>
              </div>
              <div className="space-y-2">
                {groups.upcomingItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section: General Inbox / Ideas */}
          {groups.inboxItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy">
                <Inbox className="w-3.5 h-3.5 text-muted" />
                <span>Inbox & Ideas</span>
                <span className="text-muted font-normal">({groups.inboxItems.length})</span>
              </div>
              <div className="space-y-2">
                {groups.inboxItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <div className="text-center py-16 border border-dashed border-rose-soft/60 rounded-2xl p-8 bg-blush/20">
              <CheckCheck className="w-8 h-8 text-burgundy/50 mx-auto mb-2.5" />
              <p className="text-sm font-medium text-text-dark">Your mind is clear</p>
              <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                Type any task, meeting, or random idea into the box above to sift it into your workspace.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
