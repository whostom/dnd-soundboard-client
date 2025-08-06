import { useRef } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import RegionsPlugin, {
  type Region,
  type RegionParams,
} from "wavesurfer.js/dist/plugins/regions.js";
import WaveSurfer from "wavesurfer.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import calculateTimeDisplay from "../calculate-time-display";
import AudioControlButton from "./AudioControlButton";
import PlayArrowIcon from "../svg/play-arrow-icon";
import PauseIcon from "../svg/pause-icon";
import StopIcon from "../svg/stop-icon";

function AudioShow({
  audio,
  onRegionChanged,
}: {
  audio: File;
  onRegionChanged: (start: number, end: number) => void;
}) {
  const pixelsInSeconds = useRef<number>(51);

  const waveSurfer = useRef<WaveSurfer | null>(null);
  const regions = RegionsPlugin.create();
  const importRegion = useRef<Region | null>(null);
  const importRegionOptions: RegionParams = {
    start: 0,
    end: 10,
    content: "Import range (max 15 seconds)",
    color: "rgba(0,0,0,0.2)",
    drag: false,
    resize: true,
    minLength: 0.5,
  };

  const hover = HoverPlugin.create({
    formatTimeCallback: (seconds) =>
      calculateTimeDisplay(seconds, pixelsInSeconds.current),
  });

  const timePos = useRef<number>(0);

  const onWavesurferClick = (wv: WaveSurfer) => {
    if (importRegion.current == null) return;

    if (wv.getCurrentTime() < importRegion.current.start) {
      wv.setTime(timePos.current);
    } else if (wv.getCurrentTime() > importRegion.current.end) {
      wv.setTime(timePos.current);
    }

    timePos.current = wv.getCurrentTime();
  };

  const onAudioDecode = () => {
    importRegion.current = regions.addRegion(importRegionOptions);

    importRegion.current.on("update", (side) => {
      if (waveSurfer.current == null) return;
      if (importRegion.current == null) return;

      const currentTime = waveSurfer.current.getCurrentTime();
      const regionStart = importRegion.current.start;
      const regionEnd = importRegion.current.end;

      if (side == "start") {
        if (currentTime < regionStart) {
          waveSurfer.current.setTime(regionStart);
          timePos.current = regionStart;
        }
      } else if (side == "end") {
        if (currentTime > regionEnd) {
          waveSurfer.current.setTime(regionEnd);
          timePos.current = regionEnd;
        }
      }

      onRegionChanged(importRegion.current.start, importRegion.current.end);
    });
  };

  const onAudioProcess = (wv: WaveSurfer, currentTime: number) => {
    if (importRegion.current == null) return;
    if (currentTime > importRegion.current.end) {
      wv.stop();
      wv.setTime(importRegion.current.end);
    }
    timePos.current = wv.getCurrentTime();
  };

  return (
    <>
      <div className="audio-visualizer">
        <WavesurferPlayer
          media={new Audio(URL.createObjectURL(audio))}
          onReady={(wv) => {
            waveSurfer.current = wv;
          }}
          onClick={onWavesurferClick}
          plugins={[regions, hover]}
          normalize={true}
          onDecode={onAudioDecode}
          onAudioprocess={onAudioProcess}
        />
      </div>
      <div className="audio-control">
        <AudioControlButton
          onClick={() => {
            if (waveSurfer.current == null) return;
            waveSurfer.current.pause();
          }}
        >
          <PauseIcon size="30px" />
        </AudioControlButton>
        <AudioControlButton
          onClick={() => {
            if (waveSurfer.current == null) return;
            waveSurfer.current.play();
          }}
        >
          <PlayArrowIcon size="30px" />
        </AudioControlButton>
        <AudioControlButton
          onClick={() => {
            if (waveSurfer.current == null) return;
            if (importRegion.current == null) return;
            waveSurfer.current.pause();
            waveSurfer.current.setTime(importRegion.current.start);
            timePos.current = waveSurfer.current.getCurrentTime();
          }}
        >
          <StopIcon size="30px" />
        </AudioControlButton>
      </div>
      {/* <button
        onClick={() => {
          if (waveSurfer.current == null) return;
        }}
      >
        Zoom Out
      </button>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;
        }}
      >
        Zoom In
      </button> */}
    </>
  );
}

export default AudioShow;
