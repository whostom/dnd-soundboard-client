import { useState } from "react";

function DirectoryToggleButton({
  onClick,
}: {
  onClick: (open: boolean) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <button
      onClick={() => {
        console.log("siema");
        setOpen(!open);
        onClick(!open);
      }}
      className={open ? "open" : undefined}
      id="directory-button"
    ></button>
  );
}

export default DirectoryToggleButton;
