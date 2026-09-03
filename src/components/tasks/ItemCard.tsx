'use client';

import React, { useState } from 'react';
import { Item, ItemPriority, ItemType } from '@/types';
import { formatDateLabel, cn } from '@/lib/utils';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Tag, 
  Trash2, 
  Calendar, 
  Lightbulb, 
  Bell, 
  FileText,
  Pencil,
  Check,
  X
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updatedData: Partial<Item>) => void;
}

const typeIcons: Record<ItemType, React.ElementType> = {
  TASK: CheckCircle,
  EVENT: Calendar,
  REMINDER: Bell,
  IDEA: Lightbulb,
  NOTE: FileText,
  REFERENCE: Tag,
};

const TYPES: ItemType[] = ['TASK', 'EVENT', 'REMINDER', 'IDEA', 'NOTE', 'REFERENCE'];
const PRIORITIES: ItemPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function ItemCard({ item, onToggleStatus, onDelete, onUpdate }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState<ItemType>(item.type as ItemType);
  const [priority, setPriority] = useState<ItemPriority>(item.priority as ItemPriority);
  const [dueDate, setDueDate] = useState(item.dueDate ? item.dueDate.slice(0, 16) : '');
  const [saving, setSaving] = useState(false);

  const isDone = item.status === 'DONE';
  const Icon = typeIcons[item.type as ItemType] || CheckCircle;

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    setSaving(true);

    const patchPayload: Partial<Item> = {
      title: title.trim(),
      type,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload),
      });

      const data = await res.json();
      if (data.success && onUpdate) {
        onUpdate(item.id, patchPayload);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to correct item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(item.title);
    setType(item.type as ItemType);
    setPriority(item.priority as ItemPriority);
    setDueDate(item.dueDate ? item.dueDate.slice(0, 16) : '');
    setIsEditing(false);
  };

  // Editing Mode View
  if (isEditing) {
    return (
      <div className="p-4 rounded-xl glass-card border border-border space-y-3 animate-in fade-in duration-150">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background/80 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
          placeholder="Correct title..."
          autoFocus
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Type selector */}
          <div className="flex items-center gap-1 bg-surface/60 border border-border rounded-lg p-1">
            <span className="text-[10px] text-muted font-mono px-1">TYPE:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ItemType)}
              className="bg-transparent text-foreground text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t} className="bg-surface text-foreground">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Priority selector */}
          <div className="flex items-center gap-1 bg-surface/60 border border-border rounded-lg p-1">
            <span className="text-[10px] text-muted font-mono px-1">PRIORITY:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ItemPriority)}
              className="bg-transparent text-foreground text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-surface text-foreground">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Date selector */}
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-surface/60 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/20">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-foreground transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="flex items-center gap-1 bg-primary text-inverse hover:opacity-90 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Correction'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Standard Display Mode View
  return (
    <div
      className={cn(
        'group flex items-start justify-between p-4 rounded-xl glass-card',
        isDone ? 'opacity-40' : 'opacity-100'
      )}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          onClick={() => onToggleStatus(item.id, item.status)}
          className="mt-0.5 text-accent hover:text-primary transition"
        >
          {isDone ? (
            <CheckCircle className="w-4 h-4 text-primary fill-surface" />
          ) : (
            <Circle className="w-4 h-4 text-accent/70 hover:text-primary" />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-sm font-medium leading-snug break-words',
                isDone ? 'line-through text-muted' : 'text-foreground'
              )}
            >
              {item.title}
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface/80 border border-border text-accent">
              <Icon className="w-2.5 h-2.5 text-primary" />
              {item.type}
            </span>

            {(item.priority === 'HIGH' || item.priority === 'URGENT') && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-300">
                {item.priority}
              </span>
            )}
          </div>

          {item.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock className="w-3 h-3 text-accent" />
              <span>{formatDateLabel(item.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (Edit & Delete on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex items-center gap-1 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-muted hover:text-primary hover:bg-surface rounded-lg transition"
          title="Correct/Edit item"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-muted hover:text-rose-400 hover:bg-surface rounded-lg transition"
          title="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}