'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar as CalendarIcon,
  Bell,
  Lightbulb,
  FileText,
  Tag,
  Inbox as InboxIcon,
  Layers,
  ArrowRight,
  MessageSquarePlus,
  Star,
} from 'lucide-react';
import { ItemType } from '@/types';
import { cn, formatDateLabel } from '@/lib/utils';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

interface SiftedResult {
  title: string;
  type: ItemType;
  priority: string;
  dueDate: string | null;
}

const typeIcons: Record<ItemType, React.ElementType> = {
  TASK: CheckCircle2,
  EVENT: CalendarIcon,
  REMINDER: Bell,
  IDEA: Lightbulb,
  NOTE: FileText,
  REFERENCE: Tag,
};

const EXAMPLES = [
  {
    label: 'Student',
    text: 'Need to finish the ACA landing page tonight, meeting with coach tomorrow at 4, remind me to send the proposal, exam Friday, also research PostgreSQL.',
  },
  {
    label: 'Founder',
    text: 'Fix onboarding bug asap, call investors Wednesday at 10am, prep board deck by Friday, maybe redesign pricing page, remind me to renew the domain.',
  },
  {
    label: 'Creator',
    text: 'Script YouTube video tonight, record voiceover tomorrow at 2pm, publish newsletter Thursday, idea: community Q&A session next month.',
  },
];

