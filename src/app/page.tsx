'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeroInput } from '@/components/inbox/HeroInput';
import { ItemCard } from '@/components/tasks/ItemCard';
import { ItemCardSkeleton } from '@/components/ui/Skeleton';
import { Item } from '@/types';
import { CheckCheck, Inbox, Calendar, Layers, Trash2 } from 'lucide-react';

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
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
  };

  const handleClearCompleted = async () => {
    setItems((prev) => prev.filter((i) => i.status !== 'DONE'));
    await fetch('/api/items/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'DONE' }),
    });
  };

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

  const hasDoneItems = items.some((i) => i.status === 'DONE');

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 space-y-9">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#FCF8F9]">
              Good afternoon, Girum.
            </h1>
            <p className="text-sm text-[#A38F99]">
              Let's clear your head. Dump raw thoughts below and Sift will organize them.
            </p>
          </div>

          {hasDoneItems && (
            <button
              onClick={handleClearCompleted}
              className="flex items-center gap-1.5 text-xs text-[#A38F99] hover:text-[#F6E8EA] bg-[#2A1117]/60 hover:bg-[#2A1117] border border-[#D8B4BE]/15 px-3 py-2 rounded-xl transition"
              title="Clear completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          )}
        </header>

        {/* Hero Input Box */}
        <section>
          <HeroInput onItemAdded={fetchItems} />
        </section>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            <ItemCardSkeleton />
            <ItemCardSkeleton />
            <ItemCardSkeleton />
          </div>
        )}

        {/* Organized Items Stream */}
        {!loading && (
          <div className="space-y-8 pb-16">
            {/* Today */}
            {groups.todayItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA]">
                  <Calendar className="w-3.5 h-3.5 text-[#D8B4BE]" />
                  <span>Today</span>
                  <span className="text-[#A38F99] font-normal">({groups.todayItems.length})</span>
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

            {/* Tomorrow */}
            {groups.tomorrowItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA]">
                  <Calendar className="w-3.5 h-3.5 text-[#D8B4BE]" />
                  <span>Tomorrow</span>
                  <span className="text-[#A38F99] font-normal">({groups.tomorrowItems.length})</span>
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

            {/* Upcoming */}
            {groups.upcomingItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA]">
                  <Layers className="w-3.5 h-3.5 text-[#D8B4BE]" />
                  <span>Upcoming</span>
                  <span className="text-[#A38F99] font-normal">({groups.upcomingItems.length})</span>
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

            {/* Inbox & Ideas */}
            {groups.inboxItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA]">
                  <Inbox className="w-3.5 h-3.5 text-[#D8B4BE]" />
                  <span>Inbox & Ideas</span>
                  <span className="text-[#A38F99] font-normal">({groups.inboxItems.length})</span>
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
            {items.length === 0 && (
              <div className="text-center py-16 glass-panel rounded-2xl p-8">
                <CheckCheck className="w-8 h-8 text-[#F6E8EA]/60 mx-auto mb-2.5" />
                <p className="text-sm font-semibold text-[#FCF8F9]">Your mind is clear</p>
                <p className="text-xs text-[#A38F99] mt-1 max-w-sm mx-auto leading-relaxed">
                  Type any task, meeting, or random idea into the input above to sift it into your workspace.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}