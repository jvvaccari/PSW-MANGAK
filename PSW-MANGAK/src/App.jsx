import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MangaLandingPage from "./pages/MangaLandingPage";
import Catalog_Page from "./pages/Catalog_Page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog_Page />} />
        <Route path="/manga/:id" element={<MangaLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;