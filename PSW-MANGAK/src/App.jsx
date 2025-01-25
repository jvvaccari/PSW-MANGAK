// App.jsx (Refactored)
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

// Redux
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { loadUserFromStorage } from "./redux/authSlice"; // or wherever your auth slice is

// Components / Pages
import ProtectedRoute from "./routes/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
// ... other lazy imports
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

/**
 * We create an internal AppWrapper component so we can dispatch
 * loadUserFromStorage once, using hooks (which we can't do in a class or outside the Provider).
 */
function AppWrapper() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Rehydrate user from localStorage on first load
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (loading) {
    // If your auth slice sets loading while fetching user from localStorage
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
              <ProtectedRoute roleRequired="admin">
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
    </Router>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node,
};

/**
 * The main App component that wraps everything in the Redux Provider.
 */
const App = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

export default App;
