import Peaks, { PeaksInstance, PeaksOptions, Point } from "peaks.js";
import { useRef, useState, useCallback } from "react";
import {
  isSubdivision,
  Subdivision,
  SubdivisionPoint,
  SubdivisionPoints,
} from "../helpers/subdivisions";

export interface SavedProjectData {
  media: string;
  type: string;
  size: number;
  points: SubdivisionPoint[];
}

export interface UsePeaksOptions {
  /** The amount of time that the previous point will go back to the one before. */
  previousPointGap?: number;
  subdivision?: Subdivision;
  onInitialize?: (
    peaks: PeaksInstance,
    mediaFile: File,
    { isNewFile }: { isNewFile: boolean }
  ) => void;
  onPointAdd?: (point: SubdivisionPoint) => void;
  onPointRemove?: (point: SubdivisionPoint) => void;
  onError?: (error: Error) => void;
}

export const usePeaks = ({
  previousPointGap = 0.1,
  subdivision = 1,
  onInitialize,
  onError,
}: UsePeaksOptions) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext>(new AudioContext());
  const peaksRef = useRef<PeaksInstance>(undefined);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const initialize = useCallback(
    (
      mediaFile: File,
      { points, isNewFile }: { points?: Point[]; isNewFile?: boolean } = {
        points: [],
        isNewFile: false,
      }
    ) => {
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
        keyboard: false,
        logger: console.error.bind(console),
        points,
      };

      if (!audioElementRef.current) return;

      audioElementRef.current.src = URL.createObjectURL(mediaFile);

      if (peaksRef.current) {
        peaksRef.current.destroy();
        peaksRef.current = undefined;
      }

      Peaks.init(options, (error, peaks) => {
        if (error) {
          console.error("Error initializing Peaks:", error);
          if (onError) {
            onError(error);
          }
          return;
        }

        if (!peaks) {
          console.error("Failed to initialize Peaks.");
          if (onError) {
            onError(new Error("Failed to initialize Peaks."));
          }
          return;
        }

        peaksRef.current = peaks;
        setMediaFile(mediaFile);

        if (onInitialize) {
          onInitialize(peaks, mediaFile, { isNewFile: isNewFile ?? false });
        }
      });
    },
    [onError, onInitialize]
  );

  const open = useCallback(
    async (file: FileSystemHandle) => {
      if (file.kind === "file") {
        const fileHandle = file as FileSystemFileHandle;

        const saveData = await fileHandle.getFile();
        const { points, media } = JSON.parse(
          await saveData.text()
        ) as SavedProjectData;

        const root = await navigator.storage.getDirectory();
        const mediaFileHandle = await root.getFileHandle(media);

        initialize(await mediaFileHandle.getFile(), {
          points,
          isNewFile: false,
        });
      } else {
        console.error("Invalid file handle:", file);
        if (onError) {
          onError(new Error("Invalid file handle"));
        }
      }
    },
    [initialize, onError]
  );

  const playPause = () => {
    if (peaksRef.current) {
      const player = peaksRef.current.player;
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    }
  };

  const addPoint = ({
    subdivision,
  }: {
    subdivision: keyof typeof SubdivisionPoints;
  }) => {
    if (peaksRef.current) {
      const time = peaksRef.current.player.getCurrentTime();

      peaksRef.current.points.add({
        time: time,
        editable: true,
        id: `${subdivision}-${time}`,
        subdivision: subdivision,
        ...SubdivisionPoints[subdivision],
      });
    }
  };

  const nextPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints() as SubdivisionPoint[];
      const currentTime = peaksRef.current.player.getCurrentTime();
      console.log(points);

      const nextPoint = points.find(
        (point) =>
          isSubdivision(point.subdivision, subdivision) &&
          point.time > currentTime
      );

      if (nextPoint) {
        peaksRef.current.player.seek(nextPoint.time);
      } else {
        // If no next point is found, seek to the end of the audio
        peaksRef.current.player.seek(peaksRef.current.player.getDuration());
      }
    }
  };

  const previousPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints() as SubdivisionPoint[];
      const currentTime = peaksRef.current.player.getCurrentTime();
      const previousPoint = points
        .slice()
        .reverse()
        .find(
          (point) =>
            isSubdivision(point.subdivision, subdivision) &&
            point.time < currentTime - previousPointGap
        );

      if (previousPoint) {
        peaksRef.current.player.seek(previousPoint.time);
      } else {
        // If no previous point is found, seek to the beginning of the audio
        peaksRef.current.player.seek(0);
      }
    }
  };

  return {
    peaksRef,
    viewRef,
    audioElementRef,
    initialize,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    isPlaying,
    mediaFile,
    open,
  };
};
