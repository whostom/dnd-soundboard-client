import { use, useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import sendFileToServer from "../send-file-to-server";
import type { ServerResponse } from "../aliases/server-response";

function AudioShow({ audio }: { audio: File }) {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const visualizerContainerRef = useRef<HTMLDivElement>(null);
  const overVisualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  // const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [playableAudio, setPlayableAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [playerBox, setPlayerBox] = useState<{
    start: number;
    end: number;
  }>({ start: 0, end: -1 });
  const playerBoxRef = useRef<{ start: number; end: number }>(playerBox);
  // const [playerEnd, setPlayerEnd] = useState<number>(-1);
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(100);

  useEffect(() => {
    playerBoxRef.current = playerBox;
  }, [playerBox]);

  function onResize() {
    if (visualizerContainerRef.current == null) return;
    setWidth(visualizerContainerRef.current.offsetWidth);
    setHeight(visualizerContainerRef.current.offsetHeight);
  }

  function onMouseDown(event: MouseEvent) {}

  function onMouseUp(event: MouseEvent) {}

  function onMouseMove(event: MouseEvent) {
    if (visualizerRef.current == null) return;
    if (playableAudio == null) return;

    const threshold = 5;
    const canvasRect = visualizerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    const duration = playableAudio.duration;

    console.log(canvasRect);
    console.log(mousePos);
    console.log(playerBoxRef.current);

    const startPosX =
      canvasRect.width * (playerBoxRef.current.start / duration);
    const endPosX = canvasRect.width * (playerBoxRef.current.end / duration);

    const body = document.querySelector("body");
    if (
      mousePos.x > startPosX + canvasRect.left - threshold &&
      mousePos.x < startPosX + canvasRect.left + threshold &&
      mousePos.y > canvasRect.top &&
      mousePos.y < canvasRect.bottom
    ) {
      if (body != null) {
        body.style.cursor = "col-resize";
      }
      console.log("masz myszke tak ze mogbys posuwac start");
    } else if (
      mousePos.x > endPosX + canvasRect.left - threshold &&
      mousePos.x < endPosX + canvasRect.left + threshold &&
      mousePos.y > canvasRect.top &&
      mousePos.y < canvasRect.bottom
    ) {
      if (body != null) {
        body.style.cursor = "col-resize";
      }
      console.log("masz myszke tak ze mogbys posuwac end");
    } else {
      if (body != null) {
        body.style.cursor = "";
      }
    }

    // if (mo)
  }

  useEffect(() => {
    const url = URL.createObjectURL(audio);
    setPlayableAudio(new Audio(url));

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  useEffect(() => {
    if (visualizerContainerRef.current == null) return;
    setWidth(visualizerContainerRef.current.offsetWidth);
    setHeight(visualizerContainerRef.current.offsetHeight);
  }, [visualizerContainerRef]);

  useEffect(() => {
    if (playableAudio == null) return;
    if (visualizerContainerRef.current == null) return;

    const currentTimeInterval = setInterval(() => {
      if (playableAudio.currentTime > playerBox.end) {
        playableAudio.currentTime = playerBox.end;
        playableAudio.pause();
      }
      let xPos = 0;
      if (ctx == null) return;
      ctx.clearRect(0, 0, width, height);

      setCurrentTime(playableAudio.currentTime);
      // Time indicator
      xPos = width * (playableAudio.currentTime / playableAudio.duration);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, height);
      ctx.stroke();
      ctx.closePath();

      // Start position
      xPos = width * (playerBox.start / playableAudio.duration);
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.5";
      ctx.rect(0, 0, xPos, height);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = "rgb(218, 44, 0)";
      ctx.rect(xPos, 0, 2, height);
      ctx.stroke();
      ctx.closePath();

      // End position
      xPos = width * (playerBox.end / playableAudio.duration);
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.5";
      ctx.rect(xPos, 0, width, height);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = "rgb(218, 44, 0)";
      ctx.rect(xPos - 2, 0, 2, height);
      ctx.stroke();
      ctx.closePath();
    }, 16);
    // visualizerRef.current.

    return () => clearInterval(currentTimeInterval);
  }, [
    playableAudio,
    visualizerContainerRef.current,
    width,
    playerBox.start,
    playerBox.end,
  ]);

  useEffect(() => {
    if (playableAudio == null) return;
    console.log(playableAudio.duration);
    setPlayerBox({ start: 0, end: playableAudio.duration });
    // setPlayerEnd(playableAudio.duration);
  }, [playableAudio?.duration]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [playableAudio]);

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
          key={width + height}
          ref={visualizerRef}
          blob={audio}
          width={width}
          height={height}
          gap={0}
          barWidth={1}
          currentTime={currentTime}
        />
      </div>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          if (playableAudio.currentTime >= playerBox.end) {
            playableAudio.currentTime = playerBox.start;
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
          setPlayerBox({ start: 2, end: 3 });
          // setPlayerStart(2);
          // setPlayerEnd(3);
          playableAudio.currentTime = 2;
        }}
      >
        Reset
      </button>
      <button
        onClick={() => {
          sendFileToServer<ServerResponse<null>>("upload-sound", audio).then(
            (response) => {
              console.log(response);
            },
          );
        }}
      >
        Upload
      </button>
    </>
  );
}

export default AudioShow;
