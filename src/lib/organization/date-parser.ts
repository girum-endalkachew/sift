import * as chrono from 'chrono-node';

export interface ParsedDateResult {
  date: Date | null;
  dateString: string | null;
  cleanText: string;
}

export function extractDate(text: string): ParsedDateResult {
  const results = chrono.parse(text);

  if (results.length === 0) {
    return {
      date: null,
      dateString: null,
      cleanText: text,
    };
  }

  const firstResult = results[0];
  const parsedDate = firstResult.start.date();

  // Remove the date snippet from the raw text to keep title clean
  const matchedText = firstResult.text;
  let clean = text.replace(matchedText, '').replace(/\s{2,}/g, ' ').trim();
  
  // Clean trailing prepositions like "on", "at", "by", "for"
  clean = clean.replace(/\b(on|at|by|for|this|next|due)\s*$/i, '').trim();

  return {
    date: parsedDate,
    dateString: parsedDate.toISOString(),
    cleanText: clean.length > 0 ? clean : text,
  };
}
