import NewSoundButton from "../widgets/NewSoundButton";
import SearchBar from "../widgets/SearchBar";

function SearchPanel() {
  return (
    <div id="search-panel">
      <SearchBar />
      <NewSoundButton />
    </div>
  );
}

export default SearchPanel;
