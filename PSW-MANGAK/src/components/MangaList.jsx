// MangaList.jsx
import React from 'react';
import styles from './MangaList.module.css';

const MangaList = ({ mangas, searchTerm, onMangaClick }) => {
  const filteredMangas = mangas.filter(manga =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manga.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.mangaListContainer}>
      {filteredMangas.length > 0 ? (
        filteredMangas.map((manga) => (
          <div
            key={manga.id}
            className={styles.mangaItem}
            onClick={() => onMangaClick(manga.id)}
            style={{ cursor: 'pointer' }} // Adiciona o cursor de pointer
          >
            <img src={manga.image} alt={manga.title} className={styles.mangaImage} />
            <p className={styles.mangaTitle}>{manga.title}</p>
            <p className={styles.mangaAuthor}>{manga.author}</p>
          </div>
        ))
      ) : (
        <p className={styles.noResults}>Nenhum mangá encontrado</p>
      )}
    </div>
  );
};

export default MangaList;
