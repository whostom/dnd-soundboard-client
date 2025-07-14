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
  const playerBox = useRef<{ start: number; end: number }>({
    start: 0,
    end: -1,
  });
  // const [playerEnd, setPlayerEnd] = useState<number>(-1);
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(100);

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
    if (playableAudio == null) return;

    const threshold = 5;
    const canvasRect = visualizerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    const duration = playableAudio.duration;

    console.log(canvasRect);
    console.log(mousePos);
    console.log(playerBox.current);
    if (movingStart.current) {
      console.log("dzialamy");
      positionNow.current = mousePos.x;
      playerBox.current.start =
        (positionNow.current - positionBefore.current) / width +
        playerBox.current.start;
      // setPlayerBox({
      //   start:
      //     (positionNow.current - positionBefore.current) / width +
      //     playerBox.start,
      //   end: playerBox.end,
      // });
      positionBefore.current = positionNow.current;
    } else if (movingEnd.current) {
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
      mouseOverStart.current = false;
      mouseOverEnd.current = true;
      console.log("masz myszke tak ze mogbys posuwac end");
    } else {
      if (body != null) {
        body.style.cursor = "";
        mouseOverStart.current = false;
        mouseOverEnd.current = false;
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
      if (playableAudio.currentTime > playerBox.current.end) {
        playableAudio.currentTime = playerBox.current.end;
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
      xPos = width * (playerBox.current.start / playableAudio.duration);
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
      xPos = width * (playerBox.current.end / playableAudio.duration);
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
    playerBox.current.end,
    playerBox.current.end,
  ]);

  useEffect(() => {
    if (playableAudio == null) return;
    console.log(playableAudio.duration);
    playerBox.current.start = 0;
    playerBox.current.end = playableAudio.duration;
    // setPlayerBox({ start: 0, end: playableAudio.duration });
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
          if (playableAudio.currentTime >= playerBox.current.end) {
            playableAudio.currentTime = playerBox.current.end;
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
          playerBox.current.start = 2;
          playerBox.current.end = 3;
          // setPlayerBox({ start: 2, end: 3 });
          // playerBox;
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
