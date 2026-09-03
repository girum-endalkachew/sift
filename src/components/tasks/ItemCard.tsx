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
          className="mt-0.5 text-[#D8B4BE] hover:text-[#F6E8EA] transition"
        >
          {isDone ? (
            <CheckCircle className="w-4 h-4 text-[#F6E8EA] fill-[#2A1117]" />
          ) : (
            <Circle className="w-4 h-4 text-[#D8B4BE]/70 hover:text-[#F6E8EA]" />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-sm font-medium leading-snug break-words',
                isDone ? 'line-through text-[#A38F99]' : 'text-[#FCF8F9]'
              )}
            >
              {item.title}
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2A1117]/80 border border-[#D8B4BE]/20 text-[#D8B4BE]">
              <Icon className="w-2.5 h-2.5 text-[#F6E8EA]" />
              {item.type}
            </span>

            {(item.priority === 'HIGH' || item.priority === 'URGENT') && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-300">
                {item.priority}
              </span>
            )}
          </div>

          {item.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-[#A38F99]">
              <Clock className="w-3 h-3 text-[#D8B4BE]" />
              <span>{formatDateLabel(item.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-[#A38F99] hover:text-rose-400 hover:bg-[#2A1117] rounded-lg transition"
          title="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}