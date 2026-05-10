import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function Cart() {
  const { cart, removeFromCart, currentUser } = useContext(BakeryContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <section className="dashboard" style={{ minHeight: '60vh', padding: '80px 0' }}>
      <div className="container">
        <div className="cart-header">
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Your Cart</h2>
          <button className="btn-outline" onClick={() => navigate('/')}>Back to Menu</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Your cart is looking a little light.</h2>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '1.1rem' }}>Let's fix that with something sweet.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Menu</button>
          </div>
        ) : (
          <div className="dashboard-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" loading="lazy" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</h4>
                    <p style={{ color: 'var(--sage)', fontWeight: 'bold', marginTop: '4px' }}>₹{item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', padding: '8px', minHeight: '44px', whiteSpace: 'nowrap' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
                <span style={{ color: '#666' }}>Subtotal ({cart.length} items)</span>
                <span style={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.1rem' }}>
                <span style={{ color: '#666' }}>Taxes & Fees</span>
                <span style={{ fontWeight: 'bold' }}>₹0.00</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(125, 132, 113, 0.2)', marginBottom: '24px' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--sage)' }}>
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
