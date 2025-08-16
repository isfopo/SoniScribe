import {
	PauseIcon,
	PlayIcon,
	SkipBackIcon,
	SkipForwardIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TransportProps {
	isPlaying: boolean;
	playPause: () => void;
	nextPoint: () => void;
	previousPoint: () => void;
}

export const Transport = ({
	isPlaying,
	playPause,
	nextPoint,
	previousPoint,
}: TransportProps) => {
	return (
		<div className="divide-primary-foreground/30 inline-flex w-fit divide-x rounded-full shadow-xs">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={previousPoint}
						className="rounded-none rounded-s-full shadow-none focus-visible:z-10"
					>
						<SkipBackIcon />
						<span className="sr-only">Previous Point</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">
					Previous Point
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={playPause}
						className="rounded-none shadow-none focus-visible:z-10"
					>
						{isPlaying ? <PauseIcon /> : <PlayIcon />}
						<span className="sr-only">Play</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">Play</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={nextPoint}
						className="rounded-none rounded-e-full shadow-none focus-visible:z-10"
					>
						<SkipForwardIcon />
						<span className="sr-only">Next Point</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">
					Next Point
				</TooltipContent>
			</Tooltip>
		</div>
	);
};
