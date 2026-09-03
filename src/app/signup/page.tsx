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
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl space-y-6 border border-[#D8B4BE]/25 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F6E8EA] shadow-[0_0_12px_#F6E8EA]"></span>
            <span className="text-2xl font-bold tracking-wider text-[#FCF8F9]">SIFT</span>
          </div>
          <p className="text-xs text-[#A38F99]">Create your private workspace</p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D8B4BE]">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Girum Endalkachew"
              className="w-full bg-[#1A0A0F]/60 border border-[#D8B4BE]/20 rounded-xl px-4 py-2.5 text-sm text-[#FCF8F9] placeholder:text-[#A38F99]/50 focus:outline-none focus:border-[#D8B4BE]/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D8B4BE]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="girum@example.com"
              className="w-full bg-[#1A0A0F]/60 border border-[#D8B4BE]/20 rounded-xl px-4 py-2.5 text-sm text-[#FCF8F9] placeholder:text-[#A38F99]/50 focus:outline-none focus:border-[#D8B4BE]/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D8B4BE]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1A0A0F]/60 border border-[#D8B4BE]/20 rounded-xl px-4 py-2.5 text-sm text-[#FCF8F9] placeholder:text-[#A38F99]/50 focus:outline-none focus:border-[#D8B4BE]/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F6E8EA] hover:bg-[#FCF8F9] text-[#1A0A0F] font-semibold py-2.5 rounded-xl text-xs transition shadow-[0_0_20px_rgba(246,232,234,0.25)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Workspace</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-[#A38F99]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F6E8EA] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}