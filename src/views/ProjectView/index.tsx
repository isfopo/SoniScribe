import { AudioPlayer } from "../../components/AudioPlayer";
import { DragAndDropDialog } from "../../components/Dialogs/DragAndDropDialog";
import { ProjectList } from "../../components/ProjectList";
import { MultiTap } from "../../components/MultiTap";
import { Transport } from "../../components/Transport";
import { WaveformView } from "../../components/WaveformView";
import { mapSubdivisionPointToSubdivisionPointOption } from "../../helpers/points";
import { useKeyPress } from "../../hooks/useKeyPress";
import { usePeaks } from "../../hooks/waveform/usePeaks";
import { useProjects } from "../../hooks/useProjects";
import styles from "./index.module.css";
import { useDialogStore } from "../../stores/dialogs";
import { useContextMenuStore } from "../../stores/contextMenu";
import { useNewSegmentStore } from "../../stores/newSegment";
import { SegmentOptions } from "peaks.js";
import { mapSegmentToSegmentOptions } from "../../helpers/segments";

export const ProjectView = (): React.ReactElement => {
  const { addDialog, closeDialog } = useDialogStore();
  const { openContextMenu } = useContextMenuStore();
  const { addStart, addEnd, isDrawing } = useNewSegmentStore();

  const {
    createNewProject,
    deleteProject,
    projects,
    currentProject,
    setCurrentProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
    updatePointInCurrentProject,
    addSegmentsToCurrentProject,
    removeSegmentsFromCurrentProject,
    updateSegmentInCurrentProject,
  } = useProjects();

  const {
    viewRef,
    overviewRef,
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
    onPointUpdate: (point) => {
      updatePointInCurrentProject(
        mapSubdivisionPointToSubdivisionPointOption(point)
      );
    },
    onPointContextMenu: (event, peaks) => {
      openContextMenu({
        event: event.evt,
        object: event.point,
        items: [
          {
            label: "Play from Here",
            key: "play-point",
            action: () => {
              if (event.point && event.point.id) {
                peaks.player.seek(event.point.time);
                peaks.player.play();
              }
            },
          },
          {
            label: !isDrawing ? "Start Section" : "End Section",
            key: "create-section",
            action: () => {
              if (!isDrawing) {
                addStart(event.point);
              } else {
                addEnd(event.point);
              }
            },
          },
          {
            label: "Remove Point",
            key: "remove-point",
            action: () => {
              if (event.point && event.point.id) {
                peaks.points.removeById(event.point.id);
              }
            },
          },
        ],
      });
    },
    onSegmentAdd: (segments) =>
      addSegmentsToCurrentProject(
        segments.map(
          (segment): SegmentOptions => mapSegmentToSegmentOptions(segment)
        )
      ),
    onSegmentRemove: (segments) =>
      removeSegmentsFromCurrentProject(
        segments.map(
          (segment): SegmentOptions => mapSegmentToSegmentOptions(segment)
        )
      ),
    onSegmentUpdate: (segment) => {
      updateSegmentInCurrentProject(
        segment,
        mapSegmentToSegmentOptions(segment)
      );
    },
    onSegmentContextMenu: (event, peaks) => {
      openContextMenu({
        event: event.evt,
        object: event.segment,
        items: [
          {
            label: "Play Segment",
            key: "play-segment",
            action: () => {
              if (event.segment && event.segment.id) {
                peaks.player.seek(event.segment.startTime);
                peaks.player.play();
              }
            },
          },
          {
            label: "Remove Segment",
            key: "remove-segment",
            action: () => {
              if (event.segment && event.segment.id) {
                peaks.segments.removeById(event.segment.id);
              }
            },
          },
          {
            label: "Change Name",
            key: "change-name",
            action: () => {
              const label = prompt(
                "Enter a new label:",
                event.segment.labelText
              );
              if (event.segment && event.segment.id) {
                updateSegmentInCurrentProject(event.segment, {
                  labelText: label || event.segment.labelText,
                });
              }
            },
          },
          {
            label: "Change Color",
            key: "change-color",
            action: () => {
              const color = prompt("Enter a color (hex or name):", "#ff0000");
              if (event.segment && event.segment.id) {
                event.segment.update({
                  color: color || event.segment.color,
                });
              }
            },
          },
        ],
      });
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
          isNewProject: true,
        });
        closeDialog();
      } else {
        alert("Invalid file type. Please drop an audio file.");
      }
    }
  };

  const openDialog = () => {
    addDialog({
      id: "drag-and-drop-dialog",
      component: (
        <DragAndDropDialog
          onDrop={handleDrop}
          allowedFileTypes={["audio/mpeg", "audio/wav", "audio/ogg"]}
          maxCount={1}
        />
      ),
    });
  };

  const handleProjectOpen = async (file: FileSystemHandle) => {
    open(file);
    setCurrentProject(file as FileSystemFileHandle);
  };

  return (
    <>
      <div className={currentProject ? styles["hidden"] : styles["overlay"]}>
        <button onClick={() => openDialog()}>New</button>
        <ProjectList
          projects={projects}
          open={handleProjectOpen}
          remove={deleteProject}
        />
      </div>

      <Transport
        title={currentProject?.name || "No Project Opened"}
        playPause={playPause}
        nextPoint={nextPoint}
        previousPoint={previousPoint}
        isPlaying={isPlaying}
      />

      <WaveformView viewRef={viewRef} overviewRef={overviewRef} />

      <AudioPlayer audioElementRef={audioElementRef} mediaFile={mediaFile} />

      <MultiTap
        subdivisions={[1, 2, 4, 8, 16, 32, 64]}
        onSelect={(subdivision) => addPoint({ subdivision })}
      />

      <button onClick={() => setPlaybackRate(0.5)}>0.5x</button>
      <button onClick={() => setPlaybackRate(1)}>1x</button>
      {isDrawing && <p>adding segment</p>}
    </>
  );
};
