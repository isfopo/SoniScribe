export interface WaveformViewProps {
  viewRef: React.RefObject<HTMLDivElement | null>;
  overviewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * WaveformView component that renders a div element for displaying the waveform using Peaks.js.
 */
export const WaveformView = ({ viewRef, overviewRef }: WaveformViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div
        ref={viewRef}
        className="w-full h-96 cursor-grab active:cursor-grabbing"
      ></div>
      <div
        ref={overviewRef}
        className="w-full h-32 cursor-grab active:cursor-grabbing"
      ></div>
    </div>
  );
};
