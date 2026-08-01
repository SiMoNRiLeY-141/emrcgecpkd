import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { playHover, playClick } from "../utils/audio";

const NO_NEWS_TEXT = "No news available.";
const LATEST_NEWS_TEXT = "Latest News";

const News = ({ initialNews = [] }) => {
  const [news, setNews] = useState(initialNews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasInitialData = initialNews.length > 0;

  useEffect(() => {
    if (hasInitialData) return;

    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data || []);
      } catch (error) {
        console.error("Error fetching news data:", error.message);
        setNews([]);
      }
    };

    fetchNews();
  }, [hasInitialData]);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === news.length - 1 ? 0 : prevIndex + 1,
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [news.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    playClick();
    setCurrentIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    playClick();
    setCurrentIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  if (news.length === 0) {
    return (
      <div className="hud-panel rounded-[24px] p-8 text-center font-mono text-xs uppercase tracking-wider text-text-secondary">
        {NO_NEWS_TEXT}
      </div>
    );
  }

  return (
    <m.div
      className="hud-panel relative overflow-hidden rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-primary/45 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-primary/45 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-primary/45 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-primary/45 rounded-br-lg" />

      {/* Blinking Live telemetry */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-accent-primary/60 tracking-widest select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span>LIVE_FEED</span>
      </div>

      <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] uppercase text-glow-cyan">
        {LATEST_NEWS_TEXT}
      </h2>

      <div className="hud-line mb-8" />

      <div className="news-slider flex overflow-hidden rounded-xl relative aspect-[4/3] md:aspect-[16/9] max-h-[460px] bg-black/60 shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-white/5 m-[0_auto]">
        {news.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <m.div
              key={item.id}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.04,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`news-item absolute top-0 left-0 w-full h-full flex flex-col z-10 ${isActive ? "active" : ""}`}
              style={{
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <Link href={`/news/${item.slug}`} className="block w-full h-full relative">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={640}
                  height={360}
                  priority={isActive}
                  loading={isActive ? "eager" : "lazy"}
                  fetchPriority={isActive ? "high" : "low"}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="w-full h-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100"
                />
                <div
                  className={`news-title-overlay absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white font-mono text-xs md:text-sm tracking-wider leading-relaxed text-left transition-all duration-500 ease-out delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                >
                  <span className="text-accent-primary font-bold mr-2">
                    [NEWS_DIRECTIVE]:
                  </span>
                  {item.title}
                </div>
              </Link>
            </m.div>
          );
        })}

        {/* Cybernetic Navigation Chevrons */}
        <button
          onClick={handlePrev}
          onMouseEnter={playHover}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md border border-accent-primary/20 bg-[#080d1a]/85 text-accent-primary opacity-65 hover:opacity-100 hover:border-accent-primary/75 hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_15px_rgba(0,240,255,0.35)] pointer-events-auto cursor-pointer focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          onMouseEnter={playHover}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md border border-accent-primary/20 bg-[#080d1a]/85 text-accent-primary opacity-65 hover:opacity-100 hover:border-accent-primary/75 hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_15px_rgba(0,240,255,0.35)] pointer-events-auto cursor-pointer focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cybernetic Navigation Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {news.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                playClick();
                setCurrentIndex(idx);
              }}
              onMouseEnter={playHover}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto focus:outline-none ${
                idx === currentIndex
                  ? "bg-accent-primary w-5 shadow-[0_0_8px_var(--accent-primary)]"
                  : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to news item ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </m.div>
  );
};

export default News;
