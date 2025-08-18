import React, { ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";

// All provider wrapper
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult => {
  const { wrapper: Wrapper = AllTheProviders, ...renderOptions } =
    options || {};

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};

// Setup user event with custom render
export const renderWithUser = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => {
  return {
    user: userEvent.setup(),
    ...customRender(ui, options),
  };
};

// Mock audio context for audio-related tests
export const mockAudioContext = () => {
  // Mock AudioContext
  global.AudioContext = vi.fn().mockImplementation(() => ({
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
  }));

  // Mock webkitAudioContext for Safari
  global.webkitAudioContext = global.AudioContext;
};

// Mock file reader for file upload tests
export const mockFileReader = () => {
  const mockFileReader = {
    readAsArrayBuffer: vi.fn(),
    readAsDataURL: vi.fn(),
    readAsText: vi.fn(),
    result: null,
    error: null,
    onload: null,
    onerror: null,
    onabort: null,
    onloadstart: null,
    onloadend: null,
    onprogress: null,
    abort: vi.fn(),
    EMPTY: 0,
    LOADING: 1,
    DONE: 2,
    readyState: 0,
  };

  global.FileReader = vi.fn(() => mockFileReader) as never;
  return mockFileReader;
};

// Mock canvas context for waveform-related tests
export const mockCanvasContext = () => {
  const mockContext = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
  };

  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext) as never;
  return mockContext;
};

// Wait for element to be removed from document
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.body.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Fallback timeout
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 5000);
  });
};

// Create mock audio file
export const createMockAudioFile = (name = "test-audio.mp3") => {
  return new File(["mock audio content"], name, {
    type: "audio/mpeg",
    lastModified: Date.now(),
  });
};

// Create mock waveform data
export const createMockWaveformData = (length = 1000) => {
  return Array.from({ length }, (_, i) => Math.sin(i * 0.01) * 0.5);
};

// Helper to simulate audio loading
export const simulateAudioLoad = async (audioElement: HTMLAudioElement) => {
  Object.defineProperty(audioElement, "duration", {
    value: 180, // 3 minutes
    writable: true,
  });
  Object.defineProperty(audioElement, "readyState", {
    value: 4, // HAVE_ENOUGH_DATA
    writable: true,
  });

  audioElement.dispatchEvent(new Event("loadedmetadata"));
  audioElement.dispatchEvent(new Event("canplay"));
};

// Helper to simulate keyboard shortcuts
export const simulateKeyboardShortcut = async (
  user: ReturnType<typeof userEvent.setup>,
  shortcut: string,
) => {
  await user.keyboard(shortcut);
};

// Assert element has focus
export const expectToHaveFocus = (element: HTMLElement) => {
  expect(element).toHaveFocus();
};

// Assert element is visible
export const expectToBeVisible = (element: HTMLElement) => {
  expect(element).toBeVisible();
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { userEvent };

// Override the default render with our custom render
export { customRender as render };
