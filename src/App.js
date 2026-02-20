import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Explore from './pages/Explore';
import Flash from './pages/Flash';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Detail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/flash" element={<Flash />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;