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
  PanelLeftClose,
  PanelLeftOpen,
  History,
  MessageSquarePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from './SearchProvider';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openSearch } = useSearch();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      });

    const savedCollapsed = localStorage.getItem('sift_sidebar_collapsed') === 'true';
    setCollapsed(savedCollapsed);
  }, []);

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
    { label: 'History', href: '/history', icon: History },
  ];

  return (
    <>
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full glass-panel border-b border-[#D2C3F6]/20 px-4 py-3 flex items-center justify-between select-none rounded-none">
        <Link href="/workspace" className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#D2C3F6] shadow-[0_0_10px_#D2C3F6]" />
          <span className="text-lg font-bold tracking-wider text-[#F3EEFF]">SIFT</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setFeedbackOpen(true)} className="p-2 text-[#D2C3F6] bg-white/5 border border-white/10 rounded-xl">
            <MessageSquarePlus className="w-4 h-4" />
          </button>
          <button onClick={openSearch} className="p-2 text-[#B7A8D9] bg-white/5 border border-white/10 rounded-xl">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileOpen((p) => !p)} className="p-2 text-[#F3EEFF] bg-white/5 border border-white/10 rounded-xl">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#1B1430]/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar Content */}
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
                <span className="w-3.5 h-3.5 rounded-full bg-[#D2C3F6] shadow-[0_0_12px_#D2C3F6]" />
                <span className="text-xl font-bold tracking-wider text-[#F3EEFF]">SIFT</span>
              </Link>
            )}
            <button onClick={toggleCollapsed} className="p-1.5 text-[#B7A8D9] hover:text-[#F3EEFF] bg-white/5 border border-white/10 rounded-lg transition" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5 text-[#D2C3F6]" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!collapsed && (
            <div className="hidden md:block px-1">
              <button onClick={openSearch} className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#B7A8D9] glass-card rounded-xl hover:text-[#F3EEFF] transition">
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#D2C3F6]" />
                  <span>Search...</span>
                </span>
                <kbd className="text-[10px] bg-[#1B1430]/60 px-1.5 py-0.5 rounded border border-[#D2C3F6]/20 text-[#B7A8D9] font-mono">⌘K</kbd>
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
                      ? 'bg-[#D2C3F6] text-[#24183F] font-semibold shadow-[0_0_20px_rgba(210,195,246,0.25)]'
                      : 'text-[#F3EEFF]/80 hover:bg-white/10 hover:text-[#F3EEFF]'
                  )}
                >
                  <div className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
                    <Icon className={cn('w-4 h-4', isActive ? 'text-[#24183F]' : 'text-[#D2C3F6]')} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#D2C3F6]/15 px-1">
          {!collapsed && (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#D2C3F6] hover:text-[#F3EEFF] glass-card rounded-xl transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </button>
          )}

          <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
            <div className={cn('flex items-center min-w-0', collapsed ? '' : 'gap-2.5')}>
              <div className="w-8 h-8 rounded-full bg-[#D2C3F6] text-[#24183F] flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#F3EEFF] truncate">{user?.name || 'User'}</span>
                  <span className="text-[10px] text-[#B7A8D9] truncate">{user?.email || 'Workspace'}</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button onClick={handleLogout} className="p-1.5 text-[#B7A8D9] hover:text-rose-400 hover:bg-white/5 rounded-lg transition shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}