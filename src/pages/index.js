import React, { Suspense, lazy } from "react";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const Header = lazy(() => import("../components/Header"));
const SocialMediaOverlay = lazy(
  () => import("../components/SocialMediaOverlay"),
);
const Committee = lazy(() => import("../components/Committee"));
const ContactSection = lazy(() => import("../components/ContactSection"));
const News = lazy(() => import("../components/News"));
const Newsletter = lazy(() => import("../components/Newsletter"));

const HomePage = () => {
  return (
    <div className="App">
      <Head>
        <title>EMRC GECPKD</title>
        <meta charSet="UTF-8" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Saira:ital,wght@0,100..900;1,100..900&family=Sofadi+One&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Saira:ital,wght@0,100..900;1,100..900&family=Sofadi+One&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/favicon.ico?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvZmF2aWNvbi5pY28iLCJpYXQiOjE3MTczMDg4NzksImV4cCI6MjAzMjY2ODg3OX0.zcGyGIXZgCHG0VKOPFWt1F1JNMr3syMfaTyUISsEfIU&t=2024-06-02T06%3A14%3A39.945Z"
        />
        <meta
          name="description"
          content="Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Stay updated with our news, events, and research activities."
        />
        <meta
          name="google-site-verification"
          content="RsmQDkTKhMkEqmP3ipd5IGfsQoeIZd3glUMDWGcEhUI"
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
          content="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/pre.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9vcy9wcmUuanBnIiwiaWF0IjoxNzE2Mzg5OTE3LCJleHAiOjIwMzE3NDk5MTd9.5drTGw6A8c_eRDFh1Kxox-E6tQ34Ksg8DcxlMOTu-kU&t=2024-05-22T14%3A58%3A38.182Z"
        />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="281" />
        <meta
          property="og:url"
          content="https://simonriley-141.github.io/emrcgec/"
        />
        <meta property="og:type" content="website" />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <News />s
        <Committee />
        <Newsletter />
        <ContactSection />
        <SocialMediaOverlay />
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </div>
  );
};

export default HomePage;
