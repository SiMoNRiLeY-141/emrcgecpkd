import React from "react";
import Image from "next/image";
import { m } from "framer-motion";

const titleText = "Electrical Maintenance and Research Club (EMRC)";
const subTitleText = "Govt. Engineering College, Sreekrishnapuram";

const Header = () => {
  const logo1Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAxNzk3LCJleHAiOjIwODMxNjE3OTd9.W7JCUShYHSVZwNLqBFRjbCuaRVwrb5LcQVgW0-vaHoA";
  const logo2Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3Njc4MDE5NDUsImV4cCI6MjA4MzE2MTk0NX0.UH7bIc1XdtoAHdOJi8IeLRGNjwuTRI0Fzrdrehdak5E";

  return (
    <div className="logo-container flex flex-col md:flex-row justify-between items-center gap-[15px] md:gap-5 mb-10 md:mb-[60px] py-[30px] md:py-5 px-5 md:px-10 bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[30px] md:rounded-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] text-center md:text-left">
      <m.div
        className="logo-wrapper flex-shrink-0 [filter:drop-shadow(0_0_15px_rgba(0,240,255,0.2))] w-20 md:w-auto"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={logo1Url}
          alt="Logo 1"
          className="logo max-w-full h-auto"
          width={100}
          height={100}
          priority={true}
          quality={65}
          sizes="100px"
        />
      </m.div>

      <h1 className="text-[clamp(1.2rem,3vw,2rem)] bg-gradient-to-r from-accent-primary to-text-primary bg-clip-text [-webkit-text-fill-color:transparent] text-center font-bold leading-[1.4]">
        {titleText}
        <br />
        <span
          className="text-[0.6em] text-text-secondary bg-none [-webkit-text-fill-color:var(--text-secondary)] font-normal"
        >
          {subTitleText}
        </span>
      </h1>

      <m.div
        className="logo-wrapper flex-shrink-0 [filter:drop-shadow(0_0_15px_rgba(0,240,255,0.2))] w-[100px] md:w-auto"
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={logo2Url}
          alt="Logo 2"
          className="logo max-w-full h-auto"
          width={128}
          height={153}
          priority={true}
          quality={65}
          sizes="128px"
        />
      </m.div>
    </div>
  );
};

export default Header;
