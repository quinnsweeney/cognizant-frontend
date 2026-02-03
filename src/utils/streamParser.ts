import type { StreamResponse } from "@/types/chat";

export async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<StreamResponse, void, unknown> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split by newlines and process complete JSON objects
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const parsed = JSON.parse(trimmed) as StreamResponse;
        yield parsed;
      } catch {
        // If it's not valid JSON, it might be partial data
        // Try to find JSON objects in the line
        const jsonMatch = trimmed.match(/\{[^}]+\}/g);
        if (jsonMatch) {
          for (const match of jsonMatch) {
            try {
              const parsed = JSON.parse(match) as StreamResponse;
              yield parsed;
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim()) {
    try {
      const parsed = JSON.parse(buffer.trim()) as StreamResponse;
      yield parsed;
    } catch {
      // Ignore incomplete data at end
    }
  }
}
