import { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";

function AudioShow({ audio }: { audio: Blob }) {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const visualizerContainerRef = useRef<HTMLDivElement>(null);
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

  function onResize() {
    if (visualizerContainerRef.current == null) return;
    setWidth(visualizerContainerRef.current.offsetWidth);
  }

  useEffect(() => {
    const url = URL.createObjectURL(audio);
    // setAudioUrl(url);
    setPlayableAudio(new Audio(url));

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  useEffect(() => {
    if (playableAudio == null) return;
    if (visualizerContainerRef.current == null) return;

    setPlayerStart(0);
    // setPlayerStart(2);
    // setCurrentTime(2);
    // playableAudio.currentTime = 2;
    setPlayerEnd(playableAudio.duration);
    // setPlayerEnd(3);

    setWidth(visualizerContainerRef.current.offsetWidth);

    const currentTimeInterval = setInterval(() => {
      if (playableAudio.currentTime > playerEnd) {
        playableAudio.currentTime = playerEnd;
        playableAudio.pause();
      }
      setCurrentTime(playableAudio.currentTime);
      if (ctx == null) return;
      const xPos = width * (playableAudio.currentTime / playableAudio.duration);
      ctx.lineWidth = 2;
      ctx?.clearRect(0, 0, width, height);
      ctx?.beginPath();
      ctx?.moveTo(xPos, 0);
      ctx?.lineTo(xPos, height);
      ctx?.stroke();
      ctx?.closePath();
    }, 16);
    // visualizerRef.current.

    return () => clearInterval(currentTimeInterval);
  }, [playableAudio, width, setPlayerEnd]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (overVisualizerCanvasRef.current != null) {
      setCtx(overVisualizerCanvasRef.current.getContext("2d"));
    }
  }, [overVisualizerCanvasRef]);

  return (
    <>
      <div ref={visualizerContainerRef} className="audio-visualizer">
        <canvas
          ref={overVisualizerCanvasRef}
          width={width}
          className="over-visualizer-canvas"
          height={height}
        ></canvas>
        <AudioVisualizer
          key={width}
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
          if (playableAudio == null) return;
          if (playableAudio.currentTime >= playerEnd) {
            playableAudio.currentTime = playerStart;
          }
          playableAudio.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          playableAudio?.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          playableAudio.currentTime = playerStart;
          // playableAudio?.set;
        }}
      >
        Reset
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
