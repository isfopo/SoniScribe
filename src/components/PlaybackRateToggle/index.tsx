import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PlaybackRateToggleProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

const PlaybackRateToggle = ({
  playbackRate,
  setPlaybackRate,
}: PlaybackRateToggleProps) => {
  return (
    <ToggleGroup type="single" value={playbackRate.toString()}>
      <ToggleGroupItem
        onClick={() => setPlaybackRate(0.5)}
        value="0.5"
        aria-label="50% Playback Rate"
      >
        50%
      </ToggleGroupItem>
      <ToggleGroupItem
        onClick={() => setPlaybackRate(0.75)}
        value="0.75"
        aria-label="75% Playback Rate"
      >
        75%
      </ToggleGroupItem>
      <ToggleGroupItem
        onClick={() => setPlaybackRate(1.0)}
        value="1"
        aria-label="100% Playback Rate"
      >
        100%
      </ToggleGroupItem>
      <ToggleGroupItem
        onClick={() => setPlaybackRate(1.25)}
        value="1.25"
        aria-label="125% Playback Rate"
      >
        125%
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default PlaybackRateToggle;
