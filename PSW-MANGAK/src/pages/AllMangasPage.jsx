// AllMangasPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MangaList from '../components/MangaList';
import mangas from '../BD/mangasData';
import styles from './AllMangasPage.module.css';

const AllMangasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`); // Redireciona para a página de detalhes do mangá
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Todos os Mangás</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <MangaList mangas={mangas} searchTerm={searchTerm} onMangaClick={handleMangaClick} />
    </div>
  );
};

export default AllMangasPage;
