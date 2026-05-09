import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BakeryContext } from '../context/BakeryContext';

export default function CheckoutPage() {
  const { cart, currentUser, placeOrder, sendWhatsAppBotMessage, addReview } = useContext(BakeryContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const WHATSAPP_NUMBER = "916301607490";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (rating) => {
    addReview({
      rating,
      text: "Quick rating from order flow",
      author: formData.firstName || "Guest",
      tag: "Verified Customer"
    });
    setReviewSubmitted(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // 1. Format the message
    const itemDetails = cart.map(item => `- ${item.name} (₹${item.price.toFixed(2)})`).join('\n');
    const message = `*New Order from The Flour Room!* 🥖\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Address: ${formData.address}, ${formData.city}, ${formData.zipCode}\n\n` +
      `*Order Summary:*\n` +
      `${itemDetails}\n\n` +
      `*Total Amount: ₹${totalPrice.toFixed(2)}*\n\n` +
      `Please confirm my order. Thank you!`;

    // 2. Record order in system
    placeOrder({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.zipCode}`
    });

    // 3. Try sending via Bot
    const botResult = await sendWhatsAppBotMessage(message);

    if (botResult.success) {
      setIsProcessing(false);
      setIsSuccess(true);
    } else {
      // Fallback to wa.me if bot is not configured or fails
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setIsProcessing(false);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card animate-fade-up" style={{ textAlign: 'center', maxWidth: '600px', padding: '64px' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'var(--sage-light)', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px',
            color: 'var(--sage)', fontSize: '2rem'
          }}>
            ✓
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '16px' }}>Order Sent!</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '48px' }}>
            We've opened WhatsApp to complete your order. If it didn't open, please check your popup blocker.
          </p>

          <div style={{ 
            background: 'var(--cream)', padding: '32px', borderRadius: '16px', marginBottom: '32px',
            border: '1px solid rgba(125, 132, 113, 0.1)' 
          }}>
            {!reviewSubmitted ? (
              <>
                <h4 style={{ marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Quick Feedback</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>How was your experience today?</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', fontSize: '2rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => handleReviewSubmit(star)}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s',
                        padding: '4px'
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-fade-up">
                <h4 style={{ marginBottom: '8px', color: 'var(--sage)' }}>Thank you!</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Your feedback helps me grow as a baker.</p>
              </div>
            )}
          </div>
          
          <button className="btn-primary" onClick={() => navigate('/')}>Return to Menu</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="dashboard" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Your cart is looking a little light.</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>Return to Menu</button>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard" style={{ minHeight: '80vh', padding: '80px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Complete Your Order</h2>
          <button className="btn-outline" onClick={() => navigate('/cart')}>Back to Cart</button>
        </div>

        <div className="dashboard-grid">
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid rgba(125, 132, 113, 0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Delivery Details</h3>
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <input name="firstName" type="text" placeholder="First Name" required className="admin-input" style={{ flex: 1, padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.firstName} onChange={handleInputChange} />
                <input name="lastName" type="text" placeholder="Last Name" required className="admin-input" style={{ flex: 1, padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.lastName} onChange={handleInputChange} />
              </div>
              <input name="email" type="email" placeholder="Email Address" required className="admin-input" style={{ padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.email} onChange={handleInputChange} />
              <input name="address" type="text" placeholder="Shipping Address" required className="admin-input" style={{ padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.address} onChange={handleInputChange} />
              <div className="form-row">
                <input name="city" type="text" placeholder="City" required className="admin-input" style={{ flex: 2, padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.city} onChange={handleInputChange} />
                <input name="zipCode" type="text" placeholder="Zip Code" required className="admin-input" style={{ flex: 1, padding: '12px', background: 'var(--cream)', borderRadius: '8px', border: 'none' }} value={formData.zipCode} onChange={handleInputChange} />
              </div>
              
              <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(37, 211, 102, 0.05)', borderRadius: '16px', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>💬</span>
                  <h4 style={{ margin: 0, color: '#075E54' }}>Order via WhatsApp</h4>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Clicking the button below will open WhatsApp with your order details pre-filled. We'll coordinate delivery and payment there!</p>
              </div>

              <button type="submit" disabled={isProcessing} className="btn-primary" style={{ marginTop: '32px', padding: '16px', fontSize: '1.1rem', background: '#25D366', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? 'Processing...' : (
                  <>
                    <span>Confirm & Send on WhatsApp</span>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid rgba(125, 132, 113, 0.1)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--sage)' }}>₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ height: '1px', background: 'rgba(125, 132, 113, 0.2)', marginBottom: '24px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--sage)' }}>
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
