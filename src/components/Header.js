import React from "react";
import Image from "next/image";
import Head from "next/head";

const Header = () => {
  const logo1Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAxNzk3LCJleHAiOjIwODMxNjE3OTd9.W7JCUShYHSVZwNLqBFRjbCuaRVwrb5LcQVgW0-vaHoA";
  const logo2Url =
    "https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3Njc4MDE5NDUsImV4cCI6MjA4MzE2MTk0NX0.UH7bIc1XdtoAHdOJi8IeLRGNjwuTRI0Fzrdrehdak5E";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={logo1Url} />
        <link rel="preload" as="image" href={logo2Url} />
      </Head>
      <div className="logo-container">
        <div className="logo-wrapper">
          <Image
            src={logo1Url}
            alt="Logo 1"
            className="logo"
            width={100}
            height={100}
          />
        </div>
        <h1>
          Electrical Maintenance and Research Club (EMRC)
          <br />
          Govt. Engineering College, Sreekrishnapuram
        </h1>
        <div className="logo-wrapper">
          <Image
            src={logo2Url}
            alt="Logo 2"
            className="logo"
            width={128}
            height={153}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
