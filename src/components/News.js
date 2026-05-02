// components/News.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const News = ({ initialNews = [] }) => {
  const [news, setNews] = useState(initialNews)
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasInitialData = initialNews.length > 0

  useEffect(() => {
    if (hasInitialData) {
      return
    }

    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data) {
          setNews(data)
        } else {
          setNews([])
        }
      } catch (error) {
        console.error('Error fetching news data:', error.message)
      }
      };

    fetchNews();
  }, [hasInitialData]);

    useEffect(() => {
        if (news.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === news.length - 1 ? 0 : prevIndex + 1
            );
        }, 7000);

        return () => clearInterval(interval);
    }, [news.length]);

  if (news.length === 0) {
    return <div className="glass-panel" style={{ textAlign: "center" }}>No news available.</div>;
  }

    return (
        <motion.div 
            className="glass-panel news-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h2>Latest News</h2>
            <div className="news-slider">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="news-item active"
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                    >
                        <a href={news[currentIndex].url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                            <Image
                                src={news[currentIndex].image_url}
                                alt={news[currentIndex].title}
                                width={819}
                                height={460}
                                loading="eager"
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 800px"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="news-title-overlay">
                                {news[currentIndex].title}
                            </div>
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default News
