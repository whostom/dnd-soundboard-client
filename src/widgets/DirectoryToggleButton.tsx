import { useState } from "react";
import ArrowBackIcon from "../svg/arrow_back-icon";
import MenuIcon from "../svg/menu-icon";

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
      id="directory-toggle-button"
    >
      {open ? <ArrowBackIcon /> : <MenuIcon />}
    </button>
  );
}

export default DirectoryToggleButton;
