import { ItemType } from '@/types';

export function classifyItem(text: string, hasDate: boolean): ItemType {
  const lower = text.toLowerCase().trim();

  // 1. IDEA indicators
  if (
    /^(maybe|idea:|thought:|what if|explore|consider|could we|brainstorm)/i.test(lower) ||
    lower.includes('might be cool') ||
    lower.includes('side project')
  ) {
    return 'IDEA';
  }

  // 2. EVENT indicators (meetings, calls, appointments, exams, conferences)
  if (
    /\b(meeting|meet with|call with|sync with|zoom|appointment|interview|exam|flight|webinar|conference|dinner with|lunch with|catch up with)\b/i.test(lower) ||
    (hasDate && /\b(at \d{1,2}(:\d{2})?\s*(am|pm)?)\b/i.test(lower))
  ) {
    return 'EVENT';
  }

  // 3. REMINDER indicators
  if (/^(remind me to|reminder:|don't forget to|dont forget to)/i.test(lower)) {
    return 'REMINDER';
  }

  // 4. TASK indicators (action verbs)
  if (
    /^(need to|have to|must|finish|complete|build|fix|send|write|buy|clean|prepare|research|read|draft|update|call|email|review|schedule)/i.test(lower)
  ) {
    return 'TASK';
  }

  // Default fallback: if it has a specific date/time, it's a task or event; otherwise a note
  return hasDate ? 'TASK' : 'NOTE';
}
