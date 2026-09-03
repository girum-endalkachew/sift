'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeroInput } from '@/components/inbox/HeroInput';
import { ItemCard } from '@/components/tasks/ItemCard';
import { ItemCardSkeleton } from '@/components/ui/Skeleton';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { Item } from '@/types';
import { CheckCheck, Inbox, Calendar, Layers, Trash2, Target } from 'lucide-react';
import { ProductTour } from '@/components/ui/ProductTour';

export default function WorkspacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) setItems(data.data);
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

    const focusedItems: Item[] = [];
    const todayItems: Item[] = [];
    const tomorrowItems: Item[] = [];
    const upcomingItems: Item[] = [];
    const inboxItems: Item[] = [];

    items.forEach((item) => {
      if (item.isFocused && item.status !== 'DONE') focusedItems.push(item);

      if (!item.dueDate) {
        inboxItems.push(item);
        return;
      }
      const itemDateStr = new Date(item.dueDate).toDateString();
      if (itemDateStr === todayStr) todayItems.push(item);
      else if (itemDateStr === tomorrowStr) tomorrowItems.push(item);
      else upcomingItems.push(item);
    });

    return { focusedItems, todayItems, tomorrowItems, upcomingItems, inboxItems };
  }, [items]);

  const hasDoneItems = items.some((i) => i.status === 'DONE');

  return (
    <div className="flex flex-col md:flex-row min-h-screen">`r`n      <ProductTour />
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-6 md:space-y-9">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Good afternoon.
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Dump raw thoughts. Correct. Focus. Keep moving.
            </p>
          </div>
          {hasDoneItems && (
            <button
              onClick={handleClearCompleted}
              className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-muted hover:text-foreground glass-card px-3 py-2 rounded-xl transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          )}
        </header>

        <section>
          <HeroInput onItemAdded={fetchItems} />
        </section>

        {loading && (
          <div className="space-y-3">
            <ItemCardSkeleton />
            <ItemCardSkeleton />
            <ItemCardSkeleton />
          </div>
        )}

        {!loading && (
          <div className="space-y-6 pb-16">
            {groups.focusedItems.length > 0 && (
              <CollapsibleSection
                title="Current Focus"
                count={groups.focusedItems.length}
                icon={Target}
                accentClassName="text-amber-500"
                framed
                defaultOpen
              >
                {groups.focusedItems.map((item) => (
                  <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </CollapsibleSection>
            )}

            {groups.todayItems.length > 0 && (
              <CollapsibleSection title="Today" count={groups.todayItems.length} icon={Calendar} defaultOpen>
                {groups.todayItems.map((item) => (
                  <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </CollapsibleSection>
            )}

            {groups.tomorrowItems.length > 0 && (
              <CollapsibleSection title="Tomorrow" count={groups.tomorrowItems.length} icon={Calendar} defaultOpen>
                {groups.tomorrowItems.map((item) => (
                  <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </CollapsibleSection>
            )}

            {groups.upcomingItems.length > 0 && (
              <CollapsibleSection title="Upcoming" count={groups.upcomingItems.length} icon={Layers} defaultOpen={false}>
                {groups.upcomingItems.map((item) => (
                  <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </CollapsibleSection>
            )}

            {groups.inboxItems.length > 0 && (
              <CollapsibleSection title="Inbox & Ideas" count={groups.inboxItems.length} icon={Inbox} defaultOpen={false}>
                {groups.inboxItems.map((item) => (
                  <ItemCard key={item.id} item={item} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </CollapsibleSection>
            )}

            {items.length === 0 && (
              <div className="text-center py-12 sm:py-16 glass-panel rounded-2xl p-6 sm:p-8">
                <CheckCheck className="w-8 h-8 text-primary/60 mx-auto mb-2.5" />
                <p className="text-sm font-semibold text-foreground">Your mind is clear</p>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto leading-relaxed">
                  Type any task, meeting, or random idea into the input above.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}