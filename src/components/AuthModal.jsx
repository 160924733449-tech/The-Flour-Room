import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function AuthModal() {
  const { login, signup, showAuthModal, setShowAuthModal } = useContext(BakeryContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = isLogin ? login(username, password) : signup(username, password);
    
    if (!result.success) {
      setError(result.message);
    } else {
      setShowAuthModal(false);
      setUsername('');
      setPassword('');
    }
  };

  return createPortal(
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>
          {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
        </h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          {isLogin ? 'Log in to access your account' : 'Sign up to track orders and save favorites'}
        </p>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              className="admin-input" 
              style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid rgba(125, 132, 113, 0.2)' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="admin-input" 
              style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid rgba(125, 132, 113, 0.2)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '1rem' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--terracotta)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
        
        <button 
          onClick={() => setShowAuthModal(false)}
          style={{ marginTop: '16px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}

