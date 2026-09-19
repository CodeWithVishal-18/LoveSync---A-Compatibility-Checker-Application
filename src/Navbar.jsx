import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

export default function Navbar() {
  const location = useLocation();
  const isResultPage = location.pathname === '/result';

  return (
    <nav className="navbar navbar-expand love-navbar py-2">
      <div className="container px-3 px-md-4 d-flex justify-content-between align-items-center">
        <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2 m-0 fs-5 fs-md-4" to="/">
          <span className="brand-heart text-danger d-inline-flex align-items-center">
            <FaHeart className="fs-4 fs-md-3" style={{ color: '#ff2d55' }} />
          </span>
          <span style={{ letterSpacing: '-0.5px' }}>
            Love<span style={{ color: '#ff7597' }}>Sync</span>
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          <span className="d-none d-lg-inline text-white-50 small">
            Astrological & Relationship Harmony
          </span>
          {isResultPage && (
            <Link to="/" className="btn btn-love-outline btn-sm px-2 px-md-3 d-inline-flex align-items-center gap-1">
              <FiRefreshCw className="small" /> 
              <span>New Match</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}