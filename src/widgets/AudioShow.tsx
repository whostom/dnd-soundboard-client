import { useEffect, useRef } from "react";
// import { AudioVisualizer } from "react-audio-visualize";
import sendFileToServer from "../send-file-to-server";
import type { ServerResponse } from "../aliases/server-response";
import WavesurferPlayer from "@wavesurfer/react";
import RegionsPlugin, {
  type Region,
  type RegionParams,
} from "wavesurfer.js/dist/plugins/regions.js";
import WaveSurfer from "wavesurfer.js";

function AudioShow({ audio }: { audio: File }) {
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const regions = RegionsPlugin.create();
  const importRegion = useRef<Region | null>(null);

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
          plugins={[regions]}
          onClick={onWavesurferClick}
          normalize={true}
          onDecode={onAudioDecode}
          onAudioprocess={onAudioProcess}
        />
      </div>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;
          waveSurfer.current.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;
          waveSurfer.current.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;
          if (importRegion.current == null) return;
          waveSurfer.current.pause();
          waveSurfer.current.setTime(importRegion.current.start);
          timePos.current = waveSurfer.current.getCurrentTime();
        }}
      >
        Reset
      </button>
      <button
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
      </button>
    </>
  );
}

export default AudioShow;
