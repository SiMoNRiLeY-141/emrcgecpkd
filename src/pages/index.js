import React, { Suspense, lazy } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";

const Header = lazy(() => import('../components/Header'));
const SocialMediaOverlay = lazy(() => import('../components/SocialMediaOverlay'));
const Committee = lazy(() => import('../components/Committee'));
const ContactSection = lazy(() => import('../components/ContactSection'));
const News = lazy(() => import('../components/News'));
const Newsletter = lazy(() => import('../components/Newsletter'));

const HomePage = () => {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <News />s
        <Committee />
        <Newsletter />
        <ContactSection />
        <SocialMediaOverlay />
        <SpeedInsights/>
      </Suspense>
    </div>
  );
};

export default HomePage;
