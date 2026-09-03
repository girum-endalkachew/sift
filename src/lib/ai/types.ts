import { ItemType, ItemPriority } from '@/types';

export interface EnrichedAIItem {
  title: string;
  type: ItemType;
  priority: ItemPriority;
  dueDate?: string | null;
  summary?: string | null;
}

export interface AIProvider {
  name: string;
  analyzeText(rawText: string): Promise<EnrichedAIItem[] | null>;
}