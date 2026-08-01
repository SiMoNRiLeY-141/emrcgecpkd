import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Volume2, VolumeX } from "lucide-react";
import { toggleMute, getMutedState, playClick } from "../utils/audio";
import { fetchHomePageContent } from "../lib/supabaseContent";
import SeoHead from "../components/SeoHead";
import {
  DEFAULT_DESCRIPTION,
  organizationSchema,
  pageMetadata,
} from "../lib/seo";

import Header from "../components/Header";
import News from "../components/News";

const Committee = dynamic(() => import("../components/Committee"), {
  ssr: true,
});
const Newsletter = dynamic(() => import("../components/Newsletter"), {
  ssr: false,
});
const ContactSection = dynamic(() => import("../components/ContactSection"), {
  ssr: true,
});
const SocialMediaOverlay = dynamic(
  () => import("../components/SocialMediaOverlay"),
  { ssr: false },
);
const JoinClub = dynamic(() => import("../components/JoinClub"), {
  ssr: false,
});
const MaintenancePortal = dynamic(
  () => import("../components/MaintenancePortal"),
  { ssr: false },
);
const ThemeToggle = dynamic(() => import("../components/ThemeToggle"), {
  ssr: false,
});
const ScrollScene3D = dynamic(() => import("../components/ScrollScene3D"), {
  ssr: false,
});
const ScrollSection = dynamic(() => import("../components/ScrollSection"), {
  ssr: false,
});
const StatsMonitor = dynamic(() => import("../components/StatsMonitor"), {
  ssr: false,
});
const SmoothScroll = dynamic(() => import("../components/SmoothScroll"), {
  ssr: false,
});

const homeMetadata = pageMetadata({
  title: "Electrical Maintenance and Research Club, GEC Palakkad",
  description: DEFAULT_DESCRIPTION,
});

const HomePage = ({ initialNews = [], initialCommittee = [] }) => {
  const [muted, setMuted] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMuted(getMutedState());
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const nextState = toggleMute();
    setMuted(nextState);
    if (!nextState) {
      setTimeout(() => playClick(), 50);
    }
  };

  const sections = [
    { key: "header", component: <Header /> },
    { key: "join", component: <JoinClub /> },
    { key: "news", component: <News initialNews={initialNews} /> },
    { key: "maintenance", component: <MaintenancePortal /> },
    {
      key: "committee",
      component: <Committee initialCommittee={initialCommittee} />,
    },
    { key: "newsletter", component: <Newsletter /> },
    { key: "contact", component: <ContactSection /> },
  ];

  return (
    <div className="App min-h-screen bg-transparent text-[var(--text-primary)] selection:bg-cyan-500/30 overflow-x-hidden relative">
      <SeoHead metadata={homeMetadata} schema={organizationSchema} />

      {/* Immersive 3D Backdrop Scene */}
      <ScrollScene3D />

      {/* Diagnostics Performance Monitor */}
      <StatsMonitor />

      <ThemeToggle />

      {/* Global Fixed Volume Controller (Fades on Scroll) */}
      <button
        onClick={handleAudioToggle}
        className={`fixed top-6 right-6 z-[99] p-3 rounded-full border border-accent-primary/20 bg-[#080d1a]/90 backdrop-blur-md text-accent-primary transition-all duration-500 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:border-accent-primary/50 pointer-events-auto cursor-pointer ${
          scrolled
            ? "opacity-0 pointer-events-none scale-90"
            : "opacity-100 pointer-events-auto scale-100"
        }`}
        title={muted ? "Unmute UI Haptics" : "Mute UI Haptics"}
      >
        {muted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4 animate-pulse" />
        )}
      </button>

      <SmoothScroll>
        <main className="relative z-10 mx-auto max-w-[1100px] p-5 pb-20 md:pb-[80px]">
          {sections.map((section, index) => (
            <ScrollSection key={section.key} depth={index}>
              {section.component}
            </ScrollSection>
          ))}
        </main>
      </SmoothScroll>

      <SocialMediaOverlay />
    </div>
  );
};

export default HomePage;

export async function getStaticProps() {
  try {
    const { initialNews, initialCommittee } = await fetchHomePageContent();

    return {
      props: {
        initialNews,
        initialCommittee,
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
