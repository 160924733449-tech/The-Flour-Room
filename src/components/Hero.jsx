import React from 'react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content animate-fade-up">
            <span className="hero-badge">Small-Batch & Homemade</span>
            <h2 className="hero-title">
              Baking After Hours,<br />
              <span>Just for You.</span>
            </h2>
            <p className="hero-desc">
              By day, I'm a college teacher. But once the grading is done, the apron goes on. The Flour Room is my passionate side-project, bringing you small-batch, homemade pastries crafted with love during my free evenings and weekends.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: 'white', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(125, 132, 113, 0.1)', border: '1px solid rgba(125, 132, 113, 0.1)' }}>
              <img 
                src="/pastry.png" 
                alt="Special" 
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Special</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--sage)', margin: 0 }}>Golden Almond Biscuits</p>
              </div>
            </div>
          </div>
          
          <div className="hero-image-container animate-fade-up delay-200">
            <img src="/hero.png" alt="Artisanal Bakery Spread" />
          </div>
        </div>
      </div>
    </section>
  );
}
