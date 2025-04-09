import { Play, Pause, ArrowBigRightDash, ArrowBigLeftDash } from "lucide-react";

export interface TransportProps {
  playPause: () => void;
  isPlaying: boolean;
  nextPoint: () => void;
  previousPoint: () => void;
}

export const Transport = ({
  playPause,
  isPlaying,
  nextPoint,
  previousPoint,
}: TransportProps) => {
  return (
    <div>
      <button onClick={previousPoint} title="Next Point">
        <ArrowBigLeftDash />
      </button>
      <button onClick={playPause}>{isPlaying ? <Pause /> : <Play />}</button>
      <button onClick={nextPoint} title="Previous Point">
        <ArrowBigRightDash />
      </button>
    </div>
  );
};
