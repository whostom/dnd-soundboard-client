import "./App.css";
import "./App-mobile.css";
import "./App-desktop.css";
import DirectoriesPanel from "./components/DirectoriesPanel";
import SearchBar from "./components/SearchBar";
import SoundPanel from "./components/SoundPanel";
import { useState } from "react";

function App() {
  const [directory, setDirectory] = useState<string | null>(null);

  return (
    <main>
      <DirectoriesPanel
        onDirectoryChange={(name: string) => {
          setDirectory(name);
        }}
      />
      <SearchBar />
      <SoundPanel directoryName={directory} />
    </main>
  );
}

export default App;
