// MangaList.jsx
import styles from './MangaList.module.css';
import PropTypes from "prop-types";

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
            style={{ cursor: 'pointer' }}
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

MangaList.propTypes = {
  mangas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onMangaClick: PropTypes.func.isRequired,
}

export default MangaList;
