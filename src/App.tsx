import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game'; // Import the main game component
import './styles/game.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <div className="ambient-container">
          <div className="ambient-light top-left"></div>
          <div className="ambient-light top-right"></div>
        </div>
        
        <header className="app-header">
          <div className="header-content">
            <span className="status-indicator online"></span>
            <span className="status-text">MISSION CONTROL: ONLINE</span>
          </div>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Game />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <span>&copy; Galactic Rescue Operations • Secure Transmission Protocol v3.7.2</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}
