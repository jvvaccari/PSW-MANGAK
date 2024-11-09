// SearchBar.jsx
import styles from './SearchBar.module.css';
import PropTypes from 'prop-types';

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

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.string.isRequired,
};

export default SearchBar;
