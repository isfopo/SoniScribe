import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";
import { useSettingsStore } from "./stores/settings";
import "./App.css";

function App() {
  const { subdivision, setSubdivision } = useSettingsStore();

  const {
    waveformElement,
    playPause,
    addPoint,
    nextPoint,
    previousPoint,
    isPlaying,
  } = usePeaks({
    audioUrl: "/audio/brand-new-bike.mp3",
    audioContentType: "audio/mpeg",
  });

  useKeyPress({
    keymap: {
      Space: playPause,
      ArrowLeft: previousPoint,
      ArrowRight: nextPoint,
      KeyQ: () => addPoint({ subdivision: "whole" }),
      KeyW: () => addPoint({ subdivision: "half" }),
      KeyE: () => addPoint({ subdivision: "quarter" }),
      KeyR: () => addPoint({ subdivision: "eighth" }),
      KeyT: () => addPoint({ subdivision: "sixteenth" }),
      KeyY: () => addPoint({ subdivision: "thirtySecond" }),
      KeyU: () => addPoint({ subdivision: "sixtyFourth" }),
    },
  });

  return (
    <>
      {waveformElement}
      <Transport
        playPause={playPause}
        nextPoint={nextPoint}
        previousPoint={previousPoint}
        isPlaying={isPlaying}
        addPoint={() => addPoint({ subdivision })}
      />
      <SubdivisionSelector
        subdivisions={["whole", "half", "quarter"]}
        currentSubdivision={subdivision}
        onSelect={setSubdivision}
      />
    </>
  );
}

export default App;
