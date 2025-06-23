import { useMediaQuery } from "react-responsive";
import DirectoryToggleButton from "../widgets/DirectoryToggleButton";
import { useEffect, useState } from "react";
import fetchToServer from "../fetch-to-server";

function DirectoriesPanel({
  onDirectoryChange,
}: {
  onDirectoryChange: (name: string) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [allDirectories, setAllDirectories] = useState<
    Array<{ folder_id: number; folder_name: string }> | undefined
  >(undefined);

  useEffect(() => {
    fetchToServer<{
      success: boolean;
      result: Array<{ folder_id: number; folder_name: string }>;
    }>("get-all-folders", null).then((response) => {
      setAllDirectories(response.result);
      console.log(response.result);
    });
  }, []);
  const isMobile = useMediaQuery({
    query: "screen and (max-aspect-ratio: 1/1)",
  });

  return (
    <>
      {isMobile ? (
        <DirectoryToggleButton
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
