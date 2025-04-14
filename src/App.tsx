import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";
import { useSettingsStore } from "./stores/settings";
import { WaveformView } from "./components/WaveformView";
import { useRef } from "react";
import { DragAndDropDialog } from "./components/Dialogs/DragAndDropDialog";
import { stripExtension } from "./helpers/files";
import { AudioPlayer } from "./components/AudioPlayer";
import { SavedProjectData, useProjects } from "./hooks/useProjects";
import { mapPointToPointOptions } from "./helpers/points";
import { SubdivisionPointOptions } from "./helpers/subdivisions";
import "./App.css";

function App() {
  const { subdivision, setSubdivision } = useSettingsStore();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const {
    write,
    remove,
    projects,
    currentProject,
    setCurrentProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
  } = useProjects();

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
    mediaFile,
  } = usePeaks({
    subdivision,
    onInitialize: async (_, mediaFile, { isNewFile }) => {
      if (!isNewFile) return;

      const name = prompt(
        "Enter a name for the file:",
        stripExtension(mediaFile.name)
      );

      if (!name) {
        return;
      }

      // Write the media file to the file system
      await write(mediaFile.name, mediaFile);

      // Write the project data to the file system
      const projectFile = await write(
        `${name}.json`,
        new Blob(
          [
            JSON.stringify({
              media: mediaFile.name,
              type: mediaFile.type,
              size: mediaFile.size,
              points: [],
            } as SavedProjectData),
          ],
          { type: "application/json" }
        )
      );
      setCurrentProject(projectFile);
    },
    onPointAdd: (points) =>
      addPointsToCurrentProject(
        points.map(
          (point) => mapPointToPointOptions(point) as SubdivisionPointOptions
        )
      ),
    onPointRemove: (points) =>
      removePointsFromCurrentProject(
        points.map(
          (point) => mapPointToPointOptions(point) as SubdivisionPointOptions
        )
      ),
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

  const handleProjectOpen = async (file: FileSystemHandle) => {
    open(file);
    setCurrentProject(file as FileSystemFileHandle);
  };

  return (
    <>
      <DragAndDropDialog dialogRef={dialogRef} onDrop={handleDrop} />

      <p>{currentProject?.name}</p>
      <Transport
        playPause={playPause}
        nextPoint={nextPoint}
        previousPoint={previousPoint}
        isPlaying={isPlaying}
        addPoint={() => addPoint({ subdivision })}
      />

      <WaveformView viewRef={viewRef} />

      <AudioPlayer audioElementRef={audioElementRef} mediaFile={mediaFile} />

      <SubdivisionSelector
        subdivisions={[1, 2, 4, 8, 16, 32, 64]}
        currentSubdivision={subdivision}
        onSelect={setSubdivision}
      />

      <button onClick={() => openDialog()}>New</button>
      {projects.map((entry) => (
        <div key={entry.name}>
          <span>{entry.name}</span>
          <button onClick={() => handleProjectOpen(entry)}>Open</button>
          <button onClick={() => remove(entry)}>Remove</button>
        </div>
      ))}
    </>
  );
}

export default App;
