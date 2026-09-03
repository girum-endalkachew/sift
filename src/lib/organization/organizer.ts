import { splitClauses, cleanTitle } from './parser';
import { extractDate } from './date-parser';
import { classifyItem } from './classifier';
import { detectPriority } from './priority';
import { ItemType, ItemPriority } from '@/types';

export interface SiftedItem {
  raw: string;
  title: string;
  type: ItemType;
  priority: ItemPriority;
  dueDate: string | null;
  status: 'INBOX' | 'TODO';
}

export function siftRawInput(rawInput: string): SiftedItem[] {
  const clauses = splitClauses(rawInput);

  return clauses.map((clause) => {
    // 1. Extract Date
    const { date, dateString, cleanText } = extractDate(clause);

    // 2. Classify Type
    const type = classifyItem(clause, date !== null);

    // 3. Detect Priority
    const priority = detectPriority(clause);

    // 4. Format Clean Title
    const title = cleanTitle(cleanText);

    return {
      raw: clause,
      title,
      type,
      priority,
      dueDate: dateString,
      status: type === 'TASK' || type === 'EVENT' ? 'TODO' : 'INBOX',
    };
  });
}
