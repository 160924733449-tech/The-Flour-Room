import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function UserDashboard() {
  const { orders, cart, addToCart } = useContext(BakeryContext);
  const navigate = useNavigate();

  const pastItems = orders.flatMap(order => 
    order.items.map((item, idx) => ({ ...item, orderDate: order.date, uniqueId: `${order.id}-${idx}` }))
  ).slice(0, 4);

  return (
    <section className="dashboard">
      <div className="container">
        <h2 className="dashboard-title">Welcome back, Baker!</h2>

        {cart.length > 0 && (
          <div className="dashboard-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', marginLeft: '8px' }}>
                {cart.slice(0, 3).map((item, idx) => (
                  <img 
                    key={idx} 
                    src={item.image} 
                    alt={item.name} 
                    style={{ 
                      width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%', 
                      border: '2px solid white', marginLeft: idx > 0 ? '-16px' : '0', 
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                    }} 
                  />
                ))}
                {cart.length > 3 && (
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cream)', 
                    border: '2px solid white', marginLeft: '-16px', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', 
                    fontWeight: 'bold', color: 'var(--terracotta)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}>
                    +{cart.length - 3}
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>You have {cart.length} item{cart.length > 1 ? 's' : ''} waiting</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {cart.map(item => item.name).slice(0, 2).join(', ')} {cart.length > 2 ? 'and more...' : ''}
                </p>
              </div>
            </div>
            <button className="btn-primary" onClick={() => navigate('/cart')}>Continue to Cart</button>
          </div>
        )}
        
        {pastItems.length > 0 && (
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', color: 'var(--terracotta)', marginBottom: '16px' }}>
                Your Favorites & History
              </h4>
              <div className="orders-row">
                {pastItems.map(item => (
                  <div key={item.uniqueId} className="order-card">
                    <img src={item.image} alt={item.name} className="order-img" />
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '12px' }}>Ordered {item.orderDate}</p>
                    <button 
                      onClick={() => {
                        addToCart(item);
                        navigate('/cart');
                      }}
                      style={{ color: 'var(--terracotta)', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      REORDER
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
