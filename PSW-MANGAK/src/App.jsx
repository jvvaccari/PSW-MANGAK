import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
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
const MangaAdminPage = lazy(() => import("./pages/MangaAdminPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const EvaluationPage = lazy(() => import("./pages/EvaluationPage"));
const AuthorDetails = lazy(() => import("./pages/AuthorPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AuthorAdminPage = lazy(() => import("./pages/AuthorAdminPage"));
const FavoriteListDetails = lazy(() => import("./pages/FavoriteListDetails"));

const App = () => {
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
                    bgcolor: "var(--bg-page-color)",
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
                  path="/favorites/lists/:id"
                  element={
                    <ProtectedRoute>
                      <FavoriteListDetails />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin-manga/:id"
                  element={
                    <ProtectedRoute role="admin">
                      <MangaAdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluations/:mangaId/:userId"
                  element={
                    <ProtectedRoute>
                      <EvaluationPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/author/:authorId" element={<AuthorDetails />} />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin-author"
                  element={
                    <ProtectedRoute role="admin">
                      <AuthorAdminPage />
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
