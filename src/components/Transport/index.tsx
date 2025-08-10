import {
	ArrowBigLeft,
	ArrowBigLeftDash,
	ArrowBigRight,
	ArrowBigRightDash,
	Pause,
	Play,
} from "lucide-react";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { BarContainer } from "../Container/BarContainer";

export interface TransportProps {
	playPause: () => void;
	isPlaying: boolean;
	nextPoint: () => void;
	previousPoint: () => void;
	start: () => void;
	end: () => void;
}

export const Transport = ({
	playPause,
	isPlaying,
	nextPoint,
	previousPoint,
	start,
	end,
}: TransportProps) => {
	return (
		<BarContainer>
			<ButtonGroup>
				<Button type="button" onClick={start} title="Start">
					<ArrowBigLeftDash />
				</Button>

				<Button type="button" onClick={previousPoint} title="Next Point">
					<ArrowBigLeft />
				</Button>

				<Button type="button" onClick={playPause}>
					{isPlaying ? <Pause /> : <Play />}
				</Button>

				<Button type="button" onClick={nextPoint} title="Previous Point">
					<ArrowBigRight />
				</Button>

				<Button type="button" onClick={end} title="End">
					<ArrowBigRightDash />
				</Button>
			</ButtonGroup>
		</BarContainer>
	);
};
