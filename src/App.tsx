import "./App.css";
import { Transport } from "./components/Transport";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";

function App() {
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
      KeyQ: addPoint,
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
      />
    </>
  );
}

export default App;
