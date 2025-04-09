import styles from "./index.module.css";

export interface WaveformViewProps {
  viewRef: React.RefObject<HTMLDivElement | null>;
}

export const WaveformView = ({ viewRef }: WaveformViewProps) => {
  return <div ref={viewRef} className={styles["waveform-container"]}></div>;
};
