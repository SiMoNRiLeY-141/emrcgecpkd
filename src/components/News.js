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
      <div className="glass-panel" style={{ textAlign: "center" }}>
        {NO_NEWS_TEXT}
      </div>
    );
  }

  const currentNewsItem = news.at(currentIndex);

  return (
    <m.div
      className="glass-panel news-container"
      initial={{ opacity: 0, scale: 0.85, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2>{LATEST_NEWS_TEXT}</h2>
      <div className="news-slider">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="news-item active"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            <a
              href={currentNewsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <Image
                src={currentNewsItem.image_url}
                alt={currentNewsItem.title}
                width={819}
                height={460}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="news-title-overlay">
                {currentNewsItem.title}
              </div>
            </a>
          </m.div>
        </AnimatePresence>
      </div>
    </m.div>
  );
};

export default News;
