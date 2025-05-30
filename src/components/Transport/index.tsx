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
      <button type="button" onClick={previousPoint} title="Next Point">
        <ArrowBigLeftDash />
      </button>
      <button type="button" onClick={playPause}>
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <button type="button" onClick={nextPoint} title="Previous Point">
        <ArrowBigRightDash />
      </button>
    </div>
  );
};
