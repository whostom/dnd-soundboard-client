function UploadButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <button disabled={disabled} onClick={onClick}>
      Dodaj dźwięk
    </button>
  );
}

export default UploadButton;
