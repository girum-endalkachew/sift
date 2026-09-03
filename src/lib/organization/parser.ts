export function splitClauses(input: string): string[] {
  if (!input || !input.trim()) return [];

  // Split on newlines, semicolons, or phrases like ", also", ", and then", ", remind me"
  const rawSegments = input
    .split(/\n+|\r+|\t+|;|\.\s+(?=[A-Z])|,\s*also\s+|,?\s*and\s+(?=(?:need|finish|remind|meeting|research|call|buy|build|draft|send))/i)
    .flatMap((seg) => seg.split(/,\s*(?=(?:meeting|exam|remind|need to|finish|research|call|buy|build|draft|send))/i))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return rawSegments;
}

export function cleanTitle(rawTitle: string): string {
  let cleaned = rawTitle
    .replace(/^(need to|have to|must|remind me to|don't forget to|dont forget to|also|maybe)\s+/i, '')
    .trim();

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}
