import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock AudioContext for audio-related tests
const mockAudioContext = {
  createAnalyser: vi.fn(),
  createGain: vi.fn(),
  createOscillator: vi.fn(),
  createBufferSource: vi.fn(),
  createMediaElementSource: vi.fn(),
  decodeAudioData: vi.fn(),
  destination: {},
  sampleRate: 44100,
  currentTime: 0,
  state: "running",
  close: vi.fn(),
  resume: vi.fn(),
  suspend: vi.fn(),
};

(global as Record<string, unknown>).AudioContext = vi
  .fn()
  .mockImplementation(() => mockAudioContext);
(global as Record<string, unknown>).webkitAudioContext = (
  global as Record<string, unknown>
).AudioContext;

// Mock other Web APIs that might be needed
(
  global as Record<string, unknown> & {
    HTMLMediaElement: typeof HTMLMediaElement;
  }
).HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
(
  global as Record<string, unknown> & {
    HTMLMediaElement: typeof HTMLMediaElement;
  }
).HTMLMediaElement.prototype.pause = vi.fn();

// Mock matchMedia for theme detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
(global as Record<string, unknown>).ResizeObserver = vi
  .fn()
  .mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

// Mock IntersectionObserver
(global as Record<string, unknown>).IntersectionObserver = vi
  .fn()
  .mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
