import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
import ProfilePage from "./pages/ProfilePage";
import PropTypes from "prop-types";
import { fetchMangas } from "../services/api";
import { UserProvider } from "./contexts/UserContext";
import { useUser } from "./contexts/useUser";
import NotificationsSignInPageError from "./pages/Login";
import FavoritesPage from "./pages/FavoritesPage";

const MangaPageWrapper = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);

  useEffect(() => {
    const loadMangas = async () => {
      try {
        const mangas = await fetchMangas();
        const foundManga = mangas.find((m) => m.id.toString() === id);
        setManga(foundManga || null);
      } catch (err) {
        console.error("Erro ao carregar mangá:", err);
      }
    };

    loadMangas();
  }, [id]);

  return (
    <MangaLandingPage
      manga={manga}
    />
  );
};

const ProfilePageWrapper = () => {
  const { userId } = useUser();
  return <ProfilePage userId={userId} />;
};

MangaPageWrapper.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

UserProvider.propTypes = {
  children: PropTypes.node,
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <CatalogPage
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
          <Route
            path="/manga/:id"
            element={
              <MangaPageWrapper
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
          <Route path="/profile/:id" element={<ProfilePageWrapper />} />
          <Route path="/login" element={<NotificationsSignInPageError />} />
          <Route path="/favorites/:id" element={<FavoritesPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;