import React, { useContext } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import UserDashboard from '../components/UserDashboard';
import AdminPanel from '../components/AdminPanel';
import Reviews from '../components/Reviews';
import { BakeryContext } from '../context/BakeryContext';

export default function Home() {
  const { role, products, refreshData } = useContext(BakeryContext);

  return (
    <>
      <Hero />
      
      {role === 'user' && <UserDashboard />}
      
      <section className="product-section container animate-fade-up delay-200">
        <div className="product-section-header">
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: 0 }}>The Artisanal Collection</h2>
            <div style={{ width: '96px', height: '4px', backgroundColor: 'var(--terracotta)', marginTop: '8px' }}></div>
          </div>
          
          {role === 'admin' && (
            <div className="flex gap-4 flex-wrap">
              <button className="btn-primary" onClick={() => alert("Inventory is automatically synced to your Google Sheet!")}>
                Export Status
              </button>
              <button className="btn-outline" onClick={() => {
                refreshData();
                alert("Fetching latest data from Google Sheets...");
              }}>
                Bulk Update (Sync)
              </button>
            </div>
          )}
        </div>
        
        <div className="product-grid">
          {role === 'admin' && <AdminPanel />}
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div className="animate-fade-up delay-300">
        <Reviews />
      </div>
    </>
  );
}
