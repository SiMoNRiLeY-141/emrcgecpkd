import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  const logo1Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAxNzk3LCJleHAiOjIwODMxNjE3OTd9.W7JCUShYHSVZwNLqBFRjbCuaRVwrb5LcQVgW0-vaHoA";
  const logo2Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3Njc4MDE5NDUsImV4cCI6MjA4MzE2MTk0NX0.UH7bIc1XdtoAHdOJi8IeLRGNjwuTRI0Fzrdrehdak5E";

  return (
    <div className="logo-container">
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
            priority={true}
            quality={65}
            sizes="100px"
          />
        </motion.div>
        
        <h1>
          Electrical Maintenance and Research Club (EMRC)
          <br />
          <span 
            style={{ fontSize: '0.6em', color: 'var(--text-secondary)', background: 'none', WebkitTextFillColor: 'var(--text-secondary)' }}
          >
            Govt. Engineering College, Sreekrishnapuram
          </span>
        </h1>

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
            priority={true}
            quality={65}
            sizes="128px"
          />
        </motion.div>
      </div>
  );
};

export default Header;
