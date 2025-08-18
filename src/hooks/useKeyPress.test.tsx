import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyPress } from './useKeyPress';

describe('useKeyPress', () => {
  let mockKeymap: Record<string, () => void>;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockKeymap = {
      Space: vi.fn(),
      Enter: vi.fn(),
      Escape: vi.fn(),
      KeyS: vi.fn(),
      KeyP: vi.fn(),
    };

    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adds keydown event listener on mount', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });

  it('removes keydown event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyPress({ keymap: mockKeymap }));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });

  it('calls the correct function when a mapped key is pressed', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    // Simulate Space key press
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      window.dispatchEvent(event);
    });

    expect(mockKeymap.Space).toHaveBeenCalledTimes(1);
    expect(mockKeymap.Enter).not.toHaveBeenCalled();
    expect(mockKeymap.Escape).not.toHaveBeenCalled();
  });

  it('calls multiple different functions for different keys', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    // Simulate Enter key press
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      window.dispatchEvent(event);
    });

    // Simulate KeyS press
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'KeyS' });
      window.dispatchEvent(event);
    });

    expect(mockKeymap.Enter).toHaveBeenCalledTimes(1);
    expect(mockKeymap.KeyS).toHaveBeenCalledTimes(1);
    expect(mockKeymap.Space).not.toHaveBeenCalled();
  });

  it('does not call any function for unmapped keys', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'KeyZ' });
      window.dispatchEvent(event);
    });

    Object.values(mockKeymap).forEach(fn => {
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('prevents default behavior for mapped keys', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    const event = new KeyboardEvent('keydown', { code: 'Space' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does not prevent default behavior for unmapped keys', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    const event = new KeyboardEvent('keydown', { code: 'KeyZ' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('updates keymap when it changes', () => {
    const initialKeymap = {
      Space: vi.fn(),
    };

    const { rerender } = renderHook(
      ({ keymap }) => useKeyPress({ keymap }),
      { initialProps: { keymap: initialKeymap } }
    );

    // Test initial keymap
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      window.dispatchEvent(event);
    });

    expect(initialKeymap.Space).toHaveBeenCalledTimes(1);

    // Update keymap
    const updatedKeymap = {
      Enter: vi.fn(),
    };

    rerender({ keymap: updatedKeymap });

    // Test that old keymap no longer works
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      window.dispatchEvent(event);
    });

    expect(initialKeymap.Space).toHaveBeenCalledTimes(1); // Still 1, not called again

    // Test that new keymap works
    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      window.dispatchEvent(event);
    });

    expect(updatedKeymap.Enter).toHaveBeenCalledTimes(1);
  });

  it('handles empty keymap', () => {
    const emptyKeymap = {};

    expect(() => {
      renderHook(() => useKeyPress({ keymap: emptyKeymap }));
    }).not.toThrow();

    // Should still add event listener
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });

  it('handles multiple rapid key presses', () => {
    renderHook(() => useKeyPress({ keymap: mockKeymap }));

    act(() => {
      // Rapid fire Space key presses
      for (let i = 0; i < 5; i++) {
        const event = new KeyboardEvent('keydown', { code: 'Space' });
        window.dispatchEvent(event);
      }
    });

    expect(mockKeymap.Space).toHaveBeenCalledTimes(5);
  });

  it('handles case-sensitive key codes correctly', () => {
    const caseSensitiveKeymap = {
      'KeyA': vi.fn(),
      'keya': vi.fn(), // Different case
    };

    renderHook(() => useKeyPress({ keymap: caseSensitiveKeymap }));

    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'KeyA' });
      window.dispatchEvent(event);
    });

    expect(caseSensitiveKeymap.KeyA).toHaveBeenCalledTimes(1);
    expect(caseSensitiveKeymap.keya).not.toHaveBeenCalled();
  });

  it('creates stable event handler when keymap reference changes but content is same', () => {
    const keymap1 = { Space: vi.fn() };
    const keymap2 = { Space: vi.fn() };

    const { rerender } = renderHook(
      ({ keymap }) => useKeyPress({ keymap }),
      { initialProps: { keymap: keymap1 } }
    );

    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender({ keymap: keymap2 });

    // Should have added a new event listener due to keymap reference change
    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  describe('audio player shortcuts integration', () => {
    it('handles common audio player shortcuts', () => {
      const audioKeymap = {
        Space: vi.fn(), // Play/pause
        ArrowLeft: vi.fn(), // Seek backward
        ArrowRight: vi.fn(), // Seek forward
        ArrowUp: vi.fn(), // Volume up
        ArrowDown: vi.fn(), // Volume down
        KeyM: vi.fn(), // Mute
        KeyF: vi.fn(), // Fullscreen
      };

      renderHook(() => useKeyPress({ keymap: audioKeymap }));

      // Test multiple shortcuts
      const shortcuts = [
        'Space',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'KeyM',
        'KeyF'
      ];

      shortcuts.forEach(shortcut => {
        act(() => {
          const event = new KeyboardEvent('keydown', { code: shortcut });
          window.dispatchEvent(event);
        });

        expect(audioKeymap[shortcut]).toHaveBeenCalledTimes(1);
      });
    });
  });
});
