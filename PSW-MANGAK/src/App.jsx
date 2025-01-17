import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { MangaProvider } from "./contexts/MangaContext";
import { UserProvider } from "./contexts/UserContext";
import { Provider } from 'react-redux';
import store from './redux/store';

import ProtectedRoute from "./routes/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
import PropTypes from "prop-types";

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

const AppProviders = ({ children }) => (
  <Provider store={store}> {/* Wrap with Redux Provider */}
    <AuthProvider>
      <UserProvider>
        <MangaProvider>{children}</MangaProvider>
      </UserProvider>
    </AuthProvider>
  </Provider>
);

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <AppProviders>
      <Router>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
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
    </AppProviders>
  );
};

export default App;
