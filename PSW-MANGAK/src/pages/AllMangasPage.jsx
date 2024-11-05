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

  // Função para agrupar os mangás por gênero
  const getMangasByGenre = () => {
    const genres = {};

    mangas.forEach((manga) => {
      manga.tags.forEach((genre) => { // Percorre cada gênero do mangá
        if (!genres[genre]) {
          genres[genre] = [];
        }
        genres[genre].push(manga); // Adiciona o mangá ao gênero correspondente
      });
    });

    return genres;
  };

  const mangasByGenre = getMangasByGenre();

  // Função para navegar para a página de visualização de mangá
  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Todos os Mangás por Gênero</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Renderizamos cada gênero de mangás */}
      {Object.keys(mangasByGenre).map((genre) => (
        <div key={genre} className={styles.genreSection}>
          <h2 className={styles.genreTitle}>{genre}</h2>
          <MangaList 
            mangas={mangasByGenre[genre]} 
            searchTerm={searchTerm} 
            onMangaClick={handleMangaClick} 
          />
        </div>
      ))}
    </div>
  );
};

export default AllMangasPage;
