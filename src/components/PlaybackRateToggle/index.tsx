import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PlaybackRateToggleProps {
	setPlaybackRate: (rate: number) => void;
}

const PlaybackRateToggle = ({ setPlaybackRate }: PlaybackRateToggleProps) => {
	return (
		<ToggleGroup type="single">
			<ToggleGroupItem
				onClick={() => setPlaybackRate(0.5)}
				value="0.5"
				aria-label="0.5 Playback Rate"
			>
				0.5
			</ToggleGroupItem>
			<ToggleGroupItem
				onClick={() => setPlaybackRate(0.75)}
				value="0.75"
				aria-label="0.75 Playback Rate"
			>
				0.75
			</ToggleGroupItem>
			<ToggleGroupItem
				onClick={() => setPlaybackRate(1.0)}
				value="1.0"
				aria-label="1.0 Playback Rate"
			>
				1.0
			</ToggleGroupItem>
		</ToggleGroup>
	);
};

export default PlaybackRateToggle;
