import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Ambient from './components/Ambient';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Explore from './pages/Explore';
import Flash from './pages/Flash';
import Saved from './pages/Saved';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <LibraryProvider>
            <Ambient />
            <div className="app">
              <Nav />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/:id" element={<Detail />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/flash" element={<Flash />} />
                <Route path="/saved" element={<Saved />} />
              </Routes>
            </div>
          </LibraryProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
