import React from "react";

function SearchBar({ searchText, styleClass, placeholderText, setSearchText }) {
  const updateSearchInput = (value) => {
    setSearchText(value);
  };

  return (
    <div className={"inline-block " + styleClass}>
      <div className="relative flex flex-wrap items-stretch w-full input-group ">
        <input
          type="search"
          value={searchText}
          placeholder={placeholderText || "Search"}
          onChange={(e) => updateSearchInput(e.target.value)}
          className="w-full input input-sm input-bordered"
        />
      </div>
    </div>
  );
}

export default SearchBar;
