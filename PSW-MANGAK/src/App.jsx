import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider } from "./contexts/AuthContext";
import { MangaProvider } from "./contexts/MangaContext";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => (
  <AuthProvider>
    <UserProvider>
      <MangaProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<CatalogPage />} />
            <Route path="/manga/:id" element={<MangaLandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Protegidas */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

            {/* Rota Fallback */}
            <Route path="*" element={<CatalogPage />} />
          </Routes>
        </Router>
      </MangaProvider>
    </UserProvider>
  </AuthProvider>
);

export default App;