import React, { useContext, useState } from 'react';
import { BakeryContext } from '../context/BakeryContext';

export default function AdminPanel() {
  const { addProduct } = useContext(BakeryContext);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' });

  const handleAdd = () => {
    if (newProduct.name && newProduct.price) {
      addProduct({ ...newProduct, price: Number(newProduct.price) });
      setIsAdding(false);
      setNewProduct({ name: '', price: '', description: '', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' });
    }
  };

  if (!isAdding) {
    return (
      <div className="add-product-card" onClick={() => setIsAdding(true)}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(125, 132, 113, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '32px' }}>+</span>
        </div>
        <p style={{ fontWeight: 'bold' }}>Add New Product</p>
      </div>
    );
  }

  return (
    <div className="product-card" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Add New Product</h3>
      <input 
        type="text" 
        className="admin-input" 
        placeholder="Product Name" 
        value={newProduct.name}
        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
      />
      <input 
        type="number" 
        className="admin-input" 
        placeholder="Price" 
        value={newProduct.price}
        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
      />
      <textarea 
        className="admin-input" 
        placeholder="Description" 
        value={newProduct.description}
        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
        style={{ minHeight: '60px', marginTop: '8px' }}
      />
      <div className="flex gap-4" style={{ marginTop: '16px' }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Add</button>
        <button className="btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
      </div>
    </div>
  );
}
