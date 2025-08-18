import { describe, it, expect,, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Transport } from "@/components/Transport";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useState } from "react";

// Integration test component that combines Transport with keyboard shortcuts
const TransportWithKeyboardShortcuts = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [nextCount, setNextCount] = useState(0);

  const playPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextPoint = () => {
    setNextCount((prev) => prev + 1);
  };

  const previousPoint = () => {
    setPreviousCount((prev) => prev + 1);
  };

  // Set up keyboard shortcuts
  useKeyPress({
    keymap: {
      Space: playPause,
      ArrowLeft: previousPoint,
      ArrowRight: nextPoint,
      KeyP: playPause,
    },
  });

  return (
    <div>
      <h1>Audio Player</h1>
      <Transport
        isPlaying={isPlaying}
        playPause={playPause}
        nextPoint={nextPoint}
        previousPoint={previousPoint}
      />
      <div data-testid="playback-status">
        {isPlaying ? "Playing" : "Paused"}
      </div>
      <div data-testid="previous-count">{previousCount}</div>
      <div data-testid="next-count">{nextCount}</div>
    </div>
  );
};

describe("Transport with Keyboard Shortcuts Integration", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders transport controls with proper initial state", () => {
    render(<TransportWithKeyboardShortcuts />);

    expect(
      screen.getByRole("button", { name: /previous point/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next point/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("playback-status")).toHaveTextContent("Paused");
    expect(screen.getByTestId("previous-count")).toHaveTextContent("0");
    expect(screen.getByTestId("next-count")).toHaveTextContent("0");
  });

  it("toggles play state when clicking play/pause button", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const playButton = screen.getByRole("button", { name: /play/i });
    const statusDisplay = screen.getByTestId("playback-status");

    // Initially paused
    expect(statusDisplay).toHaveTextContent("Paused");

    // Click to play
    await user.click(playButton);
    expect(statusDisplay).toHaveTextContent("Playing");

    // Click to pause
    await user.click(playButton);
    expect(statusDisplay).toHaveTextContent("Paused");
  });

  it("toggles play state with Space key", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const statusDisplay = screen.getByTestId("playback-status");

    // Initially paused
    expect(statusDisplay).toHaveTextContent("Paused");

    // Press Space to play
    await user.keyboard(" ");
    expect(statusDisplay).toHaveTextContent("Playing");

    // Press Space to pause
    await user.keyboard(" ");
    expect(statusDisplay).toHaveTextContent("Paused");
  });

  it("toggles play state with P key", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const statusDisplay = screen.getByTestId("playback-status");

    // Press P to play
    await user.keyboard("p");
    expect(statusDisplay).toHaveTextContent("Playing");

    // Press P to pause
    await user.keyboard("p");
    expect(statusDisplay).toHaveTextContent("Paused");
  });

  it("triggers previous point with left arrow key", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const countDisplay = screen.getByTestId("previous-count");
    expect(countDisplay).toHaveTextContent("0");

    // Press left arrow
    await user.keyboard("{ArrowLeft}");
    expect(countDisplay).toHaveTextContent("1");

    // Press left arrow again
    await user.keyboard("{ArrowLeft}");
    expect(countDisplay).toHaveTextContent("2");
  });

  it("triggers next point with right arrow key", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const countDisplay = screen.getByTestId("next-count");
    expect(countDisplay).toHaveTextContent("0");

    // Press right arrow
    await user.keyboard("{ArrowRight}");
    expect(countDisplay).toHaveTextContent("1");

    // Press right arrow again
    await user.keyboard("{ArrowRight}");
    expect(countDisplay).toHaveTextContent("2");
  });

  it("triggers actions when clicking buttons", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const previousButton = screen.getByRole("button", {
      name: /previous point/i,
    });
    const nextButton = screen.getByRole("button", { name: /next point/i });
    const previousCountDisplay = screen.getByTestId("previous-count");
    const nextCountDisplay = screen.getByTestId("next-count");

    // Click previous button
    await user.click(previousButton);
    expect(previousCountDisplay).toHaveTextContent("1");

    // Click next button
    await user.click(nextButton);
    expect(nextCountDisplay).toHaveTextContent("1");
  });

  it("handles both button clicks and keyboard shortcuts simultaneously", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const playButton = screen.getByRole("button", { name: /play/i });
    const statusDisplay = screen.getByTestId("playback-status");

    // Start with keyboard
    await user.keyboard(" ");
    expect(statusDisplay).toHaveTextContent("Playing");

    // Toggle with button
    await user.click(playButton);
    expect(statusDisplay).toHaveTextContent("Paused");

    // Toggle with different keyboard shortcut
    await user.keyboard("p");
    expect(statusDisplay).toHaveTextContent("Playing");

    // Toggle with button again
    await user.click(playButton);
    expect(statusDisplay).toHaveTextContent("Paused");
  });

  it("handles multiple different shortcuts correctly", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const statusDisplay = screen.getByTestId("playback-status");
    const previousCountDisplay = screen.getByTestId("previous-count");
    const nextCountDisplay = screen.getByTestId("next-count");

    // Use space to play
    await user.keyboard(" ");
    expect(statusDisplay).toHaveTextContent("Playing");

    // Use arrow keys for navigation
    await user.keyboard("{ArrowLeft}");
    expect(previousCountDisplay).toHaveTextContent("1");

    await user.keyboard("{ArrowRight}");
    expect(nextCountDisplay).toHaveTextContent("1");

    // Use P to pause
    await user.keyboard("p");
    expect(statusDisplay).toHaveTextContent("Paused");
  });

  it("shows correct icon based on playing state", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const playButton = screen.getByRole("button", { name: /play/i });

    // Should show play icon initially (when paused)
    expect(playButton.querySelector("svg")).toBeInTheDocument();

    // Toggle to playing state
    await user.keyboard(" ");
    expect(screen.getByTestId("playback-status")).toHaveTextContent("Playing");

    // Icon should change (though we can't easily test the specific icon,
    // we can test that the button is still there and functional)
    expect(playButton).toBeInTheDocument();

    // Toggle back to paused
    await user.keyboard(" ");
    expect(screen.getByTestId("playback-status")).toHaveTextContent("Paused");
  });

  it("maintains state consistency across different interaction methods", async () => {
    render(<TransportWithKeyboardShortcuts />);

    const playButton = screen.getByRole("button", { name: /play/i });
    const previousButton = screen.getByRole("button", {
      name: /previous point/i,
    });
    const nextButton = screen.getByRole("button", { name: /next point/i });

    const statusDisplay = screen.getByTestId("playback-status");
    const previousCountDisplay = screen.getByTestId("previous-count");
    const nextCountDisplay = screen.getByTestId("next-count");

    // Mix of keyboard and button interactions
    await user.keyboard(" "); // Play via keyboard
    expect(statusDisplay).toHaveTextContent("Playing");

    await user.click(previousButton); // Previous via button
    expect(previousCountDisplay).toHaveTextContent("1");

    await user.keyboard("{ArrowRight}"); // Next via keyboard
    expect(nextCountDisplay).toHaveTextContent("1");

    await user.click(playButton); // Pause via button
    expect(statusDisplay).toHaveTextContent("Paused");

    // All counters and states should be maintained correctly
    expect(previousCountDisplay).toHaveTextContent("1");
    expect(nextCountDisplay).toHaveTextContent("1");
  });
});
