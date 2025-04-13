import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";
import { useSettingsStore } from "./stores/settings";
import "./App.css";
import { WaveformView } from "./components/WaveformView";
import { useRef } from "react";
import { DragAndDropDialog } from "./components/Dialogs/DragAndDropDialog";
import { useFs } from "use-fs";

function App() {
  const { subdivision, setSubdivision } = useSettingsStore();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const { files, isBrowserSupported, writeFile } = useFs();

  const {
    viewRef,
    audioElementRef,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    isPlaying,
    initialize,
    file,
  } = usePeaks({
    subdivision,
    onInitialize: async (peaks, file) => {
      await writeFile(
        `${file.name}-${crypto.randomUUID()}.json`,
        JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,

          data: peaks.getWaveformData().toJSON(),
          points: peaks.points.getPoints(),
        }),
        {
          create: true,
          truncate: true,
        }
      );
    },
  });

  useKeyPress({
    keymap: {
      Space: playPause,
      ArrowLeft: previousPoint,
      ArrowRight: nextPoint,
      KeyQ: () => addPoint({ subdivision: 1 }),
      KeyW: () => addPoint({ subdivision: 2 }),
      KeyE: () => addPoint({ subdivision: 4 }),
      KeyR: () => addPoint({ subdivision: 8 }),
      KeyT: () => addPoint({ subdivision: 16 }),
      KeyY: () => addPoint({ subdivision: 32 }),
      KeyU: () => addPoint({ subdivision: 64 }),
    },
  });

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("audio/")) {
        initialize(file);
        dialogRef.current?.close();
      } else {
        console.error("Invalid file type. Please drop an audio file.");
      }
    }
  };

  if (!isBrowserSupported) {
    return <div>Browser not supported</div>;
  }

  return (
    <>
      <button onClick={() => openDialog()}>New</button>

      <DragAndDropDialog dialogRef={dialogRef} onDrop={handleDrop} />

      <WaveformView viewRef={viewRef} />
      <audio ref={audioElementRef}>
        <source
          src={file ? URL.createObjectURL(file) : undefined}
          type={file?.type}
        />
        Your browser does not support the audio element.
      </audio>
      <Transport
        playPause={playPause}
        nextPoint={nextPoint}
        previousPoint={previousPoint}
        isPlaying={isPlaying}
        addPoint={() => addPoint({ subdivision })}
      />
      <SubdivisionSelector
        subdivisions={[1, 2, 4, 8, 16, 32, 64]}
        currentSubdivision={subdivision}
        onSelect={setSubdivision}
      />
    </>
  );
}

export default App;
