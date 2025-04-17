import styles from "./index.module.css";

export interface WaveformViewProps {
  viewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * WaveformView component that renders a div element for displaying the waveform using Peaks.js.
 */
export const WaveformView = ({ viewRef }: WaveformViewProps) => {
  return <div ref={viewRef} className={styles["waveform-container"]}></div>;
};
