import { ArrowBigLeftDash, ArrowBigRightDash, Pause, Play } from "lucide-react";
import { ButtonGroup } from "../ButtonGroup";
import { BarContainer } from "../Container/BarContainer";
import { Button } from "../ui/button";

export interface TransportProps {
	title: string;
	playPause: () => void;
	isPlaying: boolean;
	nextPoint: () => void;
	previousPoint: () => void;
}

export const Transport = ({
	title,
	playPause,
	isPlaying,
	nextPoint,
	previousPoint,
}: TransportProps) => {
	return (
		<BarContainer>
			<ButtonGroup>
				<Button type="button" onClick={previousPoint} title="Next Point">
					<ArrowBigLeftDash />
				</Button>
				<Button type="button" onClick={playPause}>
					{isPlaying ? <Pause /> : <Play />}
				</Button>
				<Button type="button" onClick={nextPoint} title="Previous Point">
					<ArrowBigRightDash />
				</Button>
			</ButtonGroup>
			<h2>{title}</h2>
		</BarContainer>
	);
};
