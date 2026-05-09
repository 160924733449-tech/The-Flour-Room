import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function ProductCard({ product }) {
  const { role, updateProduct, removeProduct, addToCart, setShowAuthModal } = useContext(BakeryContext);

  const [editPrice, setEditPrice] = useState(product.price);
  const [editName, setEditName] = useState(product.name);
  const [editImage, setEditImage] = useState(product.image);
  const [editDescription, setEditDescription] = useState(product.description);
  const [showPopup, setShowPopup] = useState(null); // 'save' | 'cart' | null
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    updateProduct(product.id, {
      name: editName,
      price: Number(editPrice),
      image: editImage,
      description: editDescription
    });
    setShowPopup('save');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    removeProduct(product.id);
    setShowDeleteConfirm(false);
  };

  const handleAddToCart = () => {
    if (role === 'guest') {
      setShowAuthModal(true);
      return;
    }
    addToCart(product);
    setShowPopup('cart');
  };

  return (
    <>
      <div className="product-card">
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} />
          {role === 'admin' && (
            <input 
              type="text" 
              className="admin-input" 
              value={editImage} 
              onChange={(e) => setEditImage(e.target.value)} 
              placeholder="Image URL"
              style={{ position: 'absolute', top: 8, left: 8, width: 'calc(100% - 16px)', background: 'rgba(255,255,255,0.9)', zIndex: 10, padding: '8px', borderRadius: '4px' }}
            />
          )}
        </div>
        <div className="product-info">
          {role === 'admin' ? (
            <div style={{ marginBottom: '16px' }}>
              <input 
                type="text" 
                className="admin-input" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}
              />
              <div className="flex items-center gap-4">
                <span style={{ color: 'var(--sage)', fontWeight: 'bold' }}>₹</span>
                <input 
                  type="number" 
                  className="admin-input" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)} 
                />
              </div>
            </div>
          ) : (
            <div className="product-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h3>
              <p className="product-price">₹{product.price}</p>
            </div>
          )}
          
          {role === 'admin' ? (
            <textarea 
              className="admin-input" 
              value={editDescription} 
              onChange={(e) => setEditDescription(e.target.value)} 
              style={{ width: '100%', minHeight: '80px', marginBottom: '24px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem' }}
            />
          ) : (
            <p className="product-desc">{product.description}</p>
          )}
          
          {role === 'admin' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>SAVE</button>
              <button 
                className="btn-outline" 
                style={{ flex: 1, borderColor: '#ff4d4d', color: '#ff4d4d' }} 
                onClick={handleDelete}
              >
                DELETE
              </button>
            </div>
          ) : (
            <button className="btn-outline" style={{ width: '100%' }} onClick={handleAddToCart}>ADD TO CART</button>
          )}
        </div>
      </div>

      {showDeleteConfirm && createPortal(
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-icon" style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}>!</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '8px' }}>Remove Product?</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Are you sure you want to remove <strong>{product.name}</strong> from the menu? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                style={{ background: '#ff4d4d', borderColor: '#ff4d4d' }} 
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showPopup && createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <div className="modal-icon">✓</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '8px' }}>
              {showPopup === 'save' ? 'Changes Saved!' : 'Added to Cart!'}
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              {showPopup === 'save' 
                ? 'The product details have been updated successfully.'
                : `${product.name} has been added to your cart.`}
            </p>
            
            {showPopup === 'save' ? (
              <button className="btn-primary" onClick={() => setShowPopup(null)}>Awesome</button>
            ) : (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-outline" onClick={() => setShowPopup(null)}>Continue Shopping</button>
                <button className="btn-primary" onClick={() => navigate('/cart')}>View Cart</button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
