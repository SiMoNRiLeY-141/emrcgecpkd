import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  const logo1Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAxNzk3LCJleHAiOjIwODMxNjE3OTd9.W7JCUShYHSVZwNLqBFRjbCuaRVwrb5LcQVgW0-vaHoA";
  const logo2Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3Njc4MDE5NDUsImV4cCI6MjA4MzE2MTk0NX0.UH7bIc1XdtoAHdOJi8IeLRGNjwuTRI0Fzrdrehdak5E";

  return (
    <motion.div 
      className="logo-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <motion.div 
          className="logo-wrapper"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={logo1Url}
            alt="Logo 1"
            className="logo"
            width={100}
            height={100}
            loading="lazy"
            fetchPriority="low"
            quality={65}
            sizes="100px"
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Electrical Maintenance and Research Club (EMRC)
          <br />
          <motion.span 
            style={{ fontSize: '0.6em', color: 'var(--text-secondary)', background: 'none', WebkitTextFillColor: 'var(--text-secondary)' }}
          >
            Govt. Engineering College, Sreekrishnapuram
          </motion.span>
        </motion.h1>

        <motion.div 
          className="logo-wrapper"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={logo2Url}
            alt="Logo 2"
            className="logo"
            width={128}
            height={153}
            loading="lazy"
            fetchPriority="low"
            quality={65}
            sizes="128px"
          />
        </motion.div>
      </motion.div>
  );
};

export default Header;
