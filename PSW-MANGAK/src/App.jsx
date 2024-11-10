// App.js
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import MangaLandingPage from "./pages/MangaLandingPage";
import PropTypes from "prop-types";
import mangas from "./BD/mangasData";

const MangaPageWrapper = ({ searchTerm, setSearchTerm }) => {
  const { id } = useParams();
  const manga = mangas.find((m) => m.id.toString() === id);

  return (
    <MangaLandingPage
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      manga={manga}
    />
  );
};

MangaPageWrapper.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<CatalogPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        />
        <Route
          path="/manga/:id"
          element={<MangaPageWrapper searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        />
      </Routes>
    </Router>
  );
};

export default App;