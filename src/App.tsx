import "./App.css";
import "./App-mobile.css";
import "./App-desktop.css";
import DirectoriesPanel from "./components/DirectoriesPanel";
import SearchPanel from "./components/SearchPanel";
import SoundPanel from "./components/SoundPanel";
import { useState } from "react";
import SoundDialog from "./components/SoundDialog";

function App() {
  const [directory, setDirectory] = useState<
    | {
        folder_id: number;
        folder_name: string;
      }
    | undefined
  >(undefined);

  const [soundDialogOpen, setSoundDialogOpen] = useState<boolean>(false);

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
          onCloseDialog={() => {
            setSoundDialogOpen(false);
          }}
        />
      ) : (
        <></>
      )}
      <SoundPanel directoryId={directory?.folder_id} />
    </main>
  );
}

export default App;
