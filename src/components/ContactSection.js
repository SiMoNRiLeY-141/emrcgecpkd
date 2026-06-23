import React from "react";
import { m } from "framer-motion";
import { playClick, playHover } from "../utils/audio";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--accent-primary)">
    <path d="M3 6.25A2.25 2.25 0 0 1 5.25 4h13.5A2.25 2.25 0 0 1 21 6.25v11.5A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 17.75V6.25Zm1.75.41v.32l7.25 5.33 7.25-5.33v-.32a.5.5 0 0 0-.5-.5H5.25a.5.5 0 0 0-.5.5Zm14.5 2.49-6.73 4.95a.88.88 0 0 1-1.04 0L4.75 9.15v8.6c0 .28.22.5.5.5h13.5c.28 0 .5-.22.5-.5v-8.6Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.94 1.31a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38ZM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 1.75A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M5.08 3.5a1.58 1.58 0 1 1 0 3.16 1.58 1.58 0 0 1 0-3.16ZM3.75 8h2.66v12H3.75V8Zm6.13 0h2.55v1.64h.04c.35-.67 1.22-1.37 2.51-1.37 2.68 0 3.17 1.76 3.17 4.05V20h-2.65v-6.35c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.43 1.65-2.43 3.36V20H9.88V8Z" />
  </svg>
);

const contactTitle = " CONTACT_COMMUNICATION_NODES";
const contactEmail = "emrc[at]gecskp[dot]ac[dot]in";
const instagramText = " INSTAGRAM";
const linkedinText = " LINKEDIN";

const ContactSection = () => {
  return (
    <m.div
      className="hud-panel relative overflow-hidden rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px] text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-primary/45 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-primary/45 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-primary/45 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-primary/45 rounded-br-lg" />

      {/* Node Status */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-accent-primary/60 tracking-widest select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span>LINK_ESTABLISHED</span>
      </div>

      <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] uppercase text-glow-cyan">
        {contactTitle}
      </h2>

      <div className="hud-line mb-8" />

      <m.div 
        className="contact-email flex items-center justify-center gap-2.5 mb-8 cursor-pointer font-mono text-xs md:text-sm tracking-wider uppercase text-text-secondary hover:text-accent-primary transition-colors pointer-events-auto"
        whileHover={{ scale: 1.02 }}
        onHoverStart={playHover}
        onClick={playClick}
      >
        <MailIcon />
        <p className="m-0">{contactEmail}</p>
      </m.div>

      <div className="social-links flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 pointer-events-auto font-mono text-xs">
        <m.a
          href="https://www.instagram.com/emrc_gec"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn flex items-center gap-2 py-3 px-6 bg-black/40 border border-accent-primary/10 rounded-full text-text-primary no-underline transition-all duration-300 hover:border-accent-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          whileHover={{ scale: 1.05 }}
          onHoverStart={playHover}
          onClick={playClick}
        >
          <InstagramIcon />{instagramText}
        </m.a>
        <m.a
          href="https://www.linkedin.com/company/emrc-gecpkd"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn flex items-center gap-2 py-3 px-6 bg-black/40 border border-accent-primary/10 rounded-full text-text-primary no-underline transition-all duration-300 hover:border-accent-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          whileHover={{ scale: 1.05 }}
          onHoverStart={playHover}
          onClick={playClick}
        >
          <LinkedInIcon />{linkedinText}
        </m.a>
      </div>
    </m.div>
  );
};

export default ContactSection;
