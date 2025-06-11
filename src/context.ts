export function getSuggestions(text: string, count = 3): string[] {
  const sentences = text
    .split(/\n|\.|!|\?/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.slice(0, count);
}
