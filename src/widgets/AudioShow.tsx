import { useEffect, useRef } from "react";
// import { AudioVisualizer } from "react-audio-visualize";
import sendFileToServer from "../send-file-to-server";
import type { ServerResponse } from "../aliases/server-response";
import WavesurferPlayer from "@wavesurfer/react";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.js";
import WaveSurfer from "wavesurfer.js";

function AudioShow({ audio }: { audio: File }) {
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const regions = RegionsPlugin.create();
  const importRegion = useRef<Region | null>(null);

  return (
    <>
      <div className="audio-visualizer">
        <WavesurferPlayer
          media={new Audio(URL.createObjectURL(audio))}
          onReady={(wv) => {
            waveSurfer.current = wv;
          }}
          plugins={[regions]}
          normalize={true}
          onDecode={() => {
            importRegion.current = regions.addRegion({
              start: 0,
              end: 10,
              content: "Import range (max 15 seconds)",
              color: "rgba(0,0,0,0.2)",
              drag: true,
              resize: true,
              minLength: 0.5,
            });
            importRegion.current.on("update", (side) => {
              if (waveSurfer.current == null) return;
              if (importRegion.current == null) return;
              if (side == "start") {
                if (
                  waveSurfer.current.getCurrentTime() <
                  importRegion.current.start
                ) {
                  waveSurfer.current.setTime(importRegion.current.start);
                }
              } else if (side == "end") {
                if (
                  waveSurfer.current.getCurrentTime() > importRegion.current.end
                ) {
                  waveSurfer.current.setTime(importRegion.current.end);
                }
              }
            });
          }}
          onAudioprocess={(wv, currentTime) => {
            if (importRegion.current == null) return;
            if (currentTime > importRegion.current.end) {
              wv.stop();
              wv.setTime(importRegion.current.end);
            }
          }}
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
        }}
      >
        Reset
      </button>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;

          // if (importRegion.current == null) return;
          // waveSurfer.current.pause();
          // waveSurfer.current.setTime(importRegion.current.start);
        }}
      >
        Zoom Out
      </button>
      <button
        onClick={() => {
          if (waveSurfer.current == null) return;
          // waveSurfer.current.
          // waveSurfer.current.zoom();
          // if (importRegion.current == null) return;
          // waveSurfer.current.pause();
          // waveSurfer.current.setTime(importRegion.current.start);
        }}
      >
        Zoom In
      </button>
      <button
        onClick={() => {
          // sendFileToServer<ServerResponse<null>>("upload-sound", audio).then(
          //   (response) => {
          //     console.log(response);
          //   },
          // );
        }}
      >
        Upload
      </button>
    </>
  );
}

export default AudioShow;
