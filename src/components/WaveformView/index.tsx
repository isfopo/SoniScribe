import styles from "./index.module.css";

export interface WaveformViewProps {
  viewRef: React.RefObject<HTMLDivElement | null>;
  overviewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * WaveformView component that renders a div element for displaying the waveform using Peaks.js.
 */
export const WaveformView = ({ viewRef, overviewRef }: WaveformViewProps) => {
  return (
    <div>
      <div ref={viewRef} className={styles["waveform-container"]}></div>
      <div ref={overviewRef} className={styles["overview-container"]}></div>
    </div>
  );
};
