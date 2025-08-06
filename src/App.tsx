import "./App.css";
import "./App-mobile.css";
import "./App-desktop.css";
import DirectoriesPanel from "./components/DirectoriesPanel";
import SearchPanel from "./components/SearchPanel";
import SoundPanel from "./components/SoundPanel";
import { useEffect, useState } from "react";
import SoundDialog from "./components/SoundDialog";
import type { SoundCategory } from "./aliases/sound-category";
import type { ServerResponse } from "./aliases/server-response";
import fetchToServer from "./fetch-to-server";

function App() {
  // const x: number = "foo";
  const [directory, setDirectory] = useState<
    | {
        folder_id: number;
        folder_name: string;
      }
    | undefined
  >(undefined);

  const [categories, setCategories] = useState<
    Array<SoundCategory> | undefined
  >();
  const [soundDialogOpen, setSoundDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchToServer<ServerResponse<Array<SoundCategory>>>(
      "get-all-categories",
    ).then((response) => {
      console.log(response);
      setCategories(response.result);
    });
  }, []);

  return (
    <main>
      <DirectoriesPanel
        onDirectoryChange={(directory: {
          folder_id: number;
          folder_name: string;
        }) => {
          setDirectory(directory);
        }}
      />
      <SearchPanel
        onNewSoundButtonClick={() => {
          setSoundDialogOpen(true);
        }}
      />
      {soundDialogOpen ? (
        <SoundDialog
          categories={categories}
          onCloseDialog={() => {
            setSoundDialogOpen(false);
          }}
        />
      ) : null}
      <SoundPanel categories={categories} directoryId={directory?.folder_id} />
    </main>
  );
}

export default App;
