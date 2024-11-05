// AllMangasPage.jsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MangaList from '../components/MangaList';
import mangas from '../BD/mangasData';
import styles from './AllMangasPage.module.css';

const AllMangasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Todos os Mangás</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <MangaList mangas={mangas} searchTerm={searchTerm} />
    </div>
  );
};

export default AllMangasPage;
