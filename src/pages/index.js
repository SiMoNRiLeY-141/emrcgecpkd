import React, { Suspense, lazy } from "react";
import Head from "next/head";

const Header = lazy(() => import("../components/Header"));
const SocialMediaOverlay = lazy(
  () => import("../components/SocialMediaOverlay"),
);
const Committee = lazy(() => import("../components/Committee"));
const ContactSection = lazy(() => import("../components/ContactSection"));
const News = lazy(() => import("../components/News"));
const Newsletter = lazy(() => import("../components/Newsletter"));
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: "EMRC GEC Palakkad",
  alternateName: "Electrical Maintenance and Research Club GEC Palakkad",
  url: "https://emrcgecpkd.vercel.app",
  logo: "https://emrcgecpkd.vercel.app/_next/image?url=https%3A%2F%2Ftptqglihfsppnrrtukvw.supabase.co%2Fstorage%2Fv1%2Fobject%2Fsign%2Fassets%2Flogos%2Femrc.webp%3Ftoken%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzE3NTcxNDY0LCJleHAiOjIwMzI5MzE0NjR9.hxUAaSoUgf3Her8CiMUdjIaTDYr1d_hGrOUZR3VL3wI%26t%3D2024-06-05T07%253A11%253A05.557Z&w=128&q=75",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "Malayalam"],
  },
  member: [
    {
      "@type": "Person",
      name: "Rithin",
      jobTitle: "Chairperson",
      email: "emrc@gecskp.ac.in",
    },
    {
      "@type": "Person",
      name: "Yatheesh",
      jobTitle: "Vice Chairperson",
      email: "emrc@gecskp.ac.in",
    },
  ],
  sameAs: [
    "https://www.instagram.com/emrc_gec",
    "https://www.linkedin.com/company/emrc-gecpkd",
  ],
};

const HomePage = () => {
  return (
    <div className="App">
      <Head>
        <title>EMRC GEC Palakkad</title>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          href="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/favicon.ico?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZmF2aWNvbi5pY28iLCJpYXQiOjE3MTgwMTk4NTYsImV4cCI6MjAzMzM3OTg1Nn0.nwC1NumJ6XgQMieuh4w72nuOQbTpk-72oqt597kRkC8&t=2024-06-10T11%3A44%3A16.398Z"
        />
        <meta
          name="description"
          content="Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Stay updated with our news, events, and research activities."
        />
        <meta
          name="google-site-verification"
          content="RsmQDkTKhMkEqmP3ipd5IGfsQoeIZd3glUMDWGcEhUI"
        />
        <meta
          name="keywords"
          content="EMRC, GEC, EMRC GEC, GEC Palakkad, GECPKD, Government Engineering College, Sreekrishnapuram, Electrical Maintenance and Research Club Palakkad, Electrical Engineering, EMRC Palakkad, EMRC GEC PKD, GECSKP, GECPKD "
        ></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Electrical Maintenance and Research Club (EMRC) - GEC Sreekrishnapuram"
        />
        <meta
          property="og:description"
          content="Official website of the Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Stay updated with our latest news, events, and activities."
        />
        <meta
          property="og:image"
          content="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/pre.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9vcy9wcmUuanBnIiwiaWF0IjoxNzE2Mzg5OTE3LCJleHAiOjIwMzE3NDk5MTd9.5drTGw6A8c_eRDFh1Kxox-E6tQ34Ksg8DcxlMOTu-kU&t=2024-05-22T14%3A58%3A38.182Z"
        />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="281" />
        <meta property="og:url" content="https://emrcgecpkd.vercel.app" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <News />
        <Committee />
        <Newsletter />
        <ContactSection />
        <SocialMediaOverlay />
      </Suspense>
    </div>
  );
};

export default HomePage;
