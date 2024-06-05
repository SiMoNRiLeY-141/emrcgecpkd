import React from "react";
import Image from "next/image";
import Head from "next/head";

const Header = () => {
  const logo1Url =
    "https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/emrc.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzE3NTcxNDY0LCJleHAiOjIwMzI5MzE0NjR9.hxUAaSoUgf3Her8CiMUdjIaTDYr1d_hGrOUZR3VL3wI&t=2024-06-05T07%3A11%3A05.557Z";
  const logo2Url =
    "https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/gec.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLndlYnAiLCJpYXQiOjE3MTc1NzE0MDIsImV4cCI6MjAzMjkzMTQwMn0.ombayM0Wj-ReJuyJCUrqX5dZ-EE1JmJoTPZ76h9voTg&t=2024-06-05T07%3A10%3A03.768Z";

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
