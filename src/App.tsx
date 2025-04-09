import "./App.css";
import { useKeyPress } from "./hooks/useKeyPress";
import { usePeaks } from "./hooks/usePeaks";

function App() {
  const { peaksRef, waveformElement } = usePeaks({
    audioUrl: "/audio/brand-new-bike.mp3",
    audioContentType: "audio/mpeg",
  });

  const playPause = () => {
    debugger;
    if (peaksRef.current) {
      const player = peaksRef.current.player;
      console.log("playPause", player);

      player.play();
    }
  };

  const addPoint = () => {
    if (peaksRef.current) {
      const time = peaksRef.current.player.getCurrentTime();

      peaksRef.current.points.add({
        time: time,
        editable: true,
      });
    }
  };

  const nextPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints();
      const currentTime = peaksRef.current.player.getCurrentTime();

      const nextPoint = points.find((point) => point.time > currentTime);

      if (nextPoint) {
        peaksRef.current.player.seek(nextPoint.time);
      }
    }
  };

  const previousPoint = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints();
      const currentTime = peaksRef.current.player.getCurrentTime();
      const previousPoint = points
        .slice()
        .reverse()
        .find((point) => point.time < currentTime);

      if (previousPoint) {
        peaksRef.current.player.seek(previousPoint.time);
      }
    }
  };

  useKeyPress({
    keymap: {
      ArrowUp: () => {
        console.log("ArrowUp pressed");
      },
      ArrowDown: () => {
        console.log("ArrowDown pressed");
      },
      ArrowLeft: previousPoint,
      ArrowRight: nextPoint,
      q: addPoint,
      Space: playPause,
    },
  });

  return <>{waveformElement}</>;
}

export default App;
