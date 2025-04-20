import { useRef } from "react";
import { AudioPlayer } from "../../components/AudioPlayer";
import { DragAndDropDialog } from "../../components/Dialogs/DragAndDropDialog";
import { ProjectList } from "../../components/ProjectList";
import { SubdivisionSelector } from "../../components/SubdivisionSelector";
import { Transport } from "../../components/Transport";
import { WaveformView } from "../../components/WaveformView";
import { mapSubdivisionPointToSubdivisionPointOption } from "../../helpers/points";
import { useKeyPress } from "../../hooks/useKeyPress";
import { usePeaks } from "../../hooks/usePeaks";
import { useProjects } from "../../hooks/useProjects";
import { useSettingsStore } from "../../stores/settings";
import styles from "./index.module.css";

export const ProjectView = (): React.ReactElement => {
  const { subdivision, setSubdivision } = useSettingsStore();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const {
    createNewProject,
    deleteProject,
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
    setPlaybackRate,
    mediaFile,
  } = usePeaks({
    subdivision,
    onInitialize: async (_, mediaFile, { isNewProject }) => {
      if (!isNewProject) return;
      // Create a new project if the user drops a file
      createNewProject(mediaFile);
    },
    onPointAdd: (points) =>
      addPointsToCurrentProject(
        points.map((point) =>
          mapSubdivisionPointToSubdivisionPointOption(point)
        )
      ),
    onPointRemove: (points) =>
      removePointsFromCurrentProject(
        points.map((point) =>
          mapSubdivisionPointToSubdivisionPointOption(point)
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
          isNewProject: true,
        });
        dialogRef.current?.close();
      } else {
        alert("Invalid file type. Please drop an audio file.");
      }
    }
  };

  const handleProjectOpen = async (file: FileSystemHandle) => {
    open(file);
    setCurrentProject(file as FileSystemFileHandle);
  };

  return (
    <>
      <DragAndDropDialog
        dialogRef={dialogRef}
        onDrop={handleDrop}
        allowedFileTypes={["audio/mpeg", "audio/wav", "audio/ogg"]}
        maxCount={1}
      />
      <div className={currentProject ? styles["hidden"] : styles["overlay"]}>
        <button onClick={() => openDialog()}>New</button>
        <ProjectList
          projects={projects}
          open={handleProjectOpen}
          remove={deleteProject}
        />
      </div>

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

      <button onClick={() => setPlaybackRate(0.5)}>0.5x</button>
      <button onClick={() => setPlaybackRate(1)}>1x</button>
    </>
  );
};
