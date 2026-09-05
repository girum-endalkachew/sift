import { AIProvider, EnrichedAIItem } from './types';

export class GroqProvider implements AIProvider {
  name = 'Groq';

  private getKeys(): string[] {
    const keys: string[] = [];
    if (process.env.GROQ_API_KEY_1) keys.push(process.env.GROQ_API_KEY_1.trim());
    if (process.env.GROQ_API_KEY_2) keys.push(process.env.GROQ_API_KEY_2.trim());
    if (process.env.GROQ_API_KEY) keys.push(process.env.GROQ_API_KEY.trim());

    return Array.from(new Set(keys)).filter((k) => k.length > 0);
  }

  async analyzeText(rawText: string): Promise<EnrichedAIItem[] | null> {
    const keys = this.getKeys();
    if (keys.length === 0) return null;

    const systemPrompt = `
You are Sift AI, an information parser.
Extract tasks, events, ideas, reminders, and notes from this messy human text:
"${rawText}"

Return ONLY a JSON object with a key "items" containing an array of objects matching this schema:
{
  "items": [
    {
      "title": "Clean concise action title",
      "type": "TASK" | "EVENT" | "REMINDER" | "IDEA" | "NOTE",
      "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      "dueDate": "ISO 8601 string or null if no date mentioned"
    }
  ]
}
`;

    for (let i = 0; i < keys.length; i++) {
      const apiKey = keys[i];
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: rawText },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          }),
        });

        if (response.status === 429 || response.status === 401) {
          console.warn(`Groq Key ${i + 1} status ${response.status}. Retrying next key...`);
          continue;
        }

        if (!response.ok) continue;

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) continue;

        const parsed = JSON.parse(content);
        const itemList = parsed.items || parsed;

        if (Array.isArray(itemList) && itemList.length > 0) {
          return itemList;
        }
      } catch (err) {
        console.error(`Groq Provider error on Key ${i + 1}:`, err);
      }
    }

    return null; // Fallback to local deterministic engine
  }
}