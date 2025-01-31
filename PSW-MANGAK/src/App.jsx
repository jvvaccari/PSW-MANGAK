import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

// Redux
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { loadUserFromStorage } from "./redux/authSlice";

// Components / Pages
import ProtectedRoute from "./routes/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
// Lazy loading other components
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

function AppWrapper() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (loading) {
    return (
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
    );
  }

  return (
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
            <ProtectedRoute roleRequired="admin">
              <MangaAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluations/:mangaId"
          element={
            <ProtectedRoute>
              <EvaluationPage />
            </ProtectedRoute>
          }
        />
        <Route path="/authors/:authorId" element={<AuthorDetails />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-author"
          element={
            <ProtectedRoute roleRequired="admin">
              <AuthorAdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<CatalogPage />} />
      </Routes>
    </Suspense>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node,
};

const App = () => {
  return (
    <Provider store={store}>
      <Router> {/* Certifique-se de que o Router envolve o AppWrapper */}
        <AppWrapper />
      </Router>
    </Provider>
  );
};

export default App;
