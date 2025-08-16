import {
	BackIcon,
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
		<div className="divide-primary-foreground/30 inline-flex w-fit divide-x rounded-full shadow-xs">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={start}
						className="rounded-none rounded-s-full shadow-none focus-visible:z-10"
					>
						<SkipBackIcon />
						<span className="sr-only">To Start</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">To Start</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={previousPoint}
						className="rounded-none shadow-none focus-visible:z-10"
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
						className="rounded-none shadow-none focus-visible:z-10"
					>
						<SkipForwardIcon />
						<span className="sr-only">Next Point</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">
					Next Point
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={end}
						className="rounded-none rounded-e-full shadow-none focus-visible:z-10"
					>
						<SkipForwardIcon />
						<span className="sr-only">End</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">
					Skip Forward
				</TooltipContent>
			</Tooltip>
		</div>
	);
};
