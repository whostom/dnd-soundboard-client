import { useMediaQuery } from "react-responsive";
import DirectoryToggleButton from "../widgets/DirectoryToggleButton";
import { useEffect, useState } from "react";
import fetchToServer from "../fetch-to-server";
import DirectoryButton from "../widgets/DirectoryButton";

function DirectoriesPanel({
  onDirectoryChange,
}: {
  onDirectoryChange: (directory: {
    folder_id: number;
    folder_name: string;
  }) => void;
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
      <div id="directories-panel" className={open ? "open" : undefined}>
        <span className="header-directories-text">Lista folderów</span>
        <DirectoryButton onClick={() => {}}>
          Pokaż wszystkie dźwięki
        </DirectoryButton>
        <hr />
        {allDirectories == undefined ? (
          <span className="directories-loading">loading...</span>
        ) : allDirectories.length == 0 ? (
          <span className="directories-text">
            Nie ma żadnych istniejących folderów :(
          </span>
        ) : (
          allDirectories.map((directory, index) => (
            <DirectoryButton
              key={index}
              onClick={() => {
                onDirectoryChange(directory);
              }}
            >
              {directory.folder_name}
            </DirectoryButton>
          ))
        )}
      </div>
    </>
  );
}

export default DirectoriesPanel;
