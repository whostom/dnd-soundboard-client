import { useMediaQuery } from "react-responsive";
import DirectoryButton from "../widgets/DirectoryButton";
import { useState } from "react";

function DirectoriesPanel() {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery({
    query: "screen and (max-aspect-ratio: 1/1)",
  });

  return (
    <>
      {isMobile ? (
        <DirectoryButton
          onClick={(open: boolean) => {
            setOpen(open);
          }}
        />
      ) : (
        <></>
      )}
      <div id="directories-panel" className={open ? "open" : undefined}></div>
    </>
  );
}

export default DirectoriesPanel;
