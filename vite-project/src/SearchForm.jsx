import React from "react";

function SearchForm({ onChangeValue }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc username..."
        onChange={(e) => onChangeValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchForm;
