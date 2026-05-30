// components/ContactSection.js
import React from "react";
import { m } from "framer-motion";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent-primary)">
    <path d="M3 6.25A2.25 2.25 0 0 1 5.25 4h13.5A2.25 2.25 0 0 1 21 6.25v11.5A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 17.75V6.25Zm1.75.41v.32l7.25 5.33 7.25-5.33v-.32a.5.5 0 0 0-.5-.5H5.25a.5.5 0 0 0-.5.5Zm14.5 2.49-6.73 4.95a.88.88 0 0 1-1.04 0L4.75 9.15v8.6c0 .28.22.5.5.5h13.5c.28 0 .5-.22.5-.5v-8.6Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.94 1.31a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38ZM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 1.75A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M5.08 3.5a1.58 1.58 0 1 1 0 3.16 1.58 1.58 0 0 1 0-3.16ZM3.75 8h2.66v12H3.75V8Zm6.13 0h2.55v1.64h.04c.35-.67 1.22-1.37 2.51-1.37 2.68 0 3.17 1.76 3.17 4.05V20h-2.65v-6.35c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.43 1.65-2.43 3.36V20H9.88V8Z" />
  </svg>
);

const contactTitle = "Contact Us";
const contactEmail = "emrc[at]gecskp[dot]ac[dot]in";
const instagramText = " Instagram";
const linkedinText = " LinkedIn";

const ContactSection = () => {
  return (
    <m.div
      className="glass-panel contact-section bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        {contactTitle}
      </h2>
      <m.div className="contact-email flex items-center justify-center gap-2.5 mb-5 cursor-pointer" whileHover={{ scale: 1.05 }}>
        <MailIcon />
        <p className="m-0 text-[1.2rem] text-text-secondary leading-[1.6]">{contactEmail}</p>
      </m.div>
      <div className="social-links flex flex-col md:flex-row justify-center items-center gap-2.5 md:gap-5 mt-5">
        <m.a
          href="https://www.instagram.com/emrc_gec"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn flex items-center gap-2 py-2.5 px-5 bg-white/5 rounded-[30px] text-text-primary no-underline transition-all duration-300"
          whileHover={{
            background:
              "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            scale: 1.1,
          }}
        >
          <InstagramIcon />{instagramText}
        </m.a>
        <m.a
          href="https://www.linkedin.com/company/emrc-gecpkd"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn flex items-center gap-2 py-2.5 px-5 bg-white/5 rounded-[30px] text-text-primary no-underline transition-all duration-300"
          whileHover={{ background: "#0077b5", scale: 1.1 }}
        >
          <LinkedInIcon />{linkedinText}
        </m.a>
      </div>
    </m.div>
  );
};

export default ContactSection;
