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
      zoomview: {
        container: viewRef.current,
        waveformColor: "#ddd",
        playheadColor: "#fff",
        autoScroll: true,
        enableSegments: false,
        autoScrollOffset: 1,
      },
      mediaElement: audioElementRef.current as Element,
      webAudio: { audioContext: audioContext.current, multiChannel: true },
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

  const addPoint = () => {
    if (peaksRef.current) {
      const time = peaksRef.current.player.getCurrentTime();

      peaksRef.current.points.add({
        time: time,
        editable: true,
      });
    }
  };

  const nextPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints();
      const currentTime = peaksRef.current.player.getCurrentTime();

      const nextPoint = points.find((point) => point.time > currentTime);

      if (nextPoint) {
        peaksRef.current.player.seek(nextPoint.time);
      }
    }
  };

  const previousPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints();
      const currentTime = peaksRef.current.player.getCurrentTime();
      const previousPoint = points
        .slice()
        .reverse()
        .find((point) => point.time < currentTime);

      if (previousPoint) {
        peaksRef.current.player.seek(previousPoint.time);
      }
    }
  };

  return (
    <div>
      <div ref={viewRef} className={styles["waveform-container"]}></div>
      <audio ref={audioElementRef} controls>
        <source src={audioUrl} type={audioContentType} />
        Your browser does not support the audio element.
      </audio>
      <div className={styles["controls"]}>
        <button onClick={addPoint}>Add Point</button>
        <button onClick={nextPoint}>Next Point</button>
        <button onClick={previousPoint}>Previous Point</button>
      </div>
    </div>
  );
};
