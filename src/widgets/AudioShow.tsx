import { useEffect, useRef, useState } from "react";
// import { AudioVisualizer } from "react-audio-visualize";
import sendFileToServer from "../send-file-to-server";
import type { ServerResponse } from "../aliases/server-response";
import WavesurferPlayer from "@wavesurfer/react";

function AudioShow({ audio }: { audio: File }) {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const visualizerContainerRef = useRef<HTMLDivElement>(null);
  const overVisualizerCanvasRef = useRef<HTMLCanvasElement>(null);

  const playableAudio = useRef<HTMLAudioElement | null>(null);
  const currentTime = useRef<number>(0);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const playerBox = useRef<{ start: number; end: number }>({
    start: 0,
    end: -1,
  });

  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(100);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const mouseOverStart = useRef<boolean>(false);
  const mouseOverEnd = useRef<boolean>(false);

  const movingStart = useRef<boolean>(false);
  const movingEnd = useRef<boolean>(false);
  const positionBefore = useRef<number>(0);
  const positionNow = useRef<number>(0);

  function onResize() {
    if (visualizerContainerRef.current == null) return;
    setWidth(visualizerContainerRef.current.offsetWidth);
    setHeight(visualizerContainerRef.current.offsetHeight);
  }

  function onMouseDown(event: MouseEvent) {
    const mousePos = { x: event.clientX, y: event.clientY };
    if (mouseOverStart.current) {
      movingStart.current = true;
      positionBefore.current = mousePos.x;
    } else if (mouseOverEnd.current) {
      movingEnd.current = true;
      positionBefore.current = mousePos.x;
    }
  }

  function onMouseUp(event: MouseEvent) {
    if (movingStart.current) {
      movingStart.current = false;
    } else if (movingEnd.current) {
      movingEnd.current = false;
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (visualizerRef.current == null) return;
    if (playableAudio.current == null) return;

    const threshold = 5;
    const canvasRect = visualizerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    const duration = playableAudio.current.duration;

    const safeDistance = duration * (10 / canvasRect.width);
    if (movingStart.current) {
      positionNow.current = mousePos.x;
      const distance = positionNow.current - positionBefore.current;
      playerBox.current.start += duration * (distance / canvasRect.width);

      if (playerBox.current.start < 0) {
        playerBox.current.start = 0;
      }

      if (playerBox.current.start > playerBox.current.end - safeDistance) {
        playerBox.current.start = playerBox.current.end - safeDistance;
      }

      positionBefore.current = positionNow.current;
    }
    if (movingEnd.current) {
      positionNow.current = mousePos.x;
      const distance = positionNow.current - positionBefore.current;
      playerBox.current.end += duration * (distance / canvasRect.width);

      if (playerBox.current.end > playableAudio.current.duration) {
        playerBox.current.end = 0;
      }

      if (playerBox.current.end < playerBox.current.start + safeDistance) {
        playerBox.current.end = playerBox.current.start + safeDistance;
      }

      positionBefore.current = positionNow.current;
    }

    const startPosX = canvasRect.width * (playerBox.current.start / duration);
    const endPosX = canvasRect.width * (playerBox.current.end / duration);

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
      mouseOverStart.current = true;
      mouseOverEnd.current = false;
    } else if (
      mousePos.x > endPosX + canvasRect.left - threshold &&
      mousePos.x < endPosX + canvasRect.left + threshold &&
      mousePos.y > canvasRect.top &&
      mousePos.y < canvasRect.bottom
    ) {
      if (body != null) {
        body.style.cursor = "col-resize";
      }
      mouseOverStart.current = false;
      mouseOverEnd.current = true;
    } else {
      if (body != null) {
        body.style.cursor = "";
        mouseOverStart.current = false;
        mouseOverEnd.current = false;
      }
    }
  }

  useEffect(() => {
    const url = URL.createObjectURL(audio);
    playableAudio.current = new Audio(url);
    setAudioUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  useEffect(() => {
    if (visualizerContainerRef.current == null) return;
    setWidth(visualizerContainerRef.current.offsetWidth);
    setHeight(visualizerContainerRef.current.offsetHeight);
  }, [visualizerContainerRef]);

  useEffect(() => {
    if (playableAudio.current == null) return;
    if (visualizerContainerRef.current == null) return;

    const currentTimeInterval = setInterval(() => {
      if (playableAudio.current == null) return;
      if (ctx.current == null) return;

      if (playableAudio.current.currentTime > playerBox.current.end) {
        playableAudio.current.currentTime = playerBox.current.end;
        playableAudio.current.pause();
      }

      let xPos = 0;
      ctx.current.clearRect(0, 0, width, height);

      currentTime.current = playableAudio.current.currentTime;

      // Time indicator
      xPos =
        width *
        (playableAudio.current.currentTime / playableAudio.current.duration);
      ctx.current.lineWidth = 2;
      ctx.current.beginPath();
      ctx.current.moveTo(xPos, 0);
      ctx.current.lineTo(xPos, height);
      ctx.current.stroke();
      ctx.current.closePath();

      // Start position
      xPos = width * (playerBox.current.start / playableAudio.current.duration);
      ctx.current.beginPath();
      ctx.current.fillStyle = "rgba(0,0,0,0.5";
      ctx.current.rect(0, 0, xPos, height);
      ctx.current.fill();
      ctx.current.closePath();
      ctx.current.beginPath();
      ctx.current.strokeStyle = "rgb(218, 44, 0)";
      ctx.current.rect(xPos, 0, 2, height);
      ctx.current.stroke();
      ctx.current.closePath();

      // End position
      xPos = width * (playerBox.current.end / playableAudio.current.duration);
      ctx.current.beginPath();
      ctx.current.fillStyle = "rgba(0,0,0,0.5";
      ctx.current.rect(xPos, 0, width, height);
      ctx.current.fill();
      ctx.current.closePath();
      ctx.current.beginPath();
      ctx.current.strokeStyle = "rgb(218, 44, 0)";
      ctx.current.rect(xPos - 2, 0, 2, height);
      ctx.current.stroke();
      ctx.current.closePath();
    }, 16);

    return () => clearInterval(currentTimeInterval);
  }, [playableAudio, visualizerContainerRef, width, playerBox]);

  useEffect(() => {
    if (playableAudio.current == null) return;
    const handleDuration = () => {
      if (playableAudio.current == null) return;
      playerBox.current.start = 0;
      playerBox.current.end = playableAudio.current.duration;
    };

    playableAudio.current.addEventListener("loadedmetadata", handleDuration);

    return () => {
      playableAudio.current?.removeEventListener(
        "loadedmetadata",
        handleDuration,
      );
    };
  }, [playableAudio]);

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
      ctx.current = overVisualizerCanvasRef.current.getContext("2d");
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

        {/* <AudioVisualizer
          key={width + height}
          ref={visualizerRef}
          blob={audio}
          width={width}
          height={height}
          gap={0}
          barWidth={1}
          currentTime={currentTime.current}
        /> */}
        <WavesurferPlayer url={audioUrl} height={height} width={width} />
      </div>
      <button
        onClick={() => {
          if (playableAudio.current == null) return;
          if (playableAudio.current.currentTime >= playerBox.current.end) {
            playableAudio.current.currentTime = playerBox.current.end;
          }
          playableAudio.current.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          if (playableAudio.current == null) return;
          playableAudio.current.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          if (playableAudio.current == null) return;
          playableAudio.current.currentTime = playerBox.current.start;
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
