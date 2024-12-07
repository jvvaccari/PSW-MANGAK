import { useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
import ProfilePage from "./pages/ProfilePage";
import { fetchMangas } from "../services/api";
import { UserProvider } from "./contexts/UserContext";
import { useUser } from "./contexts/useUser";
import NotificationsSignInPageError from "./pages/Login";
import FavoritesPage from "./pages/FavoritesPage";
import { MangaProvider } from "./contexts/MangaContext";
import { Box, CircularProgress } from "@mui/material";

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

    if (id) {
      loadMangas();
    }
  }, [id]);

  if (!manga) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return <MangaLandingPage manga={manga} />;
};

const ProfilePageWrapper = () => {
  const { userId } = useUser();

  if (!userId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return <ProfilePage userId={userId} />;
};

const App = () => {
  return (
    <UserProvider>
      <MangaProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/manga/:id" element={<MangaPageWrapper />} />
            <Route path="/profile/:id" element={<ProfilePageWrapper />} />
            <Route path="/login" element={<NotificationsSignInPageError />} />
            <Route path="/favorites/:id" element={<FavoritesPage />} />
          </Routes>
        </Router>
      </MangaProvider>
    </UserProvider>
  );
};

export default App;