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

  const timePos = useRef<number>(0);

  return (
    <>
      <div className="audio-visualizer">
        <WavesurferPlayer
          media={new Audio(URL.createObjectURL(audio))}
          onReady={(wv) => {
            waveSurfer.current = wv;
          }}
          minPxPerSec={1}
          onClick={(wv, x, y) => {
            if (importRegion.current == null) return;

            if (wv.getCurrentTime() < importRegion.current.start) {
              wv.setTime(timePos.current);
            } else if (wv.getCurrentTime() > importRegion.current.end) {
              wv.setTime(timePos.current);
            }

            timePos.current = wv.getCurrentTime();
          }}
          plugins={[regions]}
          normalize={true}
          onDecode={() => {
            importRegion.current = regions.addRegion({
              start: 0,
              end: 10,
              content: "Import range (max 15 seconds)",
              color: "rgba(0,0,0,0.2)",
              drag: false,
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
                  timePos.current = waveSurfer.current.getCurrentTime();
                }
              } else if (side == "end") {
                if (
                  waveSurfer.current.getCurrentTime() > importRegion.current.end
                ) {
                  waveSurfer.current.setTime(importRegion.current.end);
                  timePos.current = waveSurfer.current.getCurrentTime();
                }
              }
            });
            // importRegion.current.on("", () => {
            //   console.log("przesuwa mnie");
            // });
          }}
          onAudioprocess={(wv, currentTime) => {
            if (importRegion.current == null) return;
            if (currentTime > importRegion.current.end) {
              wv.stop();
              wv.setTime(importRegion.current.end);
            }
            timePos.current = wv.getCurrentTime();
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
          timePos.current = waveSurfer.current.getCurrentTime();
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
