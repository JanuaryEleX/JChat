export async function getAvailableModels(apiKeys: string[], apiBaseUrl?: string): Promise<string[]> {
  const modelList = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  return modelList.sort((a, b) => b.localeCompare(a));
}
