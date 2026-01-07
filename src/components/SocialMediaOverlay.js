// components/SocialMediaOverlay.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const SocialMediaOverlay = () => {
  return (
    <div className="social-media-overlay">
      <a
        href="https://www.instagram.com/emrc_gec"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our Instagram page"
      >
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      <a
        href="https://www.linkedin.com/company/emrc-gecpkd"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our LinkedIn page"
      >
        <FontAwesomeIcon icon={faLinkedin} size="2x" />
      </a>
      <a
        href="mailto:emrc@gecskp.ac.in"
        aria-label="Send us an email"
      >
        <FontAwesomeIcon icon={faEnvelope} size="2x" />
      </a>
    </div>
  );
};

export default SocialMediaOverlay;
