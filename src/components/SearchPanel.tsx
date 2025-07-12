import NewSoundButton from "../widgets/NewSoundButton";
import SearchBar from "../widgets/SearchBar";

function SearchPanel({
  onNewSoundButtonClick,
}: {
  onNewSoundButtonClick: () => void;
}) {
  return (
    <div id="search-panel">
      <SearchBar />
      <NewSoundButton onClick={onNewSoundButtonClick} />
    </div>
  );
}

export default SearchPanel;
