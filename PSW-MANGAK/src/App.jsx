import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { MangaProvider } from "./contexts/MangaContext";
import { UserProvider } from "./contexts/UserContext";
import { Box, CircularProgress } from "@mui/material";
import ProtectedRoute from "./routes/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CommentsPage = lazy(() => import("./pages/CommentsPage"));

const App = () => {
  useEffect(() => {
    // Pré-carregar páginas em segundo plano
    import("./pages/ProfilePage");
    import("./pages/LoginPage");
    import("./pages/FavoritesPage");
    import("./pages/AdminPage");
    import("./pages/RegisterPage");
    import("./pages/CommentsPage");
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <MangaProvider>
          <Router>
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "var(--bg-page-colorr)",
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/manga/:id" element={<MangaLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/profile/:id"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites/:id"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/:id"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/comments/:mangaId"
                  element={
                    <ProtectedRoute>
                      <CommentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<CatalogPage />} />
              </Routes>
            </Suspense>
          </Router>
        </MangaProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;