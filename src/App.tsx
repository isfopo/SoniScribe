import "./App.css";
import { WaveformView } from "./components/WaveformView";

function App() {
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
