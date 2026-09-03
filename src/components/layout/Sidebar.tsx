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
  X,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from './SearchProvider';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openSearch } = useSearch();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      });

    const savedTheme = (localStorage.getItem('sift_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedCollapsed = localStorage.getItem('sift_sidebar_collapsed') === 'true';
    setCollapsed(savedCollapsed);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('sift_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sift_sidebar_collapsed', String(next));
  };

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
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 w-full glass-panel border-b border-border px-4 py-3 flex items-center justify-between select-none rounded-none">
        <Link href="/workspace" className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <span className="text-lg font-bold tracking-wider text-foreground">SIFT</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-muted hover:text-foreground bg-surface border border-border rounded-xl">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>
          <button onClick={openSearch} className="p-2 text-muted bg-surface border border-border rounded-xl">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileOpen((p) => !p)} className="p-2 text-foreground bg-surface border border-border rounded-xl">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'glass-sidebar min-h-screen flex flex-col justify-between p-3 select-none transition-all duration-300 z-50',
          'fixed inset-y-0 left-0 md:static',
          collapsed ? 'md:w-[76px]' : 'md:w-64',
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="space-y-5">
          <div className={cn('hidden md:flex items-center px-1', collapsed ? 'justify-center' : 'justify-between')}>
            {!collapsed && (
              <Link href="/workspace" className="flex items-center space-x-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                <span className="text-xl font-bold tracking-wider text-foreground">SIFT</span>
              </Link>
            )}
            <div className={cn('flex items-center gap-1', collapsed && 'flex-col gap-2')}>
              <button
                onClick={toggleCollapsed}
                className="p-1.5 text-muted hover:text-foreground bg-surface/70 border border-border rounded-lg transition"
                title={collapsed ? 'Open sidebar' : 'Close sidebar'}
              >
                {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
              </button>
              {!collapsed && (
                <button
                  onClick={toggleTheme}
                  className="p-1.5 text-muted hover:text-foreground bg-surface/70 border border-border rounded-lg transition"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              )}
            </div>
          </div>

          {!collapsed && (
            <div className="hidden md:block px-1">
              <button
                onClick={openSearch}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted glass-card rounded-xl hover:text-foreground transition"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-accent" />
                  <span>Search...</span>
                </span>
                <kbd className="text-[10px] bg-background/60 px-1.5 py-0.5 rounded border border-border text-muted font-mono">⌘K</kbd>
              </button>
            </div>
          )}

          {collapsed && (
            <div className="hidden md:flex flex-col items-center gap-2">
              <button onClick={openSearch} className="p-2.5 text-muted hover:text-foreground glass-card rounded-xl" title="Search">
                <Search className="w-4 h-4" />
              </button>
              <button onClick={toggleTheme} className="p-2.5 text-muted hover:text-foreground glass-card rounded-xl" title="Theme">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
              </button>
            </div>
          )}

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    'flex items-center rounded-xl text-sm font-medium transition-all duration-150',
                    collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5',
                    isActive
                      ? 'bg-primary text-inverse font-semibold shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_20%,transparent)]'
                      : 'text-foreground/75 hover:bg-surface/80 hover:text-foreground glass-card border-transparent'
                  )}
                >
                  <div className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
                    <Icon className={cn('w-4 h-4', isActive ? 'text-inverse' : 'text-accent')} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={cn('pt-4 border-t border-border px-1 flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
          <div className={cn('flex items-center min-w-0', collapsed ? '' : 'gap-2.5')}>
            <div className="w-8 h-8 rounded-full bg-primary text-inverse flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">{user?.name || 'User'}</span>
                <span className="text-[10px] text-muted truncate">{user?.email || 'Workspace'}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-muted hover:text-rose-500 hover:bg-surface rounded-lg transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}