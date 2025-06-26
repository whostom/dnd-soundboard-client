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
  return <button className="sound-button">{sound.name}</button>;
}

export default SoundButton;
