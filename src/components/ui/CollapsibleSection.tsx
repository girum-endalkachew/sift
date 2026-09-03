'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  accentClassName?: string;
  children: React.ReactNode;
  framed?: boolean;
}

export function CollapsibleSection({
  title,
  count,
  icon: Icon,
  defaultOpen = true,
  accentClassName = 'text-primary',
  children,
  framed = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn('space-y-3', framed && 'p-4 rounded-2xl glass-panel')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between group"
      >
        <div className={cn('flex items-center gap-2 text-xs font-bold uppercase tracking-wider', accentClassName)}>
          {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
          <span>{title}</span>
          {typeof count === 'number' && (
            <span className="text-muted font-normal">({count})</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted transition-transform duration-200',
            open ? 'rotate-0' : '-rotate-90'
          )}
        />
      </button>

      {open && <div className="space-y-2 animate-in fade-in duration-150">{children}</div>}
    </section>
  );
}