import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { SavedProjectData, usePeaks } from "./hooks/usePeaks";
import { useSettingsStore } from "./stores/settings";
import { WaveformView } from "./components/WaveformView";
import { useRef } from "react";
import { DragAndDropDialog } from "./components/Dialogs/DragAndDropDialog";
import { useFileSystem } from "./hooks/useFileSystem";
import { stripExtension } from "./helpers/files";
import "./App.css";

function App() {
  const { subdivision, setSubdivision } = useSettingsStore();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const { write, entries, remove } = useFileSystem({});

  const {
    viewRef,
    audioElementRef,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    isPlaying,
    initialize,
    open,
    file,
  } = usePeaks({
    subdivision,
    onInitialize: async (peaks, file, { isNewFile }) => {
      if (!isNewFile) return;

      const name = prompt(
        "Enter a name for the file:",
        stripExtension(file.name)
      );

      if (!name) {
        return;
      }

      await write(file.name, file);

      await write(
        `${name}.json`,
        new Blob(
          [
            JSON.stringify({
              name: name,
              media: file.name,
              type: file.type,
              size: file.size,
              points: peaks.points.getPoints(),
            } as SavedProjectData),
          ],
          { type: "application/json" }
        )
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
        initialize(file, {
          isNewFile: true,
        });
        dialogRef.current?.close();
      } else {
        console.error("Invalid file type. Please drop an audio file.");
      }
    }
  };

  return (
    <>
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

      <button onClick={() => openDialog()}>New</button>
      {entries.map((entry) => (
        <div key={entry.name}>
          <span>{entry.name}</span>
          <button onClick={() => open(entry)}>Open</button>
          <button onClick={() => remove(entry)}>Remove</button>
        </div>
      ))}
    </>
  );
}

export default App;
