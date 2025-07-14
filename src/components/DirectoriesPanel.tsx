import { useMediaQuery } from "react-responsive";
import DirectoryToggleButton from "../widgets/DirectoryToggleButton";
import { useEffect, useState } from "react";
import fetchToServer from "../fetch-to-server";
import DirectoryButton from "../widgets/DirectoryButton";

function applyPanelDarken(open: boolean) {
  const soundPanel = document.querySelector("#sound-panel");
  const searchPanel = document.querySelector("#search-panel");

  if (open) {
    soundPanel?.classList.add("darken");
    searchPanel?.classList.add("darken");
  } else {
    soundPanel?.classList.remove("darken");
    searchPanel?.classList.remove("darken");
  }
}

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
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  useEffect(() => {
    fetchToServer<{
      success: boolean;
      result: Array<{ folder_id: number; folder_name: string }>;
    }>("get-all-folders", null).then((response) => {
      setAllDirectories(response.result);
    });
  }, []);

  const isMobile = useMediaQuery({
    query: "screen and (max-aspect-ratio: 1/1)",
  });

  const handleSetOpen = (newOpenState: boolean) => {
    setOpen(newOpenState);
    applyPanelDarken(newOpenState);
  };

  return (
    <>
      {isMobile ? (
        <DirectoryToggleButton open={open} setOpen={handleSetOpen} />
      ) : null}

      <div id="directories-panel" className={open ? "open" : undefined}>
        <span className="header-directories-text">Foldery</span>

        <DirectoryButton
          onClick={() => {
            setSelectedFolderId(null);
            handleSetOpen(false);
          }}
          chosen={selectedFolderId === null}
        >
          Wszystkie dźwięki
        </DirectoryButton>

        <hr />

        {allDirectories === undefined ? (
          <span className="directories-loading">loading...</span>
        ) : allDirectories.length === 0 ? (
          <span className="directories-text">
            Nie ma żadnych istniejących folderów :(
          </span>
        ) : (
          allDirectories.map((directory, index) => (
            <DirectoryButton
              key={index}
              onClick={() => {
                onDirectoryChange(directory);
                setSelectedFolderId(directory.folder_id);
                handleSetOpen(false);
              }}
              chosen={selectedFolderId === directory.folder_id}
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
