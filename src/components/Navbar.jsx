import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function Navbar() {
  const { role, currentUser, logout, cart } = useContext(BakeryContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar glass-card">
      <div className="container navbar-container">
        <div className="flex items-center gap-4">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>The Flour Room</Link>
        </div>
        
        <div className="nav-actions">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hide-mobile" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Welcome, {currentUser} {role === 'admin' ? '(Admin)' : ''}
              </span>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Login / Sign Up
            </button>
          )}
          
          <button 
            className="btn-outline" 
            onClick={() => navigate('/cart')}
          >
            Cart ({cart.length})
          </button>
        </div>
      </div>
    </header>
  );
}
