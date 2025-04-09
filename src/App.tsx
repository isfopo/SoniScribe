import "./App.css";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";

function App() {
  const { waveformElement, playPause, addPoint, nextPoint, previousPoint } =
    usePeaks({
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

  return <>{waveformElement}</>;
}

export default App;
