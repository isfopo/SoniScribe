import "./App.css";
import { WaveformView } from "./components/WaveformView";
import { useKeyPress } from "./hooks/useKeyPress";

function App() {
  useKeyPress({
    keymap: {
      ArrowUp: () => {
        console.log("ArrowUp pressed");
      },
      ArrowDown: () => {
        console.log("ArrowDown pressed");
      },
      ArrowLeft: () => {
        console.log("ArrowLeft pressed");
      },
      ArrowRight: () => {
        console.log("ArrowRight pressed");
      },
    },
  });

  return (
    <>
      <WaveformView
        audioUrl="/audio/brand-new-bike.mp3"
        audioContentType="audio/mpeg"
      />
    </>
  );
}

export default App;
