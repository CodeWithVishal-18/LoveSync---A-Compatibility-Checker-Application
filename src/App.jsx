import React from 'react';
import Navbar from './Navbar';
import FloatingHearts from './components/FloatingHearts';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-shell min-vh-100 d-flex flex-column position-relative">
      <FloatingHearts />
      <Navbar />
      <main className="app-main flex-grow-1 d-flex flex-column justify-content-center py-2 py-lg-1">
        <Outlet />
      </main>
      <footer className="app-footer text-center py-2 text-white-50 small" style={{ position: 'relative', zIndex: 2 }}>
        Crafted with 💖 by LoveSync - Destined connections made simple
      </footer>
    </div>
  );
}