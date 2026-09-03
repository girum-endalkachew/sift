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
    { label: 'Workspace', href: '/workspace', icon: Sparkles },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-2xl border-b border-border/15 px-4 py-3 flex items-center justify-between select-none">
        <Link href="/workspace" className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#F6E8EA]"></span>
          <span className="text-lg font-bold tracking-wider text-foreground">SIFT</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={openSearch}
            className="p-2 text-accent bg-surface/60 border border-border/20 rounded-xl"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 text-foreground bg-surface/60 border border-border/20 rounded-xl"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'w-64 border-r border-border/15 bg-background/90 md:bg-background/60 backdrop-blur-2xl min-h-screen flex flex-col justify-between p-5 select-none transition-transform duration-200 z-50',
          'fixed inset-y-0 left-0 md:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="space-y-6">
          <div className="hidden md:flex items-center justify-between px-2">
            <Link href="/workspace" className="flex items-center space-x-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"></span>
              <span className="text-xl font-bold tracking-wider text-foreground">SIFT</span>
            </Link>
            <span className="text-[10px] uppercase tracking-widest font-mono text-accent px-2 py-0.5 rounded-md bg-surface/80 border border-border/20">
              v0.1
            </span>
          </div>

          <div className="hidden md:block px-1">
            <button
              onClick={openSearch}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted bg-surface/40 border border-border/15 rounded-xl hover:border-border/40 hover:text-foreground transition"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-accent" />
                <span>Search...</span>
              </span>
              <kbd className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border/30 text-accent font-mono">⌘K</kbd>
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
                      ? 'bg-primary text-inverse font-semibold shadow-[0_0_20px_rgba(246,232,234,0.2)]'
                      : 'text-foreground/70 hover:bg-primary/10 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-inverse' : 'text-accent')} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border/15 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary text-inverse flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(246,232,234,0.3)] shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] text-muted truncate">{user?.email || 'Workspace'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-muted hover:text-rose-400 hover:bg-surface rounded-lg transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}