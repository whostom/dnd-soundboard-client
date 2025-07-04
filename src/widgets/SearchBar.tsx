import SearchIcon from "../svg/search-icon";

function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" className="search-bar-text-input" />
      <button className="search-bar-submit-button">
        <SearchIcon />
      </button>
    </div>
  );
}

export default SearchBar;
