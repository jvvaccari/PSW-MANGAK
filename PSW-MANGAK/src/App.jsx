import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
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
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import FavoritesPage from "./pages/FavoritesPage";
import MangaAdminPage from "./pages/MangaAdminPage";
import RegisterPage from "./pages/RegisterPage";
import EvaluationPage from "./pages/EvaluationPage";
import AuthorDetails from "./pages/AuthorPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AuthorAdminPage from "./pages/AuthorAdminPage";
import FavoriteListDetails from "./pages/FavoriteListDetails";

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
        path="/favorites/:id"
        element={
          <ProtectedRoute>
            <FavoriteListDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-manga"
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
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node,
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppWrapper />
      </Router>
    </Provider>
  );
};

export default App;
