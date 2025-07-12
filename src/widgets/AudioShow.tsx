import { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";

function AudioShow({ audio }: { audio: Blob }) {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const overVisualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  // const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [playableAudio, setPlayableAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [playerStart, setPlayerStart] = useState<number>(0);
  const [playerEnd, setPlayerEnd] = useState<number>(-1);
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(100);

  useEffect(() => {
    console.log(audio.type);
    const url = URL.createObjectURL(audio);
    // setAudioUrl(url);
    setPlayableAudio(new Audio(url));

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  useEffect(() => {
    if (playableAudio == null) {
      return;
    }
    setPlayerStart(0);
    setPlayerEnd(playableAudio.duration);
    const currentTimeInterval = setInterval(() => {
      setCurrentTime(playableAudio.currentTime);
      if (ctx == null) return;
      console.log(playableAudio.currentTime);
      const xPos = width * (playableAudio.currentTime / playableAudio.duration);
      console.log(xPos);
      ctx.lineWidth = 3;
      ctx?.clearRect(0, 0, width, height);
      ctx?.beginPath();
      ctx?.moveTo(xPos, 0);
      ctx?.lineTo(xPos, height);
      ctx?.stroke();
      ctx?.closePath();
    }, 16);

    return () => clearInterval(currentTimeInterval);
  }, [playableAudio]);

  useEffect(() => {
    console.log("odpalam visualizer");
    if (overVisualizerCanvasRef.current != null) {
      setCtx(overVisualizerCanvasRef.current.getContext("2d"));
    }
  }, [overVisualizerCanvasRef]);

  return (
    <>
      <div className="audio-visualizer">
        <canvas
          ref={overVisualizerCanvasRef}
          width={width}
          className="over-visualizer-canvas"
          height={height}
        ></canvas>
        <AudioVisualizer
          ref={visualizerRef}
          blob={audio}
          width={width}
          height={height}
          gap={5}
          barWidth={5}
          currentTime={currentTime}
        />
      </div>
      <button
        onClick={() => {
          playableAudio?.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          playableAudio?.pause();
        }}
      >
        Pause
      </button>
      {/* {audioUrl && (
        <audio controls>d
          <source src={audioUrl} type={audio.type} />
        </audio>
      )} */}
    </>
  );
}

export default AudioShow;
