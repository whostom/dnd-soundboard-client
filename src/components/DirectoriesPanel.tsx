import { useMediaQuery } from "react-responsive";
import DirectoryButton from "../widgets/DirectoryButton";

function DirectoriesPanel() {
  const isMobile = useMediaQuery({
    query: "screen and (max-aspect-ratio: 1/1)",
  });

  return (
    <>
      {isMobile ? <DirectoryButton /> : <></>}
      <div id="directories-panel"></div>
    </>
  );
}

export default DirectoriesPanel;
