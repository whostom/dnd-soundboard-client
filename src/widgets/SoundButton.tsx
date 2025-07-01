import fetchToServer from "../fetch-to-server";

function SoundButton({
  sound,
}: {
  sound: {
    sound_id: number;
    name: string;
    icon: string;
    category_id: number;
  };
}) {
  // console.log(sound.sound_id);
  return (
    <button
      className="sound-button"
      onClick={() => {
        console.log(sound.sound_id);
        fetchToServer(
          "play-sound",
          JSON.stringify({ soundId: sound.sound_id }),
        );
      }}
    >
      {sound.name}
    </button>
  );
}

export default SoundButton;
