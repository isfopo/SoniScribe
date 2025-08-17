import type { SegmentOptions } from "peaks.js";
import PlaybackRateToggle from "@/components/PlaybackRateToggle";
import { AudioPlayer } from "../../components/AudioPlayer";
import { BarContainer } from "../../components/Container/BarContainer";
import { MultiTap } from "../../components/MultiTap";
import { ProjectList } from "../../components/ProjectList";
import { Transport } from "../../components/Transport";
import { WaveformView } from "../../components/WaveformView";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripExtension } from "../../helpers/files";
import { mapSubdivisionPointToSubdivisionPointOption } from "../../helpers/points";
import { mapSegmentToSegmentOptions } from "../../helpers/segments";
import { useKeyPress } from "../../hooks/useKeyPress";
import { useProjects } from "../../hooks/useProjects";
import { usePeaks } from "../../hooks/waveform/usePeaks";
import { useContextMenuStore } from "../../stores/contextMenu";
import { useDialogStore } from "../../stores/dialogs";
import { useNewSegmentStore } from "../../stores/newSegment";

export const ProjectView = (): React.ReactElement => {
  const { closeDialog } = useDialogStore();
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
    playbackRate,
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
          mapSubdivisionPointToSubdivisionPointOption(point),
        ),
      ),
    onPointRemove: (points) =>
      removePointsFromCurrentProject(
        points.map((point) =>
          mapSubdivisionPointToSubdivisionPointOption(point),
        ),
      ),
    onPointUpdate: (point) => {
      updatePointInCurrentProject(
        mapSubdivisionPointToSubdivisionPointOption(point),
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
              if (event?.point?.id) {
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
              if (event?.point?.id) {
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
          (segment): SegmentOptions => mapSegmentToSegmentOptions(segment),
        ),
      ),
    onSegmentRemove: (segments) =>
      removeSegmentsFromCurrentProject(
        segments.map(
          (segment): SegmentOptions => mapSegmentToSegmentOptions(segment),
        ),
      ),
    onSegmentUpdate: (segment) => {
      updateSegmentInCurrentProject(
        segment,
        mapSegmentToSegmentOptions(segment),
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
              if (event?.segment?.id) {
                peaks.player.seek(event.segment.startTime);
                peaks.player.play();
              }
            },
          },
          {
            label: "Remove Segment",
            key: "remove-segment",
            action: () => {
              if (event?.segment?.id) {
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
                event.segment.labelText,
              );
              if (event?.segment?.id) {
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
              if (event?.segment?.id) {
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

  const handleProjectOpen = async (file: FileSystemHandle) => {
    open(file);
    setCurrentProject(file as FileSystemFileHandle);
  };

  return (
    <>
      <ProjectList
        projects={projects}
        add={handleDrop}
        open={handleProjectOpen}
        remove={deleteProject}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-justify">
            {currentProject?.name
              ? stripExtension(currentProject.name)
              : "No Project Opened"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blend-color">
            <WaveformView viewRef={viewRef} overviewRef={overviewRef} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <MultiTap
            subdivisions={[1, 2, 4, 8, 16, 32, 64]}
            onSelect={(subdivision) => addPoint({ subdivision })}
          />
          <Transport
            playPause={playPause}
            nextPoint={nextPoint}
            previousPoint={previousPoint}
            isPlaying={isPlaying}
          />
          <PlaybackRateToggle
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
          />
        </CardFooter>
      </Card>

      <AudioPlayer audioElementRef={audioElementRef} mediaFile={mediaFile} />

      <BarContainer>{isDrawing && <p>adding segment</p>}</BarContainer>
    </>
  );
};
