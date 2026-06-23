import React from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { playClick, playHover } from "../utils/audio";

const titleText = "Electrical Maintenance and Research Club (EMRC)";
const subTitleText = "Govt. Engineering College, Sreekrishnapuram";

const Header = () => {
  const logo1Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAxNzk3LCJleHAiOjIwODMxNjE3OTd9.W7JCUShYHSVZwNLqBFRjbCuaRVwrb5LcQVgW0-vaHoA";
  const logo2Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3Njc4MDE5NDUsImV4cCI6MjA4MzE2MTk0NX0.UH7bIc1XdtoAHdOJi8IeLRGNjwuTRI0Fzrdrehdak5E";

  return (
    <div className="logo-container flex flex-col md:flex-row justify-between items-center gap-[15px] md:gap-5 mb-10 md:mb-[60px] py-[24px] md:py-4 px-6 md:px-12 hud-panel rounded-[24px] md:rounded-[100px] text-center md:text-left relative overflow-hidden">
      {/* Background status scanner line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent animate-pulse" />

      <m.div
        className="logo-wrapper flex-shrink-0 [filter:drop-shadow(0_0_12px_rgba(0,240,255,0.2))] w-16 md:w-auto cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
        onHoverStart={playHover}
        onClick={playClick}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={logo1Url}
          alt="EMRC Logo"
          className="logo max-w-full h-auto"
          width={80}
          height={80}
          priority={true}
          quality={65}
          sizes="80px"
        />
      </m.div>

      <div className="flex-grow">
        <h1 className="text-[clamp(1.1rem,2.8vw,1.75rem)] bg-gradient-to-r from-accent-primary to-text-primary bg-clip-text [-webkit-text-fill-color:transparent] text-center font-bold leading-[1.3] tracking-[0.5px]">
          {titleText}
        </h1>
        <p className="text-[11px] md:text-[12px] text-text-secondary uppercase tracking-[3px] text-center mt-1">
          {subTitleText}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <m.div
          className="logo-wrapper flex-shrink-0 [filter:drop-shadow(0_0_12px_rgba(0,240,255,0.2))] w-16 md:w-auto cursor-pointer"
          whileHover={{ scale: 1.1, rotate: -5 }}
          onHoverStart={playHover}
          onClick={playClick}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={logo2Url}
            alt="GEC Logo"
            className="logo max-w-full h-auto"
            width={72}
            height={86}
            priority={true}
            quality={65}
            sizes="72px"
          />
        </m.div>
      </div>
    </div>
  );
};

export default Header;
