import DeleteIcon from "../svg/delete-icon";

function RemoveEmojiButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Usuń emoji"
      title="Usuń emoji"
      className="emoji "
    >
      <DeleteIcon size="70%" />
    </button>
  );
}

export default RemoveEmojiButton;
