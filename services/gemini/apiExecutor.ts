import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { KeyManager } from '../keyManager';

/**
 * Executes a non-streaming API call with key rotation and retry logic,
 * proxying requests to a custom endpoint if provided.
 */
export async function executeWithKeyRotation<T>(
    apiKey: string,
    operation: (ai: GoogleGenAI) => Promise<T>,
    apiEndpoint?: string,
): Promise<T> {
    if (!apiKey) {
        throw new Error("No API key provided.");
    }

    const originalFetch = window.fetch;
    let proxyActive = false;
    const trimmedApiEndpoint = apiEndpoint?.trim();

    if (trimmedApiEndpoint) {
        try {
            const proxyUrl = new URL(trimmedApiEndpoint);
            proxyActive = true;
            window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
                let urlString = input instanceof Request ? input.url : String(input);
                if (urlString.includes('generativelanguage.googleapis.com')) {
                    const originalUrl = new URL(urlString);
                    const finalProxyUrl = new URL(proxyUrl);
                    
                    const newPathname = (finalProxyUrl.pathname.replace(/\/$/, '') + originalUrl.pathname).replace(/\/\//g, '/');
                    finalProxyUrl.pathname = newPathname;
                    finalProxyUrl.search = originalUrl.search;
                    
                    urlString = finalProxyUrl.toString();
                }
                return originalFetch(urlString, init);
            };
        } catch (e) {
            console.error("Invalid API Base URL provided:", trimmedApiEndpoint, e);
        }
    }
    
    try {
        try {
            const ai = new GoogleGenAI({ apiKey });
            const result = await operation(ai);
            return result;
        } catch (error) {
            console.error("API call failed.", error);
            throw error;
        }
    } finally {
        if (proxyActive) {
            window.fetch = originalFetch;
        }
    }
}


/**
 * Executes a streaming API call with key rotation and retry logic,
 * proxying requests to a custom endpoint if provided.
 */
export async function* executeStreamWithKeyRotation<T extends GenerateContentResponse>(
    apiKey: string,
    operation: (ai: GoogleGenAI) => Promise<AsyncGenerator<T>>,
    apiEndpoint?: string,
): AsyncGenerator<T> {
    if (!apiKey) {
        yield { text: "Error: No API key provided." } as T;
        return;
    }

    const originalFetch = window.fetch;
    let proxyActive = false;
    const trimmedApiEndpoint = apiEndpoint?.trim();

    if (trimmedApiEndpoint) {
        try {
            const proxyUrl = new URL(trimmedApiEndpoint);
            proxyActive = true;
            window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
                let urlString = input instanceof Request ? input.url : String(input);
                if (urlString.includes('generativelanguage.googleapis.com')) {
                    const originalUrl = new URL(urlString);
                    const finalProxyUrl = new URL(proxyUrl);
                    
                    const newPathname = (finalProxyUrl.pathname.replace(/\/$/, '') + originalUrl.pathname).replace(/\/\//g, '/');
                    finalProxyUrl.pathname = newPathname;
                    finalProxyUrl.search = originalUrl.search;

                    urlString = finalProxyUrl.toString();
                }
                return originalFetch(urlString, init);
            };
        } catch (e) {
            console.error("Invalid API Base URL provided:", trimmedApiEndpoint, e);
        }
    }

    try {
        try {
            const ai = new GoogleGenAI({ apiKey });
            const stream = await operation(ai);
            yield* stream;
        } catch (error) {
            console.error("API stream failed.", error);
            yield { text: "Error: API stream failed. " + (error?.message || "") } as T;
        }

    } finally {
        if (proxyActive) {
            window.fetch = originalFetch;
        }
    }
}
