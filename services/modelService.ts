export async function getAvailableModels(apiKeys: string[], apiBaseUrl?: string): Promise<string[]> {
  // Static fallback list to ensure the selector is never too sparse
  const fallback = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-pro',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
  ];

  // For now, return the fallback list. If we later add API probing, merge results with this list.
  const unique = Array.from(new Set(fallback));
  return unique.sort((a, b) => b.localeCompare(a));
}
