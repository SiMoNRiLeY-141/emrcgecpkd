import React from "react";
import Head from "next/head";

import Header from "../components/Header";
import SocialMediaOverlay from "../components/SocialMediaOverlay";
import Committee from "../components/Committee";
import ContactSection from "../components/ContactSection";
import News from "../components/News";
import Newsletter from "../components/Newsletter";
const siteUrl = "https://emrcgecpkd.vercel.app";
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: "EMRC GEC Palakkad",
  alternateName: "Electrical Maintenance and Research Club GEC Palakkad",
  url: siteUrl,
  logo: `${siteUrl}/_next/image?url=https%3A%2F%2Fjfgkhseftiwquikjuhcv.supabase.co%2Fstorage%2Fv1%2Fobject%2Fsign%2Fassets%2Flogos%2Femrc.webp%3Ftoken%3DeyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZjY3MzJmMi0zYjEzLTQzM2UtYTZhYy02MmRjYjgxZWU3NDciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZW1yYy53ZWJwIiwiaWF0IjoxNzY3ODAzNDcxLCJleHAiOjIwODMxNjM0NzF9.442mNilSOJn3gO0CpuKXEbAp6oZWaMp0UDlANM7C4lU%26w%3D128%26q%3D75`,
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

const HomePage = ({ initialNews = [], initialCommittee = [] }) => {
  return (
    <div className="App">
      <Head>
        <title>Electrical Maintenance and Research Club, GEC Palakkad</title>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          href="https://emrcgecpkd.vercel.app/favicon.svg"
        />
        <meta
          name="description"
          content="Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Stay updated with our news, events, and research activities."
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href={siteUrl} />
        <meta
          name="google-site-verification"
          content="RsmQDkTKhMkEqmP3ipd5IGfsQoeIZd3glUMDWGcEhUI"
        />
        <meta
          name="keywords"
          content="EMRC, GEC, EMRC GEC, GEC Palakkad, GECPKD, Government Engineering College, Sreekrishnapuram, Electrical Maintenance and Research Club Palakkad, Electrical Engineering, EMRC Palakkad, EMRC GEC PKD, GECSKP, GECPKD "
        ></meta>
        <link
          rel="preload"
          href="/fonts/memjYa2wxmKQyPMrZX79wwYZQMhsyuSLiIvSdyqOvg.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/YA9Qr0Wd4kDdMtDqHTLMkiQqtbGs.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/YA9dr0Wd4kDdMthROCfhsCkA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
          content="https://jfgkhseftiwquikjuhcv.supabase.co/storage/v1/object/sign/assets/logos/pre.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9vcy9wcmUuanBnIiwiaWF0IjoxNzE2Mzg5OTE3LCJleHAiOjIwMzE3NDk5MTd9.5drTGw6A8c_eRDFh1Kxox-E6tQ34Ksg8DcxlMOTu-kU&t=2024-05-22T14%3A58%3A38.182Z"
        />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="281" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </Head>
      <main>
        <Header />
        <News initialNews={initialNews} />
        <Committee initialCommittee={initialCommittee} />
        <Newsletter />
        <ContactSection />
      </main>
      <SocialMediaOverlay />
    </div>
  );
};

export async function getStaticProps() {
  try {
    const { default: supabase } = await import("./api/supabase");
    const [{ data: newsData, error: newsError }, { data: committeeData, error: committeeError }] = await Promise.all([
      supabase.from("news").select("id, title, image_url, url"),
      supabase.from("committee").select("id, name, position, photo_url").order("id", { ascending: true }),
    ]);

    if (newsError || committeeError) {
      throw new Error(newsError?.message || committeeError?.message);
    }

    return {
      props: {
        initialNews: newsData || [],
        initialCommittee: committeeData || [],
      },
      revalidate: 300,
    };
  } catch {
    return {
      props: {
        initialNews: [],
        initialCommittee: [],
      },
      revalidate: 120,
    };
  }
}

export default HomePage;
