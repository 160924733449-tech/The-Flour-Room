import React, { useContext } from 'react';
import { BakeryContext } from '../context/BakeryContext';

export default function Reviews() {
  const { reviews } = useContext(BakeryContext);

  return (
    <section className="reviews-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Word of Mouth</h2>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: 'var(--sage)', fontWeight: 'bold' }}>Don't just take our word for it.</p>
        </div>
        
        <div className="masonry">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="stars">
                {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
              </div>
              <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6 }}>
                "{review.text}"
              </blockquote>
              <p style={{ fontWeight: 'bold', color: 'var(--sage)' }}>{review.author}</p>
              {review.tag && <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>{review.tag}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
