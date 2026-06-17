import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Buscar por marca o modelo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.searchInput}
      />
    </div>
  );
};

const styles = {
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
    padding: '0 10px'
  },
  searchInput: {
    width: '100%',
    maxWidth: '300px',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    outline: 'none'
  }
};

export default SearchBar;