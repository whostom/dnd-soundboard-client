import AddNewSoundIcon from "../svg/add-new-sound-icon";

function NewSoundButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className="new-sound-button"
    >
      <AddNewSoundIcon />
    </button>
  );
}

export default NewSoundButton;
