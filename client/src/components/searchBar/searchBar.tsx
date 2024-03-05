import React, { useState, ChangeEvent } from "react";
import styles from "./searchBar.module.css";

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
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;
