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
            <div className="hero-special-card">
              <img 
                src="/pastry.png" 
                alt="Daily Special" 
                className="hero-special-img"
                loading="lazy"
              />
              <div>
                <p className="hero-special-label">Daily Special</p>
                <p className="hero-special-name">Golden Almond Biscuits</p>
              </div>
            </div>
          </div>
          
          <div className="hero-image-container animate-fade-up delay-200">
            <img src="/hero.png" alt="Artisanal Bakery Spread" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
