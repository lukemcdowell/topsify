const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

interface Window {
  count: number;
  start: number;
}

const windows = new Map<string, Window>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [key, w] of windows) {
    if (now - w.start > WINDOW_MS) windows.delete(key);
  }

  const window = windows.get(ip);

  if (!window || now - window.start > WINDOW_MS) {
    windows.set(ip, { count: 1, start: now });
    return false;
  }

  if (window.count >= MAX_REQUESTS) {
    return true;
  }

  window.count++;
  return false;
}
