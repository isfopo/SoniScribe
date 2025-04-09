import {
  Play,
  Pause,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  ArrowDownToDot,
} from "lucide-react";

export interface TransportProps {
  playPause: () => void;
  isPlaying: boolean;
  nextPoint: () => void;
  previousPoint: () => void;
  addPoint: () => void;
}

export const Transport = ({
  playPause,
  isPlaying,
  nextPoint,
  previousPoint,
  addPoint,
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
      <button type="button" onClick={addPoint} title="Previous Point">
        <ArrowDownToDot />
      </button>
    </div>
  );
};
