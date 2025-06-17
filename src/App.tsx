import "./App.css";
import "./App-mobile.css";
import "./App-desktop.css";
import DirectoriesPanel from "./components/DirectoriesPanel";
import SearchBar from "./components/SearchBar";
import SoundPanel from "./components/SoundPanel";

function App() {
  return (
    <main>
      <DirectoriesPanel />
      <SearchBar />
      <SoundPanel />
    </main>
  );
}

export default App;
