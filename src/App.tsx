import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";
import { useSettingsStore } from "./stores/settings";
import "./App.css";
import { WaveformView } from "./components/WaveformView";
import { useRef, useState } from "react";
import { DragAndDropDialog } from "./components/Dialogs/DragAndDropDialog";

function App() {
  const { subdivision, setSubdivision } = useSettingsStore();

  const [file, setFile] = useState<File | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const {
    viewRef,
    audioElementRef,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    isPlaying,
    initialize,
  } = usePeaks({
    audioUrl: "/audio/brand-new-bike.mp3",
    audioContentType: "audio/mpeg",
    subdivision,
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
        setFile(file);
        initialize(URL.createObjectURL(file));
        dialogRef.current?.close();
      } else {
        console.error("Invalid file type. Please drop an audio file.");
      }
    }
  };

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
