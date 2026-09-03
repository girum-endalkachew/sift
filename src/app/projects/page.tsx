'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Project } from '@/types';
import { FolderKanban, Plus, Folder } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || creating) return;

    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setDescription('');
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 space-y-8">
        <header className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
            <FolderKanban className="w-4 h-4 text-primary" />
            <span>High-Level Contexts</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted">
            Group related tasks, notes, and goals into distinct focus areas.
          </p>
        </header>

        {/* Create Project Form */}
        <form onSubmit={handleCreate} className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-accent font-semibold">
            <span>Create New Project</span>
          </div>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Project Name (e.g. ACA Landing Page, Sift Mobile, Study)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background/60 border border-border/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-border/50"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background/60 border border-border/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-border/50"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="flex items-center gap-1.5 bg-primary hover:bg-[#FCF8F9] text-inverse font-semibold px-4 py-2 rounded-xl text-xs disabled:opacity-30 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>
        </form>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">{proj.name}</h3>
              </div>
              {proj.description && (
                <p className="text-xs text-muted leading-relaxed">{proj.description}</p>
              )}
            </div>
          ))}

          {!loading && projects.length === 0 && (
            <div className="col-span-full text-center py-12 glass-panel rounded-2xl p-6">
              <FolderKanban className="w-7 h-7 text-primary/60 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No projects yet</p>
              <p className="text-xs text-muted mt-1">Create your first project above to group related tasks.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}