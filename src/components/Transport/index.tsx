import { Play, Pause, ArrowBigRightDash, ArrowBigLeftDash } from "lucide-react";
import { Button } from "../Button";

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
    <div>
      <h2>{title}</h2>
      <Button type="button" onClick={previousPoint} title="Next Point">
        <ArrowBigLeftDash />
      </Button>
      <Button type="button" onClick={playPause}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button type="button" onClick={nextPoint} title="Previous Point">
        <ArrowBigRightDash />
      </Button>
    </div>
  );
};
