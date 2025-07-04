import VanillaTilt from "vanilla-tilt";
import type { Sound } from "../aliases/sound";
import fetchToServer from "../fetch-to-server";
import PlayArrowIcon from "../svg/play-arrow-icon";
import ThreeDotsIcon from "../svg/three-dots-icon";
import { useEffect, useRef } from "react";

function SoundButton({ sound }: { sound: Sound }) {
  const buttonRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (buttonRef.current != null) {
      VanillaTilt.init(buttonRef.current, {});
    }
  }, [buttonRef]);

  return (
    <button
      ref={buttonRef}
      data-tilt
      className="sound-button"
      onClick={() => {
        fetchToServer(
          "play-sound",
          JSON.stringify({ soundId: sound.sound_id }),
        );
      }}
    >
      <button className="sound-button-menu-button">
        <ThreeDotsIcon />
      </button>
      <div className="sound-button-icon">{sound.icon}</div>
      <div className="sound-button-name">{sound.name}</div>
      <div className="sound-button-play-icon">
        <PlayArrowIcon />
      </div>
    </button>
  );
}

export default SoundButton;
