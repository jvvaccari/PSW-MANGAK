// SearchBar.jsx
import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Procure por título ou autor..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;
