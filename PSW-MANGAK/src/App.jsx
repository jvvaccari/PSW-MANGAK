import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MangaLandingPage from "./pages/MangaLandingPage";
import AccountPage from "./pages/AccountPage";
// import AnotherPage from "./pages/AnotherPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountPage />} />
        {/* <Route path="/another" element={<AnotherPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;