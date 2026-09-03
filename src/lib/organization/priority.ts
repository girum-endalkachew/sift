import { ItemPriority } from '@/types';

export function detectPriority(text: string): ItemPriority {
  const lower = text.toLowerCase();

  // URGENT / CRITICAL
  if (/\b(urgent|asap|emergency|immediately|critical|highest priority)\b/i.test(lower)) {
    return 'URGENT';
  }

  // HIGH (tonight, today, eod, due soon)
  if (/\b(tonight|today|eod|by tonight|important|high priority|must do)\b/i.test(lower)) {
    return 'HIGH';
  }

  // LOW (someday, whenever, low priority, when free)
  if (/\b(someday|eventually|whenever|low priority|no rush|when possible)\b/i.test(lower)) {
    return 'LOW';
  }

  // Default
  return 'MEDIUM';
}
