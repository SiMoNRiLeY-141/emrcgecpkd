// components/News.js
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";

const NO_NEWS_TEXT = "No news available.";
const LATEST_NEWS_TEXT = "Latest News";

const News = ({ initialNews = [] }) => {
  const [news, setNews] = useState(initialNews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasInitialData = initialNews.length > 0;

  useEffect(() => {
    if (hasInitialData) {
      return;
    }

    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching news data:", error.message);
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

  if (news.length === 0) {
    return (
      <div className="glass-panel bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center">
        {NO_NEWS_TEXT}
      </div>
    );
  }

  return (
    <m.div
      className="glass-panel news-container relative overflow-hidden bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.85, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        {LATEST_NEWS_TEXT}
      </h2>
      <div className="news-slider flex overflow-hidden rounded-2xl relative aspect-[4/3] md:aspect-[16/9] max-h-[500px] bg-[rgba(0,0,0,0.5)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] m-[0_auto]">
        {news.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <m.div
              key={item.id}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.05,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`news-item absolute top-0 left-0 w-full h-full flex flex-col ${isActive ? "active" : ""}`}
              style={{
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={640}
                  height={360}
                  priority
                  loading="eager"
                  fetchPriority="high"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="w-full h-full object-cover"
                />
                <div className={`news-title-overlay absolute bottom-0 left-0 right-0 p-[40px_20px_20px] md:p-[60px_30px_30px] bg-gradient-to-t from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.6)] to-transparent text-white text-lg md:text-2xl font-semibold text-left transition-all duration-500 ease-out delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                  {item.title}
                </div>
              </a>
            </m.div>
          );
        })}
      </div>
    </m.div>
  );
};

export default News;
