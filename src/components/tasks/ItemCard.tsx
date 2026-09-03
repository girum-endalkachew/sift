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

const priorityStyles: Record<ItemPriority, string> = {
  URGENT: 'text-red-700 bg-red-100/70 border-red-200',
  HIGH: 'text-amber-800 bg-amber-100/70 border-amber-200',
  MEDIUM: 'text-muted bg-rose-soft/20 border-rose-soft/40',
  LOW: 'text-muted/80 bg-canvas border-rose-soft/30',
};

export function ItemCard({ item, onToggleStatus, onDelete }: ItemCardProps) {
  const isDone = item.status === 'DONE';
  const Icon = typeIcons[item.type as ItemType] || CheckCircle;

  return (
    <div
      className={cn(
        'group flex items-start justify-between p-4 rounded-xl border bg-canvas/70 hover:bg-canvas transition-all duration-150',
        isDone ? 'border-rose-soft/30 opacity-60' : 'border-rose-soft/50 shadow-sm hover:border-rose-soft'
      )}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleStatus(item.id, item.status)}
          className="mt-0.5 text-muted hover:text-burgundy transition"
          aria-label="Toggle status"
        >
          {isDone ? (
            <CheckCircle className="w-4 h-4 text-burgundy fill-rose-soft" />
          ) : (
            <Circle className="w-4 h-4 hover:fill-rose-soft/30" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-sm font-medium leading-snug break-words',
                isDone ? 'line-through text-muted' : 'text-text-dark'
              )}
            >
              {item.title}
            </span>

            {/* Type badge */}
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blush border border-rose-soft/40 text-text-dark/80">
              <Icon className="w-2.5 h-2.5 text-burgundy" />
              {item.type}
            </span>

            {/* Priority badge if HIGH or URGENT */}
            {(item.priority === 'HIGH' || item.priority === 'URGENT') && (
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md border', priorityStyles[item.priority as ItemPriority])}>
                {item.priority}
              </span>
            )}
          </div>

          {/* Due date if exists */}
          {item.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted pt-0.5">
              <Clock className="w-3 h-3 text-burgundy/70" />
              <span>{formatDateLabel(item.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete button (shows on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-muted hover:text-red-700 hover:bg-rose-soft/30 rounded-lg transition"
          title="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
