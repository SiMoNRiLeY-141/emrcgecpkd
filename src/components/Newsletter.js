// components/Newsletter.js
import React, { useState, useEffect } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('Please enter a valid email address.');
      return;
    }

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setStatus(data.message);
          setEmail('');
        } else {
          setStatus(data.error || 'Subscription failed. Please try again later.');
        }
      } catch (error) {
        console.error('Error subscribing:', error);
        setStatus('Subscription failed. Please try again later.');
      }
  };

  return (
    <div className="newsletter-container">
      <h2>Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default Newsletter;
