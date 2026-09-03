import { AIProvider, EnrichedAIItem } from './types';
import { GeminiProvider } from './gemini';

export function getAIProvider(): AIProvider | null {
  const providerName = (process.env.AI_PROVIDER || 'none').toLowerCase();

  switch (providerName) {
    case 'gemini':
      return new GeminiProvider();
    default:
      return null; // Uses deterministic engine only
  }
}

export async function enrichWithAI(rawText: string): Promise<EnrichedAIItem[] | null> {
  const provider = getAIProvider();
  if (!provider) return null;
  return provider.analyzeText(rawText);
}