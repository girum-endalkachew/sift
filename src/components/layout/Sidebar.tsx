'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Inbox, 
  CheckCircle2, 
  Calendar, 
  FolderKanban, 
  Lightbulb, 
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Workspace', href: '/', icon: Sparkles },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <aside className="w-64 border-r border-rose-soft/40 bg-blush/60 min-h-screen flex flex-col justify-between p-5 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-burgundy"></span>
            <span className="text-xl font-bold tracking-tight text-burgundy">SIFT</span>
          </Link>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted px-2 py-0.5 rounded-md bg-canvas border border-rose-soft/50">
            v0.1
          </span>
        </div>

        {/* Quick Search trigger */}
        <div className="px-1">
          <button className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted bg-canvas/80 border border-rose-soft/40 rounded-xl hover:border-burgundy/30 transition">
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted" />
              <span>Quick search...</span>
            </span>
            <kbd className="text-[10px] bg-blush px-1.5 py-0.5 rounded border border-rose-soft/60">?K</kbd>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-burgundy text-canvas shadow-sm'
                    : 'text-text-dark/80 hover:bg-rose-soft/30 hover:text-text-dark'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-canvas' : 'text-muted')} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile summary */}
      <div className="pt-4 border-t border-rose-soft/40 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-burgundy-dark text-canvas flex items-center justify-center font-medium text-xs">
            GE
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-dark">Girum E.</span>
            <span className="text-[10px] text-muted">Local Workspace</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
