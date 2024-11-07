// AllMangasPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MangaList from '../components/MangaList';
import mangas from '../BD/mangasData';

const Catalog_Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getMangasByGenre = () => {
    const genres = {};

    mangas.forEach((manga) => {
      manga.tags.forEach((genre) => {
        if (!genres[genre]) {
          genres[genre] = [];
        }
        genres[genre].push(manga);
      });
    });

    return genres;
  };

  const mangasByGenre = getMangasByGenre();

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  return (
    <div>
      <h1>Todos os Mangás por Gênero</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {Object.keys(mangasByGenre).map((genre) => (
        <div key={genre}>
          <h2>{genre}</h2>
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

export default Catalog_Page;
