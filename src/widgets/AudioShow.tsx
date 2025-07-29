import { useEffect, useRef } from "react";
// import { AudioVisualizer } from "react-audio-visualize";
import sendFileToServer from "../send-file-to-server";
import type { ServerResponse } from "../aliases/server-response";
import WavesurferPlayer from "@wavesurfer/react";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.js";
import { useImmer } from "use-immer";

function AudioShow({ audio }: { audio: File }) {
  const regions = RegionsPlugin.create();
  const importRegion = useRef<Region | null>(null);
  const [playableAudio, setPlayableAudio] = useImmer<HTMLAudioElement | null>(
    null,
  );
  // const playableAudio = useRef<HTMLAudioElement | null>(null);

  const regionStart = useRef<number>(0);
  const regionEnd = useRef<number>(0);

  useEffect(() => {
    const url = URL.createObjectURL(audio);
    setPlayableAudio(new Audio(url));
    // playableAudio.current = new Audio(url);

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  return (
    <>
      <div className="audio-visualizer">
        {playableAudio != null ? (
          <WavesurferPlayer
            media={playableAudio}
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

              // regions.on("region-update", (region, side) => {
              //   if (side == "start") {
              //     regionStart.current = region.start;
              //   } else if (side == "end") {
              //     regionEnd.current = region.end;
              //   }
              //   console.log("regionStart", regionStart.current);
              //   console.log("regionEnd", regionEnd.current);
              // });
              // regions.on("region-out", () => {
              //   if (playableAudio == null) return;
              //   playableAudio.currentTime = regionEnd.current;
              //   playableAudio.pause();
              // });
            }}
          />
        ) : null}
      </div>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          console.log(regionEnd.current);
          console.log(playableAudio.currentTime);
          if (playableAudio.currentTime >= regionEnd.current) {
            playableAudio.currentTime = regionStart.current;
          }
          playableAudio.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          playableAudio.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          if (playableAudio == null) return;
          playableAudio.currentTime = regionStart.current;
        }}
      >
        Reset
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
