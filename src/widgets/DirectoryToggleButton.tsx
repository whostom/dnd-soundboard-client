import { useState } from "react";
import ArrowBackIcon from "../svg/arrow_back-icon";
import MenuIcon from "../svg/menu-icon";

function DirectoryToggleButton({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => {
        setOpen(!open);
      }}
      className={open ? "open" : undefined}
      id="directory-toggle-button"
    >
      {open ? <ArrowBackIcon /> : <MenuIcon />}
    </button>
  );
}

export default DirectoryToggleButton;
