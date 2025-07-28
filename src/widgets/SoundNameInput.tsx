function SoundNameInput({
  onNameChange,
}: {
  onNameChange: (name: string) => void;
}) {
  return (
    <input
      onChange={(event) => {
        onNameChange(event.target.value);
      }}
      className="sound-name-input"
      type="text"
      placeholder="Podaj nazwę dźwięku"
    ></input>
  );
}

export default SoundNameInput;
