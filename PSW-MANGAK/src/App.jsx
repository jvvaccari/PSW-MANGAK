// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllMangasPage from './pages/AllMangasPage';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllMangasPage />} />
        <Route path="/manga/:id" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
