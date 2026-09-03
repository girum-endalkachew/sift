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
  ArrowRight
} from 'lucide-react';
import { ItemType } from '@/types';
import { cn, formatDateLabel } from '@/lib/utils';

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
    label: 'A student',
    text: 'Need to finish the ACA landing page tonight, meeting with coach tomorrow at 4, remind me to send the proposal, exam Friday, also research PostgreSQL.',
  },
  {
    label: 'A founder',
    text: 'Fix onboarding bug asap, call investors Wednesday at 10am, prep board deck by Friday, maybe redesign pricing page, remind me to renew the domain.',
  },
  {
    label: 'A parent',
    text: 'Pick up groceries tonight, dentist appointment tomorrow at 3, remind me to sign permission slip, soccer practice Saturday, idea: family trip in July.',
  },
];

export default function LandingPage() {
  const [text, setText] = useState(EXAMPLES[0].text);
  const [results, setResults] = useState<SiftedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeExample, setActiveExample] = useState(0);

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
      if (data.success) {
        setResults(data.data);
      }
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="w-full border-b border-[#D8B4BE]/10 bg-[#1A0A0F]/60 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F6E8EA] shadow-[0_0_12px_#F6E8EA]"></span>
            <span className="text-xl font-bold tracking-wider text-[#FCF8F9]">SIFT</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm text-[#A38F99] hover:text-[#FCF8F9] px-3 py-2 transition"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 bg-[#F6E8EA] hover:bg-[#FCF8F9] text-[#1A0A0F] font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-[0_0_20px_rgba(246,232,234,0.25)]"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-24 pb-16 md:pb-24">
        <div className="max-w-3xl mb-10 md:mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D8B4BE] mb-5">
            Mess → Sift → Clarity
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FCF8F9] leading-[1.05]">
            Don&rsquo;t organize it.
            <br />
            <span className="text-[#D8B4BE]">Dump it.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#A38F99] leading-relaxed max-w-2xl">
            Everything in your head. Written how you actually think.
            Sift turns messy sentences into structured tasks, events, and ideas —
            instantly.
          </p>
        </div>

        {/* Example selector */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] uppercase tracking-widest text-[#A38F99] font-mono mr-1">
            Try
          </span>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExampleSelect(i)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition border',
                activeExample === i
                  ? 'bg-[#F6E8EA] text-[#1A0A0F] border-transparent'
                  : 'text-[#A38F99] border-[#D8B4BE]/20 hover:text-[#FCF8F9] hover:border-[#D8B4BE]/40'
              )}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Interactive dump box (same design language as workspace HeroInput) */}
        <div className="w-full glass-input rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3 text-xs text-[#A38F99]">
            <span className="flex items-center gap-2 font-medium text-[#D8B4BE]">
              <Sparkles className="w-4 h-4 text-[#F6E8EA]" />
              Try it live
            </span>
            <span className="hidden sm:inline">Edit the text — then sift.</span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-transparent resize-none border-0 p-0 text-[#FCF8F9] placeholder:text-[#A38F99]/50 text-sm sm:text-base focus:ring-0 focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#D8B4BE]/15">
            <span className="text-[11px] text-[#A38F99] bg-[#2A1117]/60 px-2.5 py-1 rounded-lg border border-[#D8B4BE]/15">
              No signup needed to try
            </span>
            <button
              onClick={handleSift}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 bg-[#F6E8EA] hover:bg-[#FCF8F9] text-[#1A0A0F] font-semibold disabled:opacity-30 disabled:cursor-not-allowed px-4 sm:px-5 py-2.5 rounded-xl text-xs transition duration-200 shadow-[0_0_20px_rgba(246,232,234,0.25)] hover:shadow-[0_0_25px_rgba(246,232,234,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1A0A0F]" />
                  <span>Sifting...</span>
                </>
              ) : (
                <>
                  <span>Sift</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#1A0A0F]" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live result */}
        {groupedResults && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#D8B4BE] font-mono">
              <span className="w-8 h-px bg-[#D8B4BE]/30" />
              Organized
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {groupedResults.today.length > 0 && (
                <ResultGroup label="Today" icon={CalendarIcon} items={groupedResults.today} />
              )}
              {groupedResults.tomorrow.length > 0 && (
                <ResultGroup label="Tomorrow" icon={CalendarIcon} items={groupedResults.tomorrow} />
              )}
              {groupedResults.later.length > 0 && (
                <ResultGroup label="Upcoming" icon={Layers} items={groupedResults.later} />
              )}
              {groupedResults.inbox.length > 0 && (
                <ResultGroup label="Inbox" icon={InboxIcon} items={groupedResults.inbox} />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Mess → Clarity */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-[#D8B4BE]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D8B4BE] mb-4">
              The Idea
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FCF8F9] leading-tight">
              Your mind isn&rsquo;t a to-do app.
            </h2>
            <p className="mt-5 text-[#A38F99] leading-relaxed">
              You think in sentences. In half-thoughts. In messy paragraphs at midnight.
              You shouldn&rsquo;t have to pick a project, category, tag, priority,
              due date, and status just to remember something.
            </p>
            <p className="mt-4 text-[#A38F99] leading-relaxed">
              Sift reads what you wrote. It figures out what belongs where.
              You just dump.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="glass-panel p-5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-[#A38F99] font-mono mb-2">
                What you write
              </p>
              <p className="text-sm text-[#FCF8F9] leading-relaxed">
                &ldquo;Meeting with Sarah tomorrow at 4, need to finish the deck tonight,
                remind me to reply to Marcus, exam Friday.&rdquo;
              </p>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-[#D8B4BE] rotate-90" />
            </div>
            <div className="glass-panel p-5 rounded-2xl space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#A38F99] font-mono mb-2">
                What Sift builds
              </p>
              <MiniItem type="EVENT" title="Meeting with Sarah" hint="Tomorrow · 4:00 PM" />
              <MiniItem type="TASK" title="Finish the deck" hint="Today · High" />
              <MiniItem type="REMINDER" title="Reply to Marcus" hint="Inbox" />
              <MiniItem type="EVENT" title="Exam" hint="Friday" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-[#D8B4BE]/10">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D8B4BE] mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FCF8F9] leading-tight">
            Three steps. No configuration.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StepCard
            number="01"
            title="Capture"
            body="Open Sift, type what&rsquo;s in your head, hit enter. Punctuation optional. Structure not required."
          />
          <StepCard
            number="02"
            title="Understand"
            body="A deterministic engine reads your text — extracting dates, priorities, actions, and intent."
          />
          <StepCard
            number="03"
            title="Organize"
            body="Items land in Today, Tomorrow, Upcoming, or Inbox. Editable. Yours. Never guessed twice."
          />
        </div>
      </section>

      {/* Real product preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-[#D8B4BE]/10">
        <div className="max-w-2xl mb-8 md:mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D8B4BE] mb-4">
            Your workspace
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FCF8F9] leading-tight">
            A calm command center.
          </h2>
          <p className="mt-5 text-[#A38F99] leading-relaxed">
            Not a dashboard. Not a Kanban board. Just what matters, when it matters.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8B4BE]/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6E8EA]"></span>
              <span className="text-xs font-mono tracking-widest text-[#D8B4BE]">SIFT / WORKSPACE</span>
            </div>
            <span className="text-[10px] text-[#A38F99] font-mono">preview</span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA] mb-2">
                <CalendarIcon className="w-3.5 h-3.5 text-[#D8B4BE]" />
                Today
              </div>
              <div className="space-y-2">
                <PreviewItem type="TASK" title="Finish ACA landing page" hint="Today · High" />
                <PreviewItem type="TASK" title="Send weekly update" hint="Today" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA] mb-2">
                <CalendarIcon className="w-3.5 h-3.5 text-[#D8B4BE]" />
                Tomorrow
              </div>
              <div className="space-y-2">
                <PreviewItem type="EVENT" title="Meeting with coach" hint="Tomorrow · 4:00 PM" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA] mb-2">
                <InboxIcon className="w-3.5 h-3.5 text-[#D8B4BE]" />
                Inbox & Ideas
              </div>
              <div className="space-y-2">
                <PreviewItem type="REMINDER" title="Send the proposal" hint="Inbox" />
                <PreviewItem type="IDEA" title="Research PostgreSQL" hint="Idea" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-20 md:py-28 border-t border-[#D8B4BE]/10">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#FCF8F9] leading-tight">
            Clear your head.
            <br />
            <span className="text-[#D8B4BE]">Keep the momentum.</span>
          </h2>
          <p className="mt-5 text-[#A38F99] leading-relaxed">
            Create a free workspace. Dump your first mess. See what Sift does.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-[#F6E8EA] hover:bg-[#FCF8F9] text-[#1A0A0F] font-semibold px-5 py-3 rounded-xl text-sm transition shadow-[0_0_20px_rgba(246,232,234,0.25)]"
            >
              <span>Create your workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="text-sm text-[#A38F99] hover:text-[#FCF8F9] px-4 py-3 transition"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D8B4BE]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#A38F99]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F6E8EA]"></span>
            <span className="font-mono tracking-widest text-[#D8B4BE]">SIFT</span>
            <span>· Built by Girum Endalkachew</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-[#FCF8F9]">Sign in</Link>
            <Link href="/signup" className="hover:text-[#FCF8F9]">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------- Sub components (share workspace design language) ----------

function ResultGroup({
  label,
  icon: Icon,
  items,
}: {
  label: string;
  icon: React.ElementType;
  items: SiftedResult[];
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6E8EA]">
        <Icon className="w-3.5 h-3.5 text-[#D8B4BE]" />
        <span>{label}</span>
        <span className="text-[#A38F99] font-normal">({items.length})</span>
      </div>
      <div className="space-y-2">
        {items.map((r, i) => (
          <ResultItem key={i} item={r} />
        ))}
      </div>
    </div>
  );
}

function ResultItem({ item }: { item: SiftedResult }) {
  const Icon = typeIcons[item.type] || CheckCircle2;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl glass-card">
      <div className="w-8 h-8 rounded-lg bg-[#2A1117]/80 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#D8B4BE]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#FCF8F9] leading-snug break-words">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] font-semibold text-[#D8B4BE] uppercase tracking-wide">
            {item.type}
          </span>
          {item.dueDate && (
            <span className="text-[10px] text-[#A38F99]">
              {formatDateLabel(item.dueDate)}
            </span>
          )}
          {(item.priority === 'HIGH' || item.priority === 'URGENT') && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-300">
              {item.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniItem({ type, title, hint }: { type: ItemType; title: string; hint: string }) {
  const Icon = typeIcons[type] || CheckCircle2;
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg glass-card">
      <div className="w-7 h-7 rounded-md bg-[#2A1117]/80 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#D8B4BE]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#FCF8F9] font-medium truncate">{title}</p>
        <p className="text-[10px] text-[#A38F99]">{hint}</p>
      </div>
      <span className="text-[9px] font-semibold text-[#D8B4BE] uppercase tracking-wide">
        {type}
      </span>
    </div>
  );
}

function PreviewItem({ type, title, hint }: { type: ItemType; title: string; hint: string }) {
  const Icon = typeIcons[type] || CheckCircle2;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl glass-card">
      <div className="w-4 h-4 rounded-full border border-[#D8B4BE]/50" />
      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-[#FCF8F9]">{title}</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2A1117]/80 border border-[#D8B4BE]/20 text-[#D8B4BE]">
          <Icon className="w-2.5 h-2.5 text-[#F6E8EA]" />
          {type}
        </span>
      </div>
      <span className="text-[10px] text-[#A38F99]">{hint}</span>
    </div>
  );
}

function StepCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
      <span className="text-xs font-mono tracking-widest text-[#D8B4BE]">{number}</span>
      <h3 className="text-lg font-bold text-[#FCF8F9]">{title}</h3>
      <p className="text-sm text-[#A38F99] leading-relaxed">{body}</p>
    </div>
  );
}