export default function LandingPage() {
  const [text, setText] = useState(EXAMPLES[0].text);
  const [results, setResults] = useState<SiftedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleSift = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/sift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, autoSave: false }),
      });
      const data = await res.json();
      if (data.success) setResults(data.data);
    } catch (err) {
      console.error('Landing sift error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleSelect = (idx: number) => {
    setActiveExample(idx);
    setText(EXAMPLES[idx].text);
    setResults(null);
  };

  const groupedResults = React.useMemo(() => {
    if (!results) return null;
    const today: SiftedResult[] = [];
    const tomorrow: SiftedResult[] = [];
    const later: SiftedResult[] = [];
    const inbox: SiftedResult[] = [];

    const now = new Date();
    const todayStr = now.toDateString();
    const tmrw = new Date(now);
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = tmrw.toDateString();

    results.forEach((r) => {
      if (!r.dueDate) {
        inbox.push(r);
        return;
      }
      const d = new Date(r.dueDate).toDateString();
      if (d === todayStr) today.push(r);
      else if (d === tmrwStr) tomorrow.push(r);
      else later.push(r);
    });

    return { today, tomorrow, later, inbox };
  }, [results]);

  return (
    <div className="min-h-screen bg-[#1B1430] text-[#F3EEFF] selection:bg-[#D2C3F6] selection:text-[#36255C]">
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-sift.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B1430]/95 via-[#1B1430]/80 to-[#1B1430]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1430]/55 via-transparent to-[#1B1430]" />

        {/* Nav */}
        <nav className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#D2C3F6] shadow-[0_0_15px_#D2C3F6]" />
            <span className="text-xl font-bold tracking-widest text-[#F3EEFF]">SIFT</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-medium">
            <button
              onClick={() => setFeedbackOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-[#B7A8D9] hover:text-[#F3EEFF] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#D2C3F6]" />
              Feedback
            </button>
            <Link href="/login" className="text-[#B7A8D9] hover:text-[#F3EEFF] px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 bg-[#D2C3F6] hover:bg-[#F3EEFF] text-[#24183F] font-semibold px-4 py-2 rounded-xl"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2C3F6]/10 border border-[#D2C3F6]/20 text-xs font-mono text-[#D2C3F6]">
              <Sparkles className="w-3.5 h-3.5" />
              Don’t organize it. Dump it.
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] text-[#F3EEFF]">
              Explore Your Mind’s
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D2C3F6] via-[#EFE8FC] to-[#B7A8D9]">
                Quiet Paths.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#B7A8D9] leading-relaxed max-w-xl">
              Write how you actually think. Sift turns messy sentences into structured tasks,
              events, and ideas — instantly.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#B7A8D9]">
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" />
                <span className="font-bold text-[#F3EEFF]">4.9</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#B7A8D9]/40" />
              <span>Built for thinkers, builders & creators</span>
            </div>
          </div>

          {/* Floating glass widget */}
          <div className="lg:col-span-5 w-full">
            <div className="w-full bg-[#36255C]/45 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-5">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D2C3F6] animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-[#F3EEFF]">Live Sift Engine</span>
                </div>
                <span className="text-[#B7A8D9] font-mono text-[10px]">v0.1</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleSelect(i)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition',
                      activeExample === i
                        ? 'bg-[#D2C3F6] text-[#24183F] border-transparent font-semibold'
                        : 'bg-white/5 text-[#B7A8D9] border-white/10 hover:text-[#F3EEFF]'
                    )}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full bg-[#1B1430]/60 border border-white/15 rounded-2xl p-4 text-sm text-[#F3EEFF] placeholder:text-[#B7A8D9]/40 focus:outline-none focus:border-[#D2C3F6]/50 leading-relaxed resize-none"
                placeholder="Type anything messy here..."
              />

              <button
                onClick={handleSift}
                disabled={!text.trim() || loading}
                className="w-full flex items-center justify-center gap-2 bg-[#D2C3F6] hover:bg-[#F3EEFF] text-[#24183F] font-bold disabled:opacity-40 px-5 py-3.5 rounded-2xl text-sm transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sifting Thoughts...
                  </>
                ) : (
                  <>
                    Sift Mess Into Clarity
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {groupedResults && (
                <div className="pt-3 border-t border-white/10 space-y-3 max-h-60 overflow-y-auto">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D2C3F6]">Organized Stream</span>
                  {groupedResults.today.length > 0 && <ResultGroup label="Today" icon={CalendarIcon} items={groupedResults.today} />}
                  {groupedResults.tomorrow.length > 0 && <ResultGroup label="Tomorrow" icon={CalendarIcon} items={groupedResults.tomorrow} />}
                  {groupedResults.later.length > 0 && <ResultGroup label="Upcoming" icon={Layers} items={groupedResults.later} />}
                  {groupedResults.inbox.length > 0 && <ResultGroup label="Inbox" icon={InboxIcon} items={groupedResults.inbox} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-mono text-[#D2C3F6] mb-3">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F3EEFF]">Three steps. Zero forms.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard number="01" title="Dump Raw Text" body="Write how you think. Deadlines, meetings, random ideas — all in one sentence." />
          <StepCard number="02" title="Deterministic Sift" body="Local engine extracts dates, priority, and classifications instantly." />
          <StepCard number="03" title="Focus & Execute" body="Items land in Today, Tomorrow, or Focus. Pin what matters now." />
        </div>
      </section>

      <footer className="relative z-20 border-t border-white/10 py-8 bg-[#1B1430]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B7A8D9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D2C3F6]" />
            <span className="font-bold tracking-wider text-[#F3EEFF]">SIFT</span>
            <span>· Built by Girum Endalkachew</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setFeedbackOpen(true)} className="hover:text-[#F3EEFF] text-[#D2C3F6]">Send Feedback</button>
            <Link href="/login" className="hover:text-[#F3EEFF]">Sign in</Link>
            <Link href="/signup" className="hover:text-[#F3EEFF]">Create Workspace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ResultGroup({ label, icon: Icon, items }: { label: string; icon: React.ElementType; items: SiftedResult[] }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D2C3F6]">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-xs bg-[#1B1430]/80 p-2 rounded-lg border border-white/5">
            <span className="font-medium text-[#F3EEFF] truncate mr-2">{r.title}</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#D2C3F6]/20 text-[#D2C3F6] uppercase shrink-0">{r.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="bg-[#36255C]/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-3">
      <span className="text-xs font-mono tracking-widest text-[#D2C3F6]">{number}</span>
      <h3 className="text-lg font-bold text-[#F3EEFF]">{title}</h3>
      <p className="text-xs text-[#B7A8D9] leading-relaxed">{body}</p>
    </div>
  );
}