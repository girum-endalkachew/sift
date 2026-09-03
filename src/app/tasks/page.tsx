'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ItemCard } from '@/components/tasks/ItemCard';
import { Item } from '@/types';
import { CheckCircle2, CheckCheck } from 'lucide-react';

export default function TasksPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/items?type=TASK');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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

  const activeTasks = items.filter((i) => i.status !== 'DONE');
  const doneTasks = items.filter((i) => i.status === 'DONE');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 space-y-8">
        <header className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Actionable Items</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Tasks</h1>
          <p className="text-sm text-muted">
            All active to-dos across your workspace.
          </p>
        </header>

        {/* Active Tasks */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            To Do ({activeTasks.length})
          </h2>
          <div className="space-y-2">
            {activeTasks.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
            {!loading && activeTasks.length === 0 && (
              <div className="text-center py-12 glass-panel rounded-2xl p-6">
                <CheckCheck className="w-7 h-7 text-primary/60 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">No active tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        {doneTasks.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-border/15">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Completed ({doneTasks.length})
            </h2>
            <div className="space-y-2">
              {doneTasks.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}