// components/ContactSection.js
import React from 'react';

const ContactSection = () => {
  return (
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>Email: emrc@gecskp.ac.in</p>
      <div className="social-links">
        <a
          href="https://www.instagram.com/emrc_gec"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/company/emrc-gecpkd"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default ContactSection;
