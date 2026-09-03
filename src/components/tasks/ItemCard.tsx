'use client';

import React from 'react';
import { Item, ItemPriority, ItemType } from '@/types';
import { formatDateLabel, cn } from '@/lib/utils';
import { CheckCircle, Circle, Clock, Tag, Trash2, Calendar, Lightbulb, Bell, FileText } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons: Record<ItemType, React.ElementType> = {
  TASK: CheckCircle,
  EVENT: Calendar,
  REMINDER: Bell,
  IDEA: Lightbulb,
  NOTE: FileText,
  REFERENCE: Tag,
};

export function ItemCard({ item, onToggleStatus, onDelete }: ItemCardProps) {
  const isDone = item.status === 'DONE';
  const Icon = typeIcons[item.type as ItemType] || CheckCircle;

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

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface/80 border border-border/20 text-accent">
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

      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
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