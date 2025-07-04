import "./App.css";
import "./App-mobile.css";
import "./App-desktop.css";
import DirectoriesPanel from "./components/DirectoriesPanel";
import SearchPanel from "./components/SearchPanel";
import SoundPanel from "./components/SoundPanel";
import { useState } from "react";

function App() {
  const [directory, setDirectory] = useState<
    | {
        folder_id: number;
        folder_name: string;
      }
    | undefined
  >(undefined);

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
      <SearchPanel />
      <SoundPanel directoryId={directory?.folder_id} />
    </main>
  );
}

export default App;
