function DirectoryButton({
  children,
  onClick,
  chosen = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  chosen?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={chosen ? "chosen" : undefined}
    >
      {children}
    </button>
  );
}

export default DirectoryButton;
