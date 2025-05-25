import Peaks, {
  PeaksInstance,
  PeaksOptions,
  Point,
  PointClickEvent,
  Segment,
  SegmentClickEvent,
  SegmentOptions,
} from "peaks.js";
import { useRef, useState, useCallback } from "react";
import {
  isSubdivision,
  Subdivision,
  SubdivisionPoint,
  SubdivisionPointOptions,
  SubdivisionPoints,
} from "../../helpers/subdivisions";
import { SavedProjectData } from "../useProjects";
import { useTheme } from "../../theme/useTheme";
import { useEventListener } from "../useEventListener";
import { useSections } from "./useSections";
import { usePeaksListener } from "./usePeaksListener";
import { nanoid } from "nanoid";

export interface InitializePeaksOptions {
  points?: SubdivisionPointOptions[];
  segments?: SegmentOptions[];
  isNewProject?: boolean;
}

export interface UsePeaksOptions {
  /** The amount of time that the previous point will go back to the one before. */
  previousPointGap?: number;
  /** The subdivision to use for the points. */
  subdivision?: Subdivision;
  /** Callback function to be called when Peaks is initialized. */
  onInitialize?: (
    peaks: PeaksInstance,
    mediaFile: File,
    { isNewProject }: { isNewProject: boolean }
  ) => void;
  /** Callback function to be called when a point is added. */
  onOpen?: (project: FileSystemFileHandle) => void;
  /** Callback function to be called when a point is added. */
  onPointAdd?: (point: Point[]) => void;
  /** Callback function to be called when a point is removed. */
  onPointRemove?: (point: Point[]) => void;
  /** Callback function to be called when a point is updated. */
  onPointUpdate?: (point: Point) => void;
  /** Callback function to be called when a point is double clicked. */
  onPointDoubleClick?: (event: PointClickEvent) => void;
  /** Callback function to be called when a point is right clicked. */
  onPointContextMenu?: (event: PointClickEvent, peaks: PeaksInstance) => void;
  /** Callback function to be called when a segment is added. */
  onSegmentAdd?: (segment: Segment[]) => void;
  /** Callback function to be called when a segment is removed. */
  onSegmentRemove?: (segment: Segment[]) => void;
  /** Callback function to be called when a segment is updated. */
  onSegmentUpdate?: (segment: Segment) => void;
  /** Callback function to be called when a segment is right clicked. */
  onSegmentContextMenu?: (
    event: SegmentClickEvent,
    peaks: PeaksInstance
  ) => void;
  /** Callback function to be called when an error occurs. */
  onError?: (error: Error) => void;
}

/**
 * Custom hook to manage Peaks.js instance and audio playback.
 * It provides functions to initialize Peaks, play/pause audio, add points, and navigate through points.
 */
