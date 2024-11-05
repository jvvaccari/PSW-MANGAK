import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import GalleryPage from './pages/GalleryPage';
import AllMangasPage from './pages/AllMangasPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '16px', textAlign: 'center' }}>
        <Link to="/" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/mangas" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Mangas</Link>
        <Link to="/gallery" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Galeria</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mangas" element={<AllMangasPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
