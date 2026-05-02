// components/SocialMediaOverlay.js
import React from 'react';
import { m } from 'framer-motion';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.94 1.31a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38ZM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 1.75A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M5.08 3.5a1.58 1.58 0 1 1 0 3.16 1.58 1.58 0 0 1 0-3.16ZM3.75 8h2.66v12H3.75V8Zm6.13 0h2.55v1.64h.04c.35-.67 1.22-1.37 2.51-1.37 2.68 0 3.17 1.76 3.17 4.05V20h-2.65v-6.35c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.43 1.65-2.43 3.36V20H9.88V8Z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M3 6.25A2.25 2.25 0 0 1 5.25 4h13.5A2.25 2.25 0 0 1 21 6.25v11.5A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 17.75V6.25Zm1.75.41v.32l7.25 5.33 7.25-5.33v-.32a.5.5 0 0 0-.5-.5H5.25a.5.5 0 0 0-.5.5Zm14.5 2.49-6.73 4.95a.88.88 0 0 1-1.04 0L4.75 9.15v8.6c0 .28.22.5.5.5h13.5c.28 0 .5-.22.5-.5v-8.6Z" />
  </svg>
);

const SocialMediaOverlay = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <m.div 
      className="social-media-overlay"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <m.a
        href="https://www.instagram.com/emrc_gec"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our Instagram page"
        variants={itemVariants}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <InstagramIcon />
      </m.a>
      <m.a
        href="https://www.linkedin.com/company/emrc-gecpkd"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our LinkedIn page"
        variants={itemVariants}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <LinkedInIcon />
      </m.a>
      <m.a
        href="mailto:emrc@gecskp.ac.in"
        aria-label="Send us an email"
        variants={itemVariants}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <MailIcon />
      </m.a>
    </m.div>
  );
};

export default SocialMediaOverlay;

