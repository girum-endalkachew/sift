'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/workspace');
        router.refresh();
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl space-y-6 border border-border shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"></span>
            <span className="text-2xl font-bold tracking-wider text-foreground">SIFT</span>
          </div>
          <p className="text-xs text-muted">Create your private workspace</p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-center break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Girum Endalkachew"
              className="w-full bg-background/80 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="girum@example.com"
              className="w-full bg-background/80 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background/80 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-inverse font-semibold py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Workspace</span><ArrowRight className="w-4 h-4 text-inverse" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}