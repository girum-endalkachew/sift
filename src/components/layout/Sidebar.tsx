'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Inbox, 
  CheckCircle2, 
  Calendar, 
  FolderKanban, 
  Sparkles,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from './SearchProvider';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openSearch } = useSearch();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      });
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  const navItems = [
    { label: 'Workspace', href: '/', icon: Sparkles },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <>
      {/* Mobile Top Header (< md) */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-[#1A0A0F]/80 backdrop-blur-2xl border-b border-[#D8B4BE]/15 px-4 py-3 flex items-center justify-between select-none">
        <Link href="/" className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#F6E8EA] shadow-[0_0_10px_#F6E8EA]"></span>
          <span className="text-lg font-bold tracking-wider text-[#FCF8F9]">SIFT</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={openSearch}
            className="p-2 text-[#D8B4BE] bg-[#2A1117]/60 border border-[#D8B4BE]/20 rounded-xl"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 text-[#FCF8F9] bg-[#2A1117]/60 border border-[#D8B4BE]/20 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[#1A0A0F]/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content (Desktop static, Mobile slide-over drawer) */}
      <aside
        className={cn(
          'w-64 border-r border-[#D8B4BE]/15 bg-[#1A0A0F]/90 md:bg-[#1A0A0F]/60 backdrop-blur-2xl min-h-screen flex flex-col justify-between p-5 select-none transition-transform duration-200 z-50',
          'fixed inset-y-0 left-0 md:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="space-y-6">
          <div className="hidden md:flex items-center justify-between px-2">
            <Link href="/" className="flex items-center space-x-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F6E8EA] shadow-[0_0_12px_#F6E8EA]"></span>
              <span className="text-xl font-bold tracking-wider text-[#FCF8F9]">SIFT</span>
            </Link>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#D8B4BE] px-2 py-0.5 rounded-md bg-[#2A1117]/80 border border-[#D8B4BE]/20">
              v0.1
            </span>
          </div>

          <div className="hidden md:block px-1">
            <button
              onClick={openSearch}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#A38F99] bg-[#2A1117]/40 border border-[#D8B4BE]/15 rounded-xl hover:border-[#D8B4BE]/40 hover:text-[#FCF8F9] transition"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#D8B4BE]" />
                <span>Search...</span>
              </span>
              <kbd className="text-[10px] bg-[#1A0A0F] px-1.5 py-0.5 rounded border border-[#D8B4BE]/30 text-[#D8B4BE] font-mono">⌘K</kbd>
            </button>
          </div>

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

        <div className="pt-4 border-t border-[#D8B4BE]/15 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#F6E8EA] text-[#1A0A0F] flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(246,232,234,0.3)] shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#FCF8F9] truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] text-[#A38F99] truncate">{user?.email || 'Workspace'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#A38F99] hover:text-rose-400 hover:bg-[#2A1117] rounded-lg transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}