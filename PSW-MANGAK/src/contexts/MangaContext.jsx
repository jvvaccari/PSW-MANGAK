import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchMangas } from "../../services/api";

const MangaContext = createContext();

export const MangaProvider = ({ children }) => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadMangas = async () => {
      try {
        const data = await fetchMangas();
        setMangas(data || []);
      } catch (err) {
        console.error("Erro ao carregar mangás:", err);
        setError("Erro ao carregar os mangás.");
      } finally {
        setLoading(false);
      }
    };

    loadMangas();
  }, []);

  return (
    <MangaContext.Provider value={{ mangas, loading, error, searchTerm, setSearchTerm }}>
      {children}
    </MangaContext.Provider>
  );
};

MangaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MangaContext;