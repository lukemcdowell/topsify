import "@testing-library/jest-dom";

// Spotify env vars needed for spotifyApi.ts module-level initialization
process.env.SPOTIFY_CLIENT_ID = "test-client-id";
process.env.SPOTIFY_CLIENT_SECRET = "test-client-secret";
process.env.SPOTIFY_REDIRECT_URI = "http://127.0.0.1:3000/api/callback";

// Radix UI requires ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Radix UI requires matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Radix UI requires PointerEvent
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, init?: PointerEventInit) {
      super(type, init);
    }
  }
  global.PointerEvent = PointerEvent as typeof globalThis.PointerEvent;
}
