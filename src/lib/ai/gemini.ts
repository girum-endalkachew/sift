import { AIProvider, EnrichedAIItem } from './types';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';

  async analyzeText(rawText: string): Promise<EnrichedAIItem[] | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null; // Fallback gracefully if no key configured

    const prompt = `
You are Sift AI, an information parser.
Extract tasks, events, ideas, reminders, and notes from this messy text:
"${rawText}"

Return ONLY a JSON array of objects with this schema:
[
  {
    "title": "Clean concise action title",
    "type": "TASK" | "EVENT" | "REMINDER" | "IDEA" | "NOTE",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    "dueDate": "ISO string date or null if not mentioned"
  }
]
No markdown formatting, no explanation, just raw JSON array.
`;

    try {
      const response = await fetch(
        `https-[#1A0A0F]generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawResponseText) return null;

      // Sanitize JSON markdown fences if returned
      const cleanJson = rawResponseText.replace(/```json|```/g, '').trim();
      const parsed: EnrichedAIItem[] = JSON.parse(cleanJson);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.error('Gemini AI Provider error:', error);
      return null; // Silent fallback to deterministic engine
    }
  }
}