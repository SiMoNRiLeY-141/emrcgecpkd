// components/Header.js
import React from 'react';
import Image from 'next/image';

const Header = () => {
  const logo1Url = 'https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/emrc.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy5wbmciLCJpYXQiOjE3MTYzNzg5MTMsImV4cCI6MjAzMTczODkxM30.hlFm7wnGdbBjVs2p3Ac8lzksjPanlzlhCYUDTNLbMG8&t=2024-05-22T11%3A55%3A14.061Z';
  const logo2Url = 'https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/gec.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZ2VjLnBuZyIsImlhdCI6MTcxNjM4OTU1NiwiZXhwIjoyMDMxNzQ5NTU2fQ.dCoSf2oxl0hXwCkiEBlaD97r2wLH_YmC70bccgdQVb4&t=2024-05-22T14%3A52%3A37.104Z';

  return (
    <div className="logo-container">
      <div className="logo-wrapper">
        <Image src={logo1Url} alt="Logo 1" className="logo" width={100} height={100} />
      </div>
      <h1>Electrical Maintenance and Research Club (EMRC)<br />Govt. Engineering College, Sreekrishnapuram</h1>
      <div className="logo-wrapper">
        <Image src={logo2Url} alt="Logo 2" className="logo" width={100} height={100} />
      </div>
    </div>
  );
};

export default Header;
