import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './components/Cart';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';

function AppContent() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <AuthModal />
      <Navbar />
      
      <div className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h2 className="footer-brand">The Flour Room</h2>
              <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '24px' }}>
                A humble home kitchen run by a passionate college teacher. I bake in my free time to share the simple joy of homemade treats with you.
              </p>
            </div>
            
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="#">Our Menu</a></li>
                <li><a href="#">Catering</a></li>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Visit Us</h4>
              <ul>
                <li>123 Baker Street</li>
                <li>New York, NY 10001</li>
                <li><br/></li>
                <li>Mon-Fri: 6am - 4pm</li>
                <li>Sat-Sun: 7am - 3pm</li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Newsletter</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '16px' }}>Stay updated on new seasonal pastries and special offers.</p>
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button className="btn-primary" style={{ width: '100%', background: 'var(--soft-gold)', color: 'var(--charcoal)' }}>Subscribe</button>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2026 The Flour Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default AppContent;
