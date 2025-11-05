import React from "react";

function SearchForm({ onChangeValue }) {
  return (
    <input
      type="text"
      placeholder="Tìm theo name, username"
      onChange={(e) => onChangeValue(e.target.value)}
      style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
    />
  );
}

export default SearchForm;
