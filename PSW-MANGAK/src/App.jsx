// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllMangasPage from './pages/AllMangasPage';
import MangaViewer from './pages/MangaViewer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllMangasPage />} />
        <Route path="/manga/:id" element={<MangaViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