export const usePeaks = ({
  previousPointGap = 0.1,
  subdivision = 1,
  onInitialize,
  onPointAdd,
  onPointRemove,
  onPointUpdate,
  onPointDoubleClick,
  onPointContextMenu,
  onSegmentAdd,
  onSegmentRemove,
  onSegmentUpdate,
  onSegmentContextMenu,
  onError,
}: UsePeaksOptions) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext>(new AudioContext());
  const peaksRef = useRef<PeaksInstance>(undefined);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const localFileRef = useRef<File | null>(null);

  const { addSegment } = useSections(peaksRef);

  const {
    scheme: { onBackground },
  } = useTheme();

  const handleError = (error: Error) => {
    console.error(error.message);
    if (onError) {
      onError(error);
    }
  };

  /**
   * Initializes Peaks.js with the given media file and options.
   * @param mediaFile The media file to be played.
   * @param options The options to be passed to Peaks.js.
   * @param options.points The points to be added to the Peaks instance.
   * @param options.isNewProject Whether the project is new or not.
   * @returns void
   * @throws Error if Peaks.js fails to initialize.
   * @throws Error if the media file is not provided.
   * @throws Error if the audio element is not found.
   */
  const initialize = useCallback(
    (
      mediaFile: File,
      { points, segments, isNewProject }: InitializePeaksOptions = {
        points: [],
        segments: [],
        isNewProject: false,
      }
    ) => {
      const options: PeaksOptions = {
        waveformColor: onBackground,
        playheadColor: onBackground,
        axisLabelColor: onBackground,
        axisGridlineColor: onBackground,
        showAxisLabels: true,
        fontFamily: "Quicksand",
        segmentOptions: {
          overlayFontSize: 18,
          overlayFontFamily: "Quicksand",
          overlayLabelColor: onBackground,
          overlayBorderWidth: 0,
          overlay: true,
        },
        zoomview: {
          container: viewRef.current,
          autoScrollOffset: 50,
          segmentOptions: {
            overlay: true,
            overlayFontStyle: "bold",
            overlayLabelVerticalAlign: "middle",
            markers: true,
            overlayLabelAlign: "left",
          },
        },
        overview: {
          container: overviewRef.current,
          segmentOptions: {
            overlay: true,
            overlayFontSize: 14,
            overlayFontStyle: "bold",
            overlayLabelVerticalAlign: "top",
            markers: true,
            overlayLabelAlign: "left",
            overlayCornerRadius: 0,
            overlayLabelPadding: 0,
            overlayOffset: 0,
          },
        },
        formatAxisTime: (time) => {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time % 60);
          return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        },
        mediaElement: audioElementRef.current as Element,
        webAudio: { audioContext: audioContext.current, multiChannel: true },
        keyboard: false,
        logger: console.error.bind(console),
        points,
        segments,
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

        peaks.on("points.add", (event) => {
          if (onPointAdd) {
            onPointAdd(event.points as SubdivisionPoint[]);
          }
        });

        peaks.on("points.dragend", (event) => {
          if (onPointUpdate) {
            onPointUpdate(event.point);
          }
        });

        peaks.on("points.remove", (event) => {
          if (onPointRemove) {
            onPointRemove(event.points as SubdivisionPoint[]);
          }
        });

        peaks.on("segments.add", (event) => {
          if (onSegmentAdd) {
            onSegmentAdd(event.segments);
          }
        });

        peaks.on("segments.remove", (event) => {
          if (onSegmentRemove) {
            onSegmentRemove(event.segments);
          }
        });

        peaks.on("segments.dragend", (event) => {
          if (onSegmentUpdate) {
            onSegmentUpdate(event.segment);
          }
        });

        peaksRef.current = peaks;
        setMediaFile(mediaFile);
        localFileRef.current = mediaFile;

        if (onInitialize) {
          onInitialize(peaks, mediaFile, {
            isNewProject: isNewProject ?? false,
          });
        }
      });
    },
    [
      onBackground,
      onError,
      onInitialize,
      onPointAdd,
      onPointRemove,
      onPointUpdate,
      onSegmentAdd,
      onSegmentRemove,
      onSegmentUpdate,
    ]
  );

  usePeaksListener(peaksRef, {
    event: "points.dblclick",
    on: (event) => {
      if (onPointDoubleClick) {
        onPointDoubleClick(event);
      }
    },
  });

  usePeaksListener(peaksRef, {
    event: "points.contextmenu",
    on: (event) => {
      if (onPointContextMenu) {
        onPointContextMenu(event, peaksRef.current as PeaksInstance);
      }
    },
  });

  usePeaksListener(peaksRef, {
    event: "segments.contextmenu",
    on: (event) => {
      if (onSegmentContextMenu) {
        onSegmentContextMenu(event, peaksRef.current as PeaksInstance);
      }
    },
  });

  const reinitialize = useCallback(() => {
    if (peaksRef.current && localFileRef.current) {
      const points = peaksRef.current.points.getPoints() as SubdivisionPoint[];
      const segments = peaksRef.current.segments.getSegments();
      initialize(localFileRef.current, { points, segments });
    }
  }, [initialize]);

  useEventListener({
    event: "resize",
    callback: () => {
      if (peaksRef.current) {
        reinitialize();
      }
    },
    debounce: 500,
  });

  /**
   * Opens a file using the File System Access API.
   * @param file The file to be opened.
   * @returns void
   */
  const open = useCallback(
    async (file: FileSystemHandle) => {
      if (file.kind === "file") {
        const fileHandle = file as FileSystemFileHandle;

        const saveData = await fileHandle.getFile();
        const { points, segments, media } = JSON.parse(
          await saveData.text()
        ) as SavedProjectData;

        const root = await navigator.storage.getDirectory();
        const mediaFileHandle = await root.getFileHandle(media);

        initialize(await mediaFileHandle.getFile(), {
          points,
          segments,
          isNewProject: false,
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

  /**
   * Plays or pauses the audio playback.
   * @returns void
   */
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

  /**
   * Adds a point to the Peaks instance.
   * @param subdivision The subdivision to be added.
   * @returns void
   */
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
        id: nanoid(),
        subdivision: subdivision,
        ...SubdivisionPoints[subdivision],
      });
    }
  };

  /**
   * Seeks to the next point in the Peaks instance.
   * @returns void
   */
  const nextPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints() as SubdivisionPoint[];
      const currentTime = peaksRef.current.player.getCurrentTime();

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

  /**
   * Seeks to the previous point in the Peaks instance.
   * @returns void
   */
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

  /**
   * Sets the playback rate of the audio element.
   * @param rate The playback rate to be set (between 0.5 and 2).
   * @returns void
   */
  const setPlaybackRate = (rate: 0.25 | 0.5 | 0.75 | 1) => {
    if (!audioElementRef.current) {
      handleError(new Error("Audio element not found"));
      return;
    }

    audioElementRef.current.playbackRate = rate;
  };

  return {
    peaksRef,
    viewRef,
    overviewRef,
    audioElementRef,
    isPlaying,
    mediaFile,
    open,
    initialize,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    addSegment,
    setPlaybackRate,
  };
};
