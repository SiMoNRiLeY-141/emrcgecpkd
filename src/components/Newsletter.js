// components/Newsletter.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="glass-panel newsletter-container"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <h2>Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.button>
      </form>
      {status && (
        <motion.p 
          className="status-message" style={{ color: "var(--accent-primary)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Newsletter;
