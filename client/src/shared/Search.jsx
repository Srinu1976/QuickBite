import React from 'react';
import './search.css';

const Search = ({ searchTerm, onSearch }) => {
  
  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search input-group">
      <input
        type="text"
        className="search-input form-control"
        name="search"
        placeholder="Search"
        aria-label="search"
        aria-describedby="button-addon2"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        className="search-btn btn btn-outline-secondary"
        type="button"
        id="button-addon2"
        onClick={handleSearch}
      >
        <i className="ri-search-2-line"></i>
      </button>
    </div>
  );
};

export default Search;
