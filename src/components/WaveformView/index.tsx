import Peaks, { PeaksInstance, PeaksOptions } from "peaks.js";
import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export interface WaveformViewProps {
  audioUrl: string;
  audioContentType: string;
}

export const WaveformView = ({
  audioUrl,
  audioContentType,
}: WaveformViewProps) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext>(new AudioContext());
  const peaksRef = useRef<PeaksInstance>(undefined);

  useEffect(() => {
    const options: PeaksOptions = {
      overview: {
        container: viewRef.current,
      },
      mediaElement: audioElementRef.current as Element,
      webAudio: { audioContext: audioContext.current },
      keyboard: true,
      logger: console.error.bind(console),
      // createSegmentMarker: createSegmentMarker,
      // createSegmentLabel: createSegmentLabel,
      // createPointMarker: createPointMarker
    };

    if (!audioElementRef.current) return;

    audioElementRef.current.src = audioUrl;

    if (peaksRef.current) {
      peaksRef.current.destroy();
      peaksRef.current = undefined;
    }

    Peaks.init(options, (error, peaks) => {
      if (error) {
        console.error("Error initializing Peaks:", error);
        return;
      }

      peaksRef.current = peaks;

      // Add any additional setup or event listeners here
    });
  }, [audioUrl]);

  return (
    <div>
      <div ref={viewRef} className={styles["waveform-container"]}></div>
      <audio ref={audioElementRef} controls>
        <source src={audioUrl} type={audioContentType} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
