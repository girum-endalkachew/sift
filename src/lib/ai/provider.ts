import { AIProvider, EnrichedAIItem } from './types';
import { GeminiProvider } from './gemini';
import { GroqProvider } from './groq';

export function getAIProvider(): AIProvider | null {
  const providerName = (process.env.AI_PROVIDER || '').toLowerCase();

  if (
    providerName === 'groq' ||
    process.env.GROQ_API_KEY_1 ||
    process.env.GROQ_API_KEY_2 ||
    process.env.GROQ_API_KEY
  ) {
    return new GroqProvider();
  }

  if (providerName === 'gemini' || process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  return null;
}

export async function enrichWithAI(rawText: string): Promise<EnrichedAIItem[] | null> {
  const provider = getAIProvider();
  if (!provider) return null;
  return provider.analyzeText(rawText);
}