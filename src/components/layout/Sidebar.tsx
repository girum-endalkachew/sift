'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Inbox, 
  CheckCircle2, 
  Calendar, 
  FolderKanban, 
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Workspace', href: '/', icon: Sparkles },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <aside className="w-64 border-r border-[#D8B4BE]/15 bg-[#1A0A0F]/60 backdrop-blur-2xl min-h-screen flex flex-col justify-between p-5 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F6E8EA] shadow-[0_0_12px_#F6E8EA]"></span>
            <span className="text-xl font-bold tracking-wider text-[#FCF8F9]">SIFT</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#D8B4BE] px-2 py-0.5 rounded-md bg-[#2A1117]/80 border border-[#D8B4BE]/20">
            v0.1
          </span>
        </div>

        {/* Quick Search */}
        <div className="px-1">
          <button className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#A38F99] bg-[#2A1117]/40 border border-[#D8B4BE]/15 rounded-xl hover:border-[#D8B4BE]/40 hover:text-[#FCF8F9] transition">
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#D8B4BE]" />
              <span>Search...</span>
            </span>
            <kbd className="text-[10px] bg-[#1A0A0F] px-1.5 py-0.5 rounded border border-[#D8B4BE]/30 text-[#D8B4BE] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
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
                    ? 'bg-[#F6E8EA] text-[#1A0A0F] font-semibold shadow-[0_0_20px_rgba(246,232,234,0.2)]'
                    : 'text-[#FCF8F9]/70 hover:bg-[#F6E8EA]/10 hover:text-[#FCF8F9]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#1A0A0F]' : 'text-[#D8B4BE]')} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-[#D8B4BE]/15 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F6E8EA] text-[#1A0A0F] flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(246,232,234,0.3)]">
            GE
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#FCF8F9]">Girum E.</span>
            <span className="text-[10px] text-[#A38F99]">Workspace</span>
          </div>
        </div>
      </div>
    </aside>
  );
}