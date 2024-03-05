import React, { useState, ChangeEvent } from "react";

interface CustomSearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<CustomSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          height: "55px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

export default SearchBar;
