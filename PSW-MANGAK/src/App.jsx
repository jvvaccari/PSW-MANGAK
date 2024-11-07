// App.js
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MangaLandingPage from "./pages/MangaLandingPage";
import CatalogPage from "./pages/CatalogPage";

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado de pesquisa global

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} /> {/* Passando searchTerm e setSearchTerm */}
        <Route path="/manga/:id" element={<MangaLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